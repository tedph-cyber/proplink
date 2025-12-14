'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [sellerType, setSellerType] = useState<'individual' | 'company'>('individual')
  const [companyName, setCompanyName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (!whatsappNumber.trim()) {
      setError('WhatsApp number is required')
      return
    }

    if (sellerType === 'company' && !companyName.trim()) {
      setError('Company name is required for company accounts')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          role: 'seller',
          seller_type: sellerType,
          company_name: sellerType === 'company' ? companyName : null,
          whatsapp_number: whatsappNumber,
        })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          throw new Error('Failed to create profile. Please contact support.')
        }

        // Redirect to dashboard
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg bg-white p-8 shadow-md">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Create Seller Account</h1>
        <p className="mt-2 text-sm text-zinc-600">Start listing your properties today</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="Email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          label="Password"
          placeholder="Minimum 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          type="password"
          label="Confirm Password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Input
          type="tel"
          label="WhatsApp Number"
          placeholder="e.g., 2348012345678"
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          required
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">
            Account Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="individual"
                checked={sellerType === 'individual'}
                onChange={(e) => setSellerType(e.target.value as 'individual' | 'company')}
                className="h-4 w-4 text-zinc-900"
              />
              <span className="text-sm text-zinc-700">Individual</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="company"
                checked={sellerType === 'company'}
                onChange={(e) => setSellerType(e.target.value as 'individual' | 'company')}
                className="h-4 w-4 text-zinc-900"
              />
              <span className="text-sm text-zinc-700">Company</span>
            </label>
          </div>
        </div>

        {sellerType === 'company' && (
          <Input
            type="text"
            label="Company Name"
            placeholder="Your company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-zinc-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-zinc-900 hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}

