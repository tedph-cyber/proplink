import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { UserMenu } from './user-menu'
import { MobileNav } from './mobile-nav'
import { HeaderShell } from './header-shell'
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
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className={styles.logoLink}>
          <span className={styles.logoStrong}>Strong</span>
          <span className={styles.logoTower}>Tower</span>
          <span className={styles.logoHoldings}>Holdings</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={`hidden md:flex ${styles.nav}`}>
          <Link href="/properties" className={styles.navLink}>
            Browse Properties
          </Link>
          <Link href="/blog" className={styles.navLink}>
            Blog
          </Link>

          {isAdmin && (
            <Link href="/admin" className={styles.navLinkAccent}>
              Admin Panel
            </Link>
          )}

          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link href="/login" className={styles.navLink}>
                Login
              </Link>
              <Link href="/register" className={styles.ctaButton}>
                List Property
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
        <MobileNav user={user} isAdmin={isAdmin} />
      </div>
    </HeaderShell>
  )
}
