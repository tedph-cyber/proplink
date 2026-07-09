import Link from 'next/link'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  robots: { index: false },
}
import { AdminSidebar } from '@/components/ui/admin-sidebar'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LogoutButton } from '@/components/ui/logout-button'
import styles from '@/styles/admin.module.css'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: (
      <svg className={styles.sidebarIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    )},
    { href: '/dashboard/properties', label: 'My Listings', icon: (
      <svg className={styles.sidebarIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    )},
    { href: '/dashboard/profile', label: 'Profile', icon: (
      <svg className={styles.sidebarIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    )},
    ...(isAdmin ? [{ href: '/admin', label: 'Admin Panel', icon: (
      <svg className={styles.sidebarIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8V4m0 0L8 8m4-4l4 4M4 12h2m12 0h2m-2 0h2M4 12h2m12 0h2M12 20v-4m0 0l-4 4m4-4l4 4" /></svg>
    )}] : []),
    { href: '/properties', label: 'Browse', icon: (
      <svg className={styles.sidebarIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    )},
  ]

  return (
    <div className={styles.layout}>
      <AdminSidebar
        variant="dashboard"
        brand={{ logo: 'ST', name: 'StrongTower Holdings', subtitle: 'Building Legacies' }}
        navItems={navItems}
        cta={{
          href: '/dashboard/properties/new',
          label: 'List New Property',
          icon: <svg className={styles.sidebarIconSm} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
        }}
      />

      <div className={styles.mainArea}>
        <header className={styles.topbar}>
          <div className={styles.topbarInner}>
            <h1 className={styles.topbarTitle}>StrongTower Holdings</h1>
            <div className={styles.topbarNav}>
              <ThemeToggle />
              <Link href="/" className={styles.topbarLink}>← Home</Link>
              {isAdmin && (
                <>
                  <span className="w-px h-4 bg-[var(--color-border)]" />
                  <Link href="/admin" className={styles.topbarLink + ' text-[var(--color-accent)] font-semibold'}>
                    Admin Panel
                  </Link>
                </>
              )}
              <span className="w-px h-4 bg-[var(--color-border)]" />
              <LogoutButton />
            </div>
          </div>
        </header>
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  )
}
