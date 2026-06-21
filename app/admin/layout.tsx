import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/ui/admin-sidebar'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LogoutButton } from '@/components/ui/logout-button'
import styles from '@/styles/admin.module.css'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className={styles.layout}>
      <AdminSidebar
        brand={{ name: 'StrongTower', subtitle: 'Holdings Management' }}
        navItems={[
          { href: '/admin', label: 'Dashboard', icon: (
            <svg className={styles.sidebarIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          )},
          { href: '/admin/properties', label: 'Properties', icon: (
            <svg className={styles.sidebarIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          )},
          { href: '/admin/sellers', label: 'Users', icon: (
            <svg className={styles.sidebarIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          )},
          { href: '/admin/blog', label: 'Blog', icon: (
            <svg className={styles.sidebarIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          )},
        ]}
        cta={{
          href: '/dashboard/properties/new',
          label: 'Add New Listing',
          icon: <svg className={styles.sidebarIconSm} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
        }}
      />

      <div className={styles.mainAreaWide}>
        <header className={styles.topbar}>
          <div className={styles.topbarInner}>
            <h1 className={styles.topbarTitle}>Admin Panel</h1>
            <div className={styles.topbarNav}>
              <ThemeToggle />
              <Link href="/" className={`${styles.topbarLink} ${styles.topbarLinkHideMobile}`}>← Home</Link>
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
