'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-2xl backdrop-blur-xl bg-white/90 dark:bg-zinc-900/80 border border-[var(--border)] p-8 shadow-2xl w-full"
    >
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Create Seller Account</h1>
        <p className="text-[var(--muted-foreground)]">Start listing your properties today</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-3 text-sm text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Fields Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-[var(--foreground)] mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              placeholder="John"
              value={email.split('@')[0] || ''}
              onChange={(e) => {}}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              placeholder="Doe"
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-[var(--border)] rounded-lg bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-[var(--muted)] rounded transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-[var(--muted-foreground)]" />
              ) : (
                <Eye className="w-4 h-4 text-[var(--muted-foreground)]" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-[var(--border)] rounded-lg bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-[var(--muted)] rounded transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4 text-[var(--muted-foreground)]" />
              ) : (
                <Eye className="w-4 h-4 text-[var(--muted-foreground)]" />
              )}
            </button>
          </div>
        </div>

        {/* WhatsApp Number */}
        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-[var(--foreground)] mb-2">
            WhatsApp Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="whatsapp"
            placeholder="e.g., 2348012345678"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
            required
          />
        </div>

        {/* Account Type */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-[var(--foreground)]">
            Account Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="individual"
                checked={sellerType === 'individual'}
                onChange={(e) => setSellerType(e.target.value as 'individual' | 'company')}
                className="h-4 w-4"
              />
              <span className="text-sm text-[var(--foreground)]">Individual</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="company"
                checked={sellerType === 'company'}
                onChange={(e) => setSellerType(e.target.value as 'individual' | 'company')}
                className="h-4 w-4"
              />
              <span className="text-sm text-[var(--foreground)]">Company</span>
            </label>
          </div>
        </div>

        {/* Company Name (conditional) */}
        {sellerType === 'company' && (
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              placeholder="Your company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
              required
            />
          </div>
        )}

        {/* Terms Agreement */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            className="h-4 w-4 mt-1 rounded border-[var(--border)] accent-blue-600"
            required
          />
          <label htmlFor="terms" className="text-xs text-[var(--muted-foreground)]">
            I agree to the{' '}
            <Link href="/terms" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Terms & Conditions
            </Link>
          </label>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
          Sign in
        </Link>
      </div>
    </motion.div>
  )
}

