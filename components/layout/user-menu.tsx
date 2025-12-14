'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface UserMenuProps {
  user: User
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
      >
        <div className="h-6 w-6 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs">
          {user.email?.[0].toUpperCase()}
        </div>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-zinc-200 bg-white shadow-lg z-20">
            <div className="border-b border-zinc-200 px-4 py-3">
              <p className="text-sm font-medium text-zinc-900 truncate">{user.email}</p>
              <p className="text-xs text-zinc-500">Seller Account</p>
            </div>

            <div className="py-2">
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/properties"
                className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                onClick={() => setIsOpen(false)}
              >
                My Properties
              </Link>
              <Link
                href="/dashboard/profile"
                className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                onClick={() => setIsOpen(false)}
              >
                Profile Settings
              </Link>
            </div>

            <div className="border-t border-zinc-200 py-2">
              <button
                onClick={handleLogout}
                disabled={loading}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {loading ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
