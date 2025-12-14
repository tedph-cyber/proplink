'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userEmail, setUserEmail] = useState('')
  const [formData, setFormData] = useState({
    whatsapp_number: '',
    seller_type: 'individual' as 'individual' | 'agent' | 'developer',
    company_name: '',
  })

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      setUserEmail(user.email || '')

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        const typedProfile = data as Profile
        setProfile(typedProfile)
        setFormData({
          whatsapp_number: typedProfile.whatsapp_number || '',
          seller_type: typedProfile.seller_type || 'individual',
          company_name: typedProfile.company_name || '',
        })
      }
      
      setLoading(false)
    }

    loadProfile()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        whatsapp_number: formData.whatsapp_number,
        seller_type: formData.seller_type,
        company_name: formData.company_name,
      })
      .eq('id', user.id)

    if (error) {
      setMessage('Error updating profile: ' + error.message)
    } else {
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Profile Settings</h1>
        <p className="mt-2 text-zinc-600">Manage your account information</p>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Email
            </label>
            <Input
              type="email"
              value={userEmail}
              disabled
              className="bg-zinc-50"
            />
            <p className="mt-1 text-xs text-zinc-500">Email cannot be changed</p>
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              WhatsApp Number
            </label>
            <Input
              type="tel"
              placeholder="+234 XXX XXX XXXX"
              value={formData.whatsapp_number}
              onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
            />
            <p className="mt-1 text-xs text-zinc-500">
              Include country code (e.g., +234 for Nigeria)
            </p>
          </div>

          {/* Seller Type */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Account Type
            </label>
            <select
              value={formData.seller_type}
              onChange={(e) => setFormData({ ...formData, seller_type: e.target.value as 'individual' | 'agent' | 'developer' })}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            >
              <option value="individual">Individual</option>
              <option value="agent">Agent</option>
              <option value="developer">Developer</option>
            </select>
          </div>

          {/* Company Name */}
          {(formData.seller_type === 'agent' || formData.seller_type === 'developer') && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Company Name
              </label>
              <Input
                type="text"
                placeholder="Your company name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              />
            </div>
          )}

          {/* Success/Error Message */}
          {message && (
            <div className={`rounded-md p-3 text-sm ${
              message.includes('Error') 
                ? 'bg-red-50 text-red-800' 
                : 'bg-green-50 text-green-800'
            }`}>
              {message}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
