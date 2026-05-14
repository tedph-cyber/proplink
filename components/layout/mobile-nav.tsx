'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User } from '@supabase/supabase-js'
import styles from '@/styles/header.module.css'
import {
  Menu,
  X,
  LayoutDashboard,
  Home,
  Plus,
  User as UserIcon,
  LogOut,
  LogIn,
  UserPlus,
  Shield,
} from 'lucide-react'

interface MobileNavProps {
  user: User | null
  isAdmin: boolean
}

export function MobileNav({ user, isAdmin }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const closeMenu = () => setIsOpen(false)

  return (
    <div className="md:hidden flex items-center gap-2">
      {user && (
        <div className={styles.mobileUserBadge}>
          {user.email?.[0].toUpperCase()}
        </div>
      )}
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.mobileHamburger}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.span>
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={styles.mobileBackdrop}
              onClick={closeMenu}
            />

            {/* Menu Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={styles.mobilePanel}
            >
              <nav className={styles.mobileNavInner}>
                <Link
                  href="/properties"
                  className={styles.mobileNavItem}
                  onClick={closeMenu}
                >
                  <span className={styles.mobileNavItemIcon}>
                    <Home className="w-4 h-4" />
                  </span>
                  Browse Properties
                </Link>

                <Link
                  href="/blog"
                  className={styles.mobileNavItem}
                  onClick={closeMenu}
                >
                  <span className={styles.mobileNavItemIcon}>
                    <Home className="w-4 h-4" />
                  </span>
                  Blog
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    className={styles.mobileNavItem}
                    onClick={closeMenu}
                  >
                    <span className={styles.mobileNavItemIcon}>
                      <Shield className="w-4 h-4" />
                    </span>
                    Admin Panel
                  </Link>
                )}

                <div className={styles.mobileNavDivider} />

                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className={styles.mobileNavItem}
                      onClick={closeMenu}
                    >
                      <span className={styles.mobileNavItemIcon}>
                        <LayoutDashboard className="w-4 h-4" />
                      </span>
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/properties"
                      className={styles.mobileNavItem}
                      onClick={closeMenu}
                    >
                      <span className={styles.mobileNavItemIcon}>
                        <Home className="w-4 h-4" />
                      </span>
                      My Properties
                    </Link>
                    <Link
                      href="/dashboard/properties/new"
                      className={styles.mobileNavItemPrimary}
                      onClick={closeMenu}
                    >
                      <span className={styles.mobileNavItemIcon}>
                        <Plus className="w-4 h-4" />
                      </span>
                      List Property
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className={styles.mobileNavItem}
                      onClick={closeMenu}
                    >
                      <span className={styles.mobileNavItemIcon}>
                        <UserIcon className="w-4 h-4" />
                      </span>
                      Profile
                    </Link>

                    <div className={styles.mobileNavDivider} />

                    <div className={styles.mobileUserSection}>
                      <p className={styles.mobileUserLabel}>Signed in as</p>
                      <p className={styles.mobileUserEmail}>{user.email}</p>
                    </div>

                    <form action="/auth/signout" method="post">
                      <button
                        type="submit"
                        onClick={closeMenu}
                        className={styles.signOutBtn}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className={styles.mobileNavItem}
                      onClick={closeMenu}
                    >
                      <span className={styles.mobileNavItemIcon}>
                        <LogIn className="w-4 h-4" />
                      </span>
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className={styles.mobileNavItemPrimary}
                      onClick={closeMenu}
                    >
                      <span className={styles.mobileNavItemIcon}>
                        <UserPlus className="w-4 h-4" />
                      </span>
                      Create Account
                    </Link>
                  </>
                )}

                <div className="pb-2" />
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
