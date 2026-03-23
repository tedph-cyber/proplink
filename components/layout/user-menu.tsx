'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface UserMenuProps {
  user: User
  isAdmin?: boolean
}

export function UserMenu({ user, isAdmin = false }: UserMenuProps) {
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

  const close = () => setIsOpen(false)

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
          <div className="fixed inset-0 z-10" onClick={close} />
          <div className="absolute right-0 top-full mt-2 w-60 rounded-xl border border-zinc-200 bg-white shadow-lg z-20 overflow-hidden">
            {/* Identity */}
            <div className="border-b border-zinc-200 px-4 py-3">
              <p className="text-sm font-medium text-zinc-900 truncate">{user.email}</p>
              <p className="text-xs text-zinc-500">{isAdmin ? 'Administrator' : 'Seller Account'}</p>
            </div>

            {/* Admin shortcuts */}
            {isAdmin && (
              <div className="border-b border-zinc-100 py-1.5 bg-purple-50/50">
                <p className="px-4 pt-1 pb-1 text-[10px] font-semibold text-purple-400 uppercase tracking-widest">Admin</p>
                <Link href="/admin" className="block px-4 py-2 text-sm text-purple-700 hover:bg-purple-100 transition-colors" onClick={close}>
                  Admin Dashboard
                </Link>
                <Link href="/admin/blog" className="block px-4 py-2 text-sm text-purple-700 hover:bg-purple-100 transition-colors" onClick={close}>
                  Manage Blog
                </Link>
                <Link href="/admin/blog/new" className="block px-4 py-2 text-sm text-purple-700 hover:bg-purple-100 transition-colors font-medium" onClick={close}>
                  + Write New Post
                </Link>
              </div>
            )}

            {/* Seller links */}
            <div className="py-1.5">
              <Link href="/dashboard" className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50" onClick={close}>
                Dashboard
              </Link>
              <Link href="/dashboard/properties" className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50" onClick={close}>
                My Properties
              </Link>
              <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50" onClick={close}>
                Profile Settings
              </Link>
            </div>

            {/* Sign out */}
            <div className="border-t border-zinc-200 py-1.5">
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
