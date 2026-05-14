import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import styles from '@/styles/admin.module.css'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const [
    { count: totalSellers },
    { count: totalProperties },
    { count: activeProperties },
    { count: pendingProperties },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'seller'),
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ])

  const { data: recentProperties } = await supabase
    .from('properties')
    .select('id, title, property_type, status, created_at, state')
    .order('created_at', { ascending: false })
    .limit(8)

  const stats = [
    { label: 'Total Users', value: totalSellers ?? 0, badge: '+12%', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /> },
    { label: 'Active Properties', value: activeProperties ?? 0, badge: '+5.2%', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /> },
    { label: 'Total Listings', value: totalProperties ?? 0, badge: '+8.1%', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /> },
    { label: 'Pending Review', value: pendingProperties ?? 0, badge: pendingProperties ? `${pendingProperties} new` : '0', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
  ]

  const quickLinks = [
    { href: '/admin/sellers', label: 'Manage Users', sub: 'View and manage seller accounts' },
    { href: '/admin/properties', label: 'Property Inventory', sub: 'Review, edit and delete listings' },
    { href: '/admin/blog', label: 'Blog & Content', sub: 'Publish and manage blog posts' },
  ]

  return (
    <div className={styles.page}>
      {/* Top Nav */}
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitleLg}>Welcome, Admin!</h1>
          <p className={styles.pageSubtitle}>High-level platform health overview.</p>
        </div>
        <div className={styles.pageActions}>
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input className={styles.searchInput} placeholder="Search data..." />
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, badge, svg }) => (
          <div key={label} className={styles.statCardSurface}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-[var(--color-accent-muted)] text-[var(--color-accent)]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{svg}</svg>
              </div>
              <span className={styles.badgeGreen}>
                {badge}
              </span>
            </div>
            <p className={styles.statLabelMuted}>{label}</p>
            <p className={styles.statValueDefault}>{value.toLocaleString()}</p>
          </div>
        ))}
      </section>

      {/* Quick Links */}
      <section className={styles.actionGrid}>
        {quickLinks.map(({ href, label, sub }) => (
          <Link key={href} href={href} className={styles.actionCard}>
            <div className="p-3 rounded-lg bg-[var(--color-accent-muted)] text-[var(--color-accent)] flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <div>
              <p className={styles.actionLabel}>{label}</p>
              <p className={styles.actionDesc}>{sub}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* Market Activity Table */}
      <section className={styles.marketSection}>
        <div className={styles.marketHeader}>
          <div>
            <h2 className={styles.marketTitle}>Market Activity</h2>
            <p className={styles.marketSub}>Most recent platform transactions</p>
          </div>
          <Link href="/admin/properties" className={styles.marketLink}>
            Load Detailed History →
          </Link>
        </div>
        {!recentProperties || recentProperties.length === 0 ? (
          <p className="px-6 py-8 text-sm text-[var(--color-text-muted)]">No properties yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHead}>
                  <th className={styles.tableTh}>Transaction ID</th>
                  <th className={styles.tableTh}>Property</th>
                  <th className={styles.tableTh}>Type</th>
                  <th className={styles.tableTh}>Status</th>
                  <th className={styles.tableTh}>Date</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {(recentProperties as any[]).map((p) => (
                  <tr key={p.id} className={styles.tableRow}>
                    <td className={styles.tableTd}>
                      <span className={styles.transactionId}>#PL-{p.id.slice(0, 5).toUpperCase()}</span>
                    </td>
                    <td className="px-4 py-4 font-medium text-[var(--color-text)]">{p.title}</td>
                    <td className="px-4 py-4 text-[var(--color-text-muted)] capitalize">{p.property_type}</td>
                    <td className="px-4 py-4">
                      {p.status === 'active' ? <span className={styles.statusPillActive}>{p.status}</span> :
                       p.status === 'sold' ? <span className={styles.statusPillSold}>{p.status}</span> :
                       <span className={styles.statusPillInactive}>{p.status}</span>}
                    </td>
                    <td className={styles.tableTd}>
                      {new Date(p.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
