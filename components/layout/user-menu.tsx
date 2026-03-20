'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ToggleTheme } from '@/components/ui/toggle-theme'
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
        className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--accent)]"
      >
        <div className="h-6 w-6 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs">
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
          <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-lg z-20 backdrop-blur-sm">
            <div className="border-b border-[var(--border)] px-4 py-3">
              <p className="text-sm font-medium text-[var(--card-foreground)] truncate">{user.email}</p>
              <p className="text-xs text-[var(--muted-foreground)]">Seller Account</p>
            </div>

            <div className="py-2">
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/properties"
                className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
                onClick={() => setIsOpen(false)}
              >
                My Properties
              </Link>
              <Link
                href="/dashboard/profile"
                className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
                onClick={() => setIsOpen(false)}
              >
                Profile Settings
              </Link>
            </div>

            {/* Theme Toggle Section */}
            <div className="border-t border-[var(--border)] py-2">
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-sm text-[var(--foreground)]">Theme</span>
                <ToggleTheme />
              </div>
            </div>

            <div className="border-t border-[var(--border)] py-2">
              <button
                onClick={handleLogout}
                disabled={loading}
                className="block w-full px-4 py-2 text-left text-sm text-[var(--destructive)] hover:bg-[var(--destructive)]/10 disabled:opacity-50"
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
