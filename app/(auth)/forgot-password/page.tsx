'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      })
      if (resetError) throw resetError
      setSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-[400px] mx-auto bg-[var(--color-surface)] rounded-2xl shadow-[0_24px_48px_-12px_rgba(10,29,47,0.08)] p-8 flex flex-col"
    >
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-14 h-14 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-[var(--color-text)] mb-2">Check your email</h2>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-6">
              We sent a password reset link to <span className="font-bold text-[var(--color-text)]">{email}</span>.
              The link expires in 1 hour.
            </p>
            <Link
              href="/login"
              className="text-sm font-bold text-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
            >
              ← Back to Login
            </Link>
          </motion.div>
        ) : (
          <motion.div key="form">
            <div className="flex flex-col items-center mb-8">
              <span className="font-display text-3xl font-bold tracking-tight text-[var(--color-text)]">StrongTower</span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-accent)] uppercase">Holdings</span>
              <h1 className="mt-6 text-2xl font-bold text-[var(--color-text)] tracking-tight">Reset Password</h1>
              <p className="mt-1 text-sm text-[var(--color-text-muted)] text-center">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-start gap-2"
                >
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-[0.05em] text-[var(--color-text-muted)]">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[var(--color-surface-2)] border-none rounded-lg px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:bg-[var(--color-surface)] transition-all duration-300"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[var(--color-accent)] w-full py-3.5 rounded-xl text-white font-bold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[var(--color-border)]/20 text-center">
              <Link href="/login" className="text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors">
                ← Back to Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
