'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User } from '@supabase/supabase-js'
import { UserMenu } from './user-menu'
import { ToggleTheme } from '@/components/ui/toggle-theme'
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
  Sun,
} from 'lucide-react'

interface MobileNavProps {
  user: User | null
  isAdmin: boolean
}

export function MobileNav({ user, isAdmin }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const closeMenu = () => setIsOpen(false)

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center p-2 rounded-lg text-[var(--foreground)] hover:text-[var(--primary)] hover:bg-[var(--muted)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
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
              className="fixed inset-0 top-16 z-[60] bg-black/40 backdrop-blur-sm"
              onClick={closeMenu}
            />

            {/* Menu Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed top-16 right-0 left-0 z-[70] bg-[var(--background)] border-b border-[var(--border)] shadow-xl"
            >
              <nav className="container mx-auto px-4 py-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">

                <NavItem href="/properties" icon={<Home className="w-4 h-4" />} onClick={closeMenu}>
                  Browse Properties
                </NavItem>

                <div className="px-3 py-2.5 flex items-center justify-between rounded-lg">
                  <span className="flex items-center gap-3 text-sm font-medium text-[var(--foreground)]">
                    <Sun className="w-4 h-4 text-[var(--muted-foreground)]" />
                    Theme
                  </span>
                  <ToggleTheme />
                </div>

                {isAdmin && (
                  <NavItem href="/admin" icon={<Shield className="w-4 h-4" />} onClick={closeMenu} accent="purple">
                    Admin Panel
                  </NavItem>
                )}

                <div className="border-t border-[var(--border)] my-1" />

                {user ? (
                  <>
                    <NavItem href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} onClick={closeMenu}>
                      Dashboard
                    </NavItem>
                    <NavItem href="/dashboard/properties" icon={<Home className="w-4 h-4" />} onClick={closeMenu}>
                      My Properties
                    </NavItem>
                    <NavItem
                      href="/dashboard/properties/new"
                      icon={<Plus className="w-4 h-4" />}
                      onClick={closeMenu}
                      primary
                    >
                      List Property
                    </NavItem>
                    <NavItem href="/dashboard/profile" icon={<UserIcon className="w-4 h-4" />} onClick={closeMenu}>
                      Profile
                    </NavItem>

                    <div className="border-t border-[var(--border)] my-1" />

                    <div className="px-3 py-2">
                      <p className="text-xs text-[var(--muted-foreground)]">Signed in as</p>
                      <p className="text-sm font-medium text-[var(--foreground)] truncate">{user.email}</p>
                    </div>

                    <form action="/auth/signout" method="post">
                      <button
                        type="submit"
                        onClick={closeMenu}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[var(--destructive)] hover:bg-[var(--destructive)]/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <NavItem href="/login" icon={<LogIn className="w-4 h-4" />} onClick={closeMenu}>
                      Login
                    </NavItem>
                    <NavItem href="/register" icon={<UserPlus className="w-4 h-4" />} onClick={closeMenu} primary>
                      Create Account
                    </NavItem>
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

function NavItem({
  href,
  icon,
  children,
  onClick,
  primary,
  accent,
}: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  onClick: () => void
  primary?: boolean
  accent?: string
}) {
  const base = "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
  const style = primary
    ? `${base} bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90`
    : accent === "purple"
    ? `${base} text-purple-600 dark:text-purple-400 hover:bg-[var(--muted)]`
    : `${base} text-[var(--foreground)] hover:text-[var(--primary)] hover:bg-[var(--muted)]`

  return (
    <Link href={href} onClick={onClick} className={style}>
      <span className={primary ? "text-white" : accent === "purple" ? "text-purple-500" : "text-[var(--muted-foreground)]"}>
        {icon}
      </span>
      {children}
    </Link>
  )
}
