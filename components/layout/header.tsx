import Link from 'next/link'
import { User as UserIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { UserMenu } from './user-menu'
import { MobileNav } from './mobile-nav'
import { HeaderShell } from './header-shell'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import styles from '@/styles/header.module.css'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.role === 'admin'
  }

  return (
    <HeaderShell>
      <div className="container-base flex items-center justify-between w-full">
        {/* Logo */}
        <Link href="/" className={styles.logoLink}>
          <div className={styles.logoName}>
            <span className={styles.logoStrong}>Strong</span>
            <span className={styles.logoTower}>Tower</span>
          </div>
          <span className={styles.logoHoldings}>Holdings</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          <Link href="/properties" className={styles.navLink}>
            Properties
          </Link>
          <Link href="/how-it-works" className={styles.navLink}>
            How it works
          </Link>
          <Link href="/why-us" className={styles.navLink}>
            Why us
          </Link>
          <Link href="/blog" className={styles.navLink}>
            Journal
          </Link>
          {isAdmin && (
            <Link href="/admin" className={styles.navLinkAccent}>
              Admin
            </Link>
          )}
        </nav>

        {/* Right side actions */}
        <div className={styles.navActions}>
          <ThemeToggle />
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link href="/login" className={styles.loginLink}>
                <UserIcon className="w-4 h-4" />
                Log in
              </Link>
              <Link href="/register" className={styles.ctaButton}>
                List a property
              </Link>
            </>
          )}
          <MobileNav user={user} isAdmin={isAdmin} />
        </div>
      </div>
    </HeaderShell>
  )
}
