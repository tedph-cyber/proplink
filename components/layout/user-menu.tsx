'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import styles from '@/styles/header.module.css'

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
        className={styles.userTrigger}
      >
        <div className={styles.userAvatar}>
          {user.email?.[0].toUpperCase()}
        </div>
        <svg
          className={`${styles.userChevron}${isOpen ? ` ${styles.userChevronOpen}` : ''}`}
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
          <div className={styles.userDropdown}>
            <div className={styles.userDropdownHeader}>
              <p className={styles.userDropdownEmail}>{user.email}</p>
              <p className={styles.userDropdownRole}>Seller Account</p>
            </div>

            <div>
              <Link
                href="/dashboard"
                className={styles.userDropdownItem}
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/properties"
                className={styles.userDropdownItem}
                onClick={() => setIsOpen(false)}
              >
                My Properties
              </Link>
              <Link
                href="/dashboard/profile"
                className={styles.userDropdownItem}
                onClick={() => setIsOpen(false)}
              >
                Profile Settings
              </Link>
            </div>

            <div className={styles.userDropdownDivider}>
              <button
                onClick={handleLogout}
                disabled={loading}
                className={styles.userDropdownSignOut}
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
