'use client'

import Link from 'next/link'
import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { UserMenu } from './user-menu'

interface MobileNavProps {
  user: User | null
  isAdmin: boolean
}

export function MobileNav({ user, isAdmin }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    console.log('Toggle menu clicked, current state:', isOpen)
    setIsOpen(!isOpen)
  }
  const closeMenu = () => setIsOpen(false)

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="inline-flex items-center justify-center p-2 rounded-[var(--radius)] text-[var(--foreground)] hover:text-[var(--primary)] hover:bg-[var(--muted)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Menu Panel */}
          <div className="fixed top-16 right-0 left-0 z-[70] bg-[var(--background)] border-b border-[var(--border)] shadow-[var(--shadow-xl)] animate-in slide-in-from-top duration-200">
            <nav className="container mx-auto px-4 py-4 space-y-3 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {/* Browse Properties */}
              <Link
                href="/properties"
                onClick={closeMenu}
                className="block px-4 py-3 text-base font-medium text-[var(--foreground)] hover:text-[var(--primary)] hover:bg-[var(--muted)] rounded-[var(--radius)] transition-colors tracking-[var(--letter-spacing)]"
              >
                Browse Properties
              </Link>

              {/* Blog */}
              <Link
                href="/blog"
                onClick={closeMenu}
                className="block px-4 py-3 text-base font-medium text-[var(--foreground)] hover:text-[var(--primary)] hover:bg-[var(--muted)] rounded-[var(--radius)] transition-colors tracking-[var(--letter-spacing)]"
              >
                Blog
              </Link>

              {/* Admin links (if admin) */}
              {isAdmin && (
                <>
                  <Link
                    href="/admin"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-base font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-[var(--radius)] transition-colors"
                  >
                    👑 Admin Dashboard
                  </Link>
                  <Link
                    href="/admin/blog"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-base font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-[var(--radius)] transition-colors"
                  >
                    📝 Manage Blog
                  </Link>
                  <Link
                    href="/admin/blog/new"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-base font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-[var(--radius)] transition-colors"
                  >
                    ✏️ Write New Post
                  </Link>
                </>
              )}

              {/* Divider */}
              <div className="border-t border-[var(--border)] my-2" />

              {/* User-specific links */}
              {user ? (
                <>
                  {/* Dashboard Link */}
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-base font-medium text-[var(--foreground)] hover:text-[var(--primary)] hover:bg-[var(--muted)] rounded-[var(--radius)] transition-colors tracking-[var(--letter-spacing)]"
                  >
                    📊 Dashboard
                  </Link>

                  {/* My Properties */}
                  <Link
                    href="/dashboard/properties"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-base font-medium text-[var(--foreground)] hover:text-[var(--primary)] hover:bg-[var(--muted)] rounded-[var(--radius)] transition-colors tracking-[var(--letter-spacing)]"
                  >
                    🏘️ My Properties
                  </Link>

                  {/* List New Property */}
                  <Link
                    href="/dashboard/properties/new"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-base font-medium bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 rounded-[var(--radius)] transition-colors tracking-[var(--letter-spacing)] text-center"
                  >
                    ➕ List Property
                  </Link>

                  {/* Profile */}
                  <Link
                    href="/dashboard/profile"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-base font-medium text-[var(--foreground)] hover:text-[var(--primary)] hover:bg-[var(--muted)] rounded-[var(--radius)] transition-colors tracking-[var(--letter-spacing)]"
                  >
                    👤 Profile
                  </Link>

                  {/* Divider */}
                  <div className="border-t border-[var(--border)] my-2" />

                  {/* User Info */}
                  <div className="px-4 py-2">
                    <p className="text-xs text-[var(--muted-foreground)] tracking-[var(--letter-spacing)]">
                      Signed in as
                    </p>
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* Logout Form */}
                  <form action="/auth/signout" method="post">
                    <button
                      type="submit"
                      onClick={closeMenu}
                      className="w-full text-left px-4 py-3 text-base font-medium text-[var(--destructive)] hover:bg-[var(--destructive)]/10 rounded-[var(--radius)] transition-colors tracking-[var(--letter-spacing)]"
                    >
                      🚪 Sign Out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  {/* Login */}
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-base font-medium text-[var(--foreground)] hover:text-[var(--primary)] hover:bg-[var(--muted)] rounded-[var(--radius)] transition-colors tracking-[var(--letter-spacing)]"
                  >
                    🔐 Login
                  </Link>

                  {/* Register */}
                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-base font-medium bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 rounded-[var(--radius)] transition-colors tracking-[var(--letter-spacing)] text-center"
                  >
                    ✨ Create Account
                  </Link>
                </>
              )}
            </nav>
          </div>
        </>
      )}
    </div>
  )
}
