'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { SignUpForm, SignUpData } from '@/components/ui/sign-up-form'
import { createClient } from '@/lib/supabase/client'

export function SignUpPage() {
  const router = useRouter()

  const handleSignUp = async (formData: SignUpData) => {
    try {
      const supabase = createClient()

      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) throw new Error(authError.message)

      if (!authData.user) {
        throw new Error('Failed to create user account')
      }

      // Create user profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        role: 'buyer', // Default role, can be changed later
        email: formData.email,
        // You can add more fields as needed
      })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        throw new Error('Failed to create profile. Please contact support.')
      }

      // Redirect to dashboard or onboarding
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      throw error // Re-throw to let the form component handle the error display
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden bg-[var(--background)]">
        {/* Left Panel - Brand Asset */}
        <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 hidden md:flex items-center justify-center p-8">
          <div className="absolute top-6 left-6 z-10">
            <button
              onClick={() => router.push('/')}
              className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Brand Content */}
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">StrongTower Holdings</h2>
            <p className="text-white/80 max-w-sm">
              Find your perfect property or list your home with ease. Join our community of buyers and sellers.
            </p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <SignUpForm onSubmit={handleSignUp} userType="buyer" />
        </div>
      </div>
    </div>
  )
}
