'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { SellerType } from '@/lib/types'

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [sellerType, setSellerType] = useState<SellerType>('individual')
  const [companyName, setCompanyName] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (!whatsappNumber.trim()) {
      setError('WhatsApp number is required')
      return
    }
    if ((sellerType === 'agent' || sellerType === 'developer') && !companyName.trim()) {
      setError('Company / agency name is required for this account type')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()

      // Store profile data in user metadata so the auth/callback route
      // can create the profile AFTER the user is authenticated (post-confirmation).
      // This avoids RLS failures when session is null (email confirmation required).
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            role: 'seller',
            seller_type: sellerType,
        company_name: sellerType !== 'individual' ? companyName : null,
            whatsapp_number: whatsappNumber,
          },
        },
      })
      if (authError) throw authError

      if (authData.user) {
        if (!authData.session) {
          // Email confirmation is required — profile will be created in /auth/callback
          setEmailSent(true)
        } else {
          // Auto-confirmed — create profile now (user is authenticated)
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: authData.user.id,
            role: 'seller',
            seller_type: sellerType,
            company_name: sellerType !== 'individual' ? companyName : null,
            whatsapp_number: whatsappNumber,
          })
          if (profileError) throw new Error(profileError.message)
          router.push('/dashboard')
          router.refresh()
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3.5 bg-[var(--color-surface-2)] border-none rounded-lg text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:bg-[var(--color-surface)] transition-all duration-300"
  const labelClass = "block text-[11px] font-bold uppercase tracking-[0.05em] text-[var(--color-text-muted)] mb-1.5"

  const typeOptions: { value: SellerType; label: string; desc: string }[] = [
    { value: 'individual', label: 'Individual', desc: 'Private owner' },
    { value: 'agent', label: 'Agent', desc: 'Licensed agent' },
    { value: 'developer', label: 'Developer', desc: 'Company / firm' },
  ]

  // ── Email confirmation sent screen ──
  if (emailSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto bg-[var(--color-surface)] rounded-2xl px-8 py-12 shadow-[0_32px_64px_-16px_rgba(10,29,47,0.08)] text-center"
      >
        <div className="w-16 h-16 rounded-xl bg-green-50 border-2 border-green-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-[var(--color-text)] mb-3">Check your email</h2>
        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-2">
          We sent a confirmation link to <span className="font-bold text-[var(--color-text)]">{email}</span>.
        </p>
        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-8">
          Click the link in the email to activate your account, then come back to log in.
        </p>
        <Link
          href="/login"
          className="bg-[var(--color-accent)] inline-block px-8 py-3.5 rounded-xl text-white font-bold text-sm shadow-[var(--shadow-card)]"
        >
          Go to Login
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="bg-[var(--color-surface)] rounded-2xl px-8 py-10 shadow-[0_32px_64px_-16px_rgba(10,29,47,0.08)] relative overflow-hidden">
        <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-xl bg-[var(--color-accent-muted)] blur-3xl" />

        <div className="relative">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)]">Create Account</h1>
            <p className="mt-2 text-[var(--color-text-muted)] text-base">Join the premium network of Nigeria&apos;s finest digital estates.</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-start gap-2"
              >
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Account Type — 3-way selector matching SellerType */}
            <div className="space-y-1.5">
              <label className={labelClass}>Account Type</label>
              <div className="grid grid-cols-3 p-1 bg-[var(--color-surface-2)] rounded-xl gap-1">
                {typeOptions.map(({ value, label, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSellerType(value)}
                    className={`flex flex-col items-center py-2.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      sellerType === value
                        ? 'bg-[var(--color-surface)] text-[var(--color-accent)] shadow-sm'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    <span className="font-bold text-[13px]">{label}</span>
                    <span className="opacity-60 text-[10px] mt-0.5 hidden sm:block">{desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Company/Agency name — shown for agent & developer */}
            <AnimatePresence>
              {(sellerType === 'agent' || sellerType === 'developer') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className={labelClass}>
                    {sellerType === 'developer' ? 'Company Name' : 'Agency Name'}
                  </label>
                  <input
                    type="text"
                    placeholder={sellerType === 'developer' ? 'e.g. Landmark Realty Group' : 'e.g. Prime Homes Agency'}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className={inputClass}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email + WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>WhatsApp Number</label>
                <input
                  type="tel"
                  placeholder="+234..."
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className={inputClass}
                  required
                />
                <span className="mt-1 block text-[10px] text-[var(--color-text-muted)]/60 italic">Include country code (e.g. +234)</span>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass + ' pr-12'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]/60 hover:text-[var(--color-accent)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && password.length < 6 && (
                <p className="mt-1 text-xs text-red-500">Password must be at least 6 characters</p>
              )}
            </div>

            {/* Terms */}
            <div className="pt-1">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-none bg-[var(--color-surface-2)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]/20"
                  required
                />
                <span className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  By clicking &ldquo;Create Account&rdquo;, I agree to StrongTower Holdings&apos;s{' '}
                  <Link href="/terms" className="text-[var(--color-accent)] hover:underline font-medium">Terms of Service</Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-[var(--color-accent)] hover:underline font-medium">Privacy Policy</Link>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[var(--color-accent)] w-full py-4 rounded-xl text-white font-bold text-base shadow-[var(--shadow-card)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--color-text-muted)]">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors ml-1">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-8 opacity-40 saturate-0">
        <div className="flex items-center gap-2 text-[var(--color-text)]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          <span className="text-[10px] font-bold uppercase tracking-widest">Secure Encryption</span>
        </div>
        <div className="flex items-center gap-2 text-[var(--color-text)]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          <span className="text-[10px] font-bold uppercase tracking-widest">Privacy Protected</span>
        </div>
      </div>
    </motion.div>
  )
}
