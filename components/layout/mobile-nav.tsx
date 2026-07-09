'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import styles from '@/styles/header.module.css'
import { Menu, X, LogOut, MessageCircle, ArrowRight } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface MobileNavProps {
  user: User | null
  isAdmin: boolean
}

export function MobileNav({ user, isAdmin }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const openMenu = () => setIsOpen(true)
  const closeMenu = () => setIsOpen(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu() }
      window.addEventListener('keydown', handler)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handler)
      }
    }
  }, [isOpen])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const linkClass = (href: string) =>
    `${styles.mobileNavItem}${isActive(href) ? ` ${styles.mobileNavItemActive}` : ''}`

  return (
    <>
      <button
        onClick={openMenu}
        className={styles.mobileHamburger}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && (
        <>
          <div className={styles.scrim} onClick={closeMenu} />
          <div className={`${styles.mobileMenu} ${styles.mobileMenuOpen}`}>
            <div className={styles.mobileMenuInner}>
              {/* Head */}
              <div className={styles.mobileMenuHead}>
                <Link href="/" className={styles.logoLink} onClick={closeMenu}>
                  <div className={styles.logoName}>
                    <span className={styles.logoStrong}>Strong</span>
                    <span className={styles.logoTower}>Tower</span>
                  </div>
                </Link>
                <button
                  onClick={closeMenu}
                  className={styles.mobileHamburger}
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Links */}
              <nav className={styles.mobileLinks}>
                {[
                  { href: '/properties', label: 'Properties' },
                  { href: '/how-it-works', label: 'How it works' },
                  { href: '/why-us', label: 'Why us' },
                  { href: '/blog', label: 'Journal' },
                  ...(user ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
                  ...(isAdmin ? [{ href: '/admin', label: 'Admin' }] : []),
                ].map(({ href, label }, i) => (
                  <Link
                    key={href}
                    href={href}
                    className={linkClass(href)}
                    onClick={closeMenu}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              {/* Foot */}
              <div className={styles.mobileMenuFoot}>
                <Link href="/register" className={styles.mobileCta} onClick={closeMenu}>
                  List a property
                </Link>

                {user ? (
                  <button onClick={async () => {
                    closeMenu()
                    const supabase = createClient()
                    await supabase.auth.signOut()
                    router.push('/')
                    router.refresh()
                  }} className={styles.mobileLogInLink}>
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                ) : (
                  <Link href="/login" className={styles.mobileLogInLink} onClick={closeMenu}>
                    Log in
                    <ArrowRight className={styles.mobileLogInArrow} size={14} />
                  </Link>
                )}

                <a
                  href="https://wa.me/2347035209012"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mobileWhatsApp}
                >
                  <MessageCircle size={15} />
                  Chat on WhatsApp
                </a>

                <ThemeToggle mobile />

                <div className={styles.mobileContact}>
                  strongtowerholdingsglobal@gmail.com · Lagos · Abuja · Port Harcourt
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
