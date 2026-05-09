'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/types'

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [userEmail, setUserEmail] = useState('')
  const [formData, setFormData] = useState({
    whatsapp_number: '',
    seller_type: 'individual' as 'individual' | 'agent' | 'developer',
    company_name: '',
  })

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserEmail(user.email || '')
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        const p = data as Profile
        setFormData({
          whatsapp_number: p.whatsapp_number || '',
          seller_type: p.seller_type || 'individual',
          company_name: p.company_name || '',
        })
      }
      setLoading(false)
    }
    loadProfile()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { error } = await supabase.from('profiles').update({
      whatsapp_number: formData.whatsapp_number,
      seller_type: formData.seller_type,
      company_name: formData.company_name,
    }).eq('id', user.id)
    if (error) {
      setMessage({ type: 'error', text: 'Error updating profile: ' + error.message })
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setTimeout(() => setMessage(null), 4000)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-10 h-10 rounded-full border-4 border-[var(--color-surface-2)] border-t-[var(--color-accent)] animate-spin" />
      </div>
    )
  }

  const typeOptions = [
    { value: 'individual', label: 'Individual', desc: 'Private property owner', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { value: 'agent', label: 'Agent', desc: 'Licensed real estate agent', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { value: 'developer', label: 'Developer', desc: 'Property developer or company', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  ]

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-text)] mb-1">Profile Settings</h1>
        <p className="text-[var(--color-text-muted)]">Manage your account information and preferences.</p>
      </div>

      {/* Email card (read-only) */}
      <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-[var(--shadow-card)]">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Account Email</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-muted)] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-[var(--color-text)]">{userEmail}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Email address cannot be changed</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Type */}
        <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-[var(--shadow-card)] space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Account Type</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {typeOptions.map(({ value, label, desc, icon }) => {
              const active = formData.seller_type === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, seller_type: value as typeof formData.seller_type })}
                  className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left ${
                    active
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-muted)]'
                      : 'border-[var(--color-surface-2)] bg-[var(--color-surface-2)]/50 hover:border-[var(--color-border)]'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${active ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-muted)]'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                    </svg>
                  </div>
                  <p className={`font-bold text-sm ${active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]'}`}>{label}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{desc}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Contact & Identity */}
        <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-[var(--shadow-card)] space-y-5">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Contact Details</p>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">
              WhatsApp Number
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <input
                type="tel"
                placeholder="+234 XXX XXX XXXX"
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                className="w-full pl-11 pr-4 py-3.5 bg-[var(--color-surface-2)] border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:bg-[var(--color-surface)] transition-all outline-none text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
              />
            </div>
            <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">Include country code, e.g., +234 for Nigeria</p>
          </div>

          {/* Company Name (conditional) */}
          {(formData.seller_type === 'agent' || formData.seller_type === 'developer') && (
            <div>
              <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">
                Company Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Your company or agency name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 bg-[var(--color-surface-2)] border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:bg-[var(--color-surface)] transition-all outline-none text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className={`flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-semibold ${
            message.type === 'error'
              ? 'bg-red-50 text-red-700 border border-red-100'
              : 'bg-green-50 text-green-700 border border-green-100'
          }`}>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {message.type === 'error'
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              }
            </svg>
            {message.text}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-[var(--color-accent)] px-8 py-3.5 rounded-xl text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="px-8 py-3.5 rounded-full font-bold text-sm bg-[var(--color-surface-2)] text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
