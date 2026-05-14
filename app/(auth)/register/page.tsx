'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { SellerType } from '@/lib/types'
import styles from '@/styles/auth.module.css'

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [sellerType, setSellerType] = useState<SellerType>('individual')
  const [companyName, setCompanyName] = useState('')
  const [username, setUsername] = useState('')
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
            username: username || null,
          },
        },
      })
      if (authError) throw authError

      if (authData.user) {
        if (!authData.session) {
          setEmailSent(true)
        } else {
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
        className="w-full max-w-[420px] mx-auto"
      >
        <div className={styles.card}>
          <div className={styles.successCard}>
            <div className={styles.successIconMail}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className={styles.successTitle}>Check your email</h2>
            <p className={styles.successText}>
              We sent a confirmation link to <span className={styles.successHighlight}>{email}</span>.
            </p>
            <p className={styles.successText}>
              Click the link in the email to activate your account, then come back to log in.
            </p>
            <Link href="/login" className={styles.successBtn}>
              Go to Login
            </Link>
          </div>
        </div>
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
      <div className={styles.card}>
        <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-xl bg-[var(--color-accent-muted)] blur-3xl" />

        <div className="relative">
          <div className="mb-8">
            <h1 className={styles.heading}>Create Account</h1>
            <p className={styles.subtitle}>Join the premium network of Nigeria&apos;s finest digital estates.</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={styles.bannerError}
              >
                <svg className={styles.bannerIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Account Type */}
            <div className={styles.field}>
              <label className={styles.label}>Account Type</label>
              <div className={styles.selectorGrid}>
                {typeOptions.map(({ value, label, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSellerType(value)}
                    className={sellerType === value ? styles.selectorActive : styles.selectorBtn}
                  >
                    <span className={styles.selectorLabel}>{label}</span>
                    <span className={styles.selectorDesc}>{desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Company/Agency name */}
            <AnimatePresence>
              {(sellerType === 'agent' || sellerType === 'developer') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className={styles.field}>
                    <label className={styles.label}>
                      {sellerType === 'developer' ? 'Company Name' : 'Agency Name'}
                    </label>
                    <input
                      type="text"
                      placeholder={sellerType === 'developer' ? 'e.g. Landmark Realty Group' : 'e.g. Prime Homes Agency'}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email + WhatsApp + Username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={styles.field}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>WhatsApp Number</label>
                <input
                  type="tel"
                  placeholder="+234..."
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className={styles.input}
                  required
                />
                <span className="mt-1 block text-[10px] text-[var(--color-text-hint)] italic">Include country code (e.g. +234)</span>
              </div>
            </div>

            {/* Username */}
            <div className={styles.field}>
              <label className={styles.label}>
                Username <span className="text-[var(--color-text-hint)] font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="Choose a public handle"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
              />
            </div>

            {/* Password */}
            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputPasswordWrap}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.inputPassword}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.inputToggle}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && password.length < 6 && (
                <p className="mt-1 text-xs text-[var(--color-destructive)]">Password must be at least 6 characters</p>
              )}
            </div>

            {/* Terms */}
            <div className={styles.termsRow}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className={styles.termsCheckbox}
                required
              />
              <span className={styles.termsLabel}>
                By clicking &ldquo;Create Account&rdquo;, I agree to StrongTower Holdings&apos;s{' '}
                <Link href="/terms">Terms of Service</Link>{' '}
                and{' '}
                <Link href="/privacy">Privacy Policy</Link>.
              </span>
            </div>

            <button type="submit" disabled={loading} className={styles.btnPrimary}>
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <div className={styles.divider}>
            <p className={styles.footerText}>
              Already have an account?{' '}
              <Link href="/login" className={styles.footerLink}>
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className={styles.badges}>
        <div className={styles.badge}>
          <svg className={styles.badgeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className={styles.badgeLabel}>Secure Encryption</span>
        </div>
        <div className={styles.badge}>
          <svg className={styles.badgeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className={styles.badgeLabel}>Privacy Protected</span>
        </div>
      </div>
    </motion.div>
  )
}
