import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/lib/types'
import styles from '@/styles/admin.module.css'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const typedProfile = profile as Profile | null

  const { count: propertiesCount } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('seller_id', user.id)

  const { data: recentProperties } = await supabase
    .from('properties')
    .select('id, title, state, status, created_at')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const displayName = typedProfile?.company_name || typedProfile?.username || 'Seller'

  return (
    <div className={styles.page}>
      {/* Hero Welcome Banner */}
      <section className={styles.heroBanner}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>Curator Workspace</span>
          <h2 className={styles.heroTitle}>Welcome back, {displayName}</h2>
          <p className={styles.heroDesc}>
            Manage your listings and reach buyers across Nigeria.
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className={`${styles.statGrid} animate-stagger`}>
        {[
          { label: 'Total Properties', value: propertiesCount ?? 0, badge: '+2', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /> },
          { label: 'Total Views', value: '4.2k', badge: '+12%', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /> },
          { label: 'Active Inquiries', value: '28', badge: '+8', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /> },
          { label: 'Estimated ROI', value: '18%', badge: '+2.4%', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        ].map(({ label, value, badge, icon }) => (
          <div key={label} className={styles.statDashCard}>
            <div className={styles.statDashHeader}>
              <div className={styles.statDashIconAccent}>
                <svg className={styles.statDashIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
              </div>
              <span className={styles.badgeGreen}>
                <svg className={styles.badgeGreenIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                {badge}
              </span>
            </div>
            <div>
              <p className={styles.statDashLabel}>{label}</p>
              <h3 className={styles.statDashValue}>{value}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h3 className={styles.sectionTitle}>Quick Actions</h3>
        <div className={`${styles.quickActionGrid} animate-stagger`}>
          {[
            { href: '/dashboard/properties/new', label: 'List New Property', sub: 'Add a listing', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /> },
            { href: '/properties', label: 'Market Insights', sub: 'Browse market', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
            { href: '/dashboard/properties', label: 'Manage Listings', sub: 'View all', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /> },
            { href: '/dashboard/profile', label: 'Safety Guide', sub: 'Update profile', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /> },
          ].map(({ href, label, sub, icon }) => (
            <Link key={href} href={href} className={`${styles.quickActionCard} bg-[var(--color-accent-muted)]`}>
              <div className="space-y-3">
                <div className={`${styles.quickActionIconBox} bg-white/60 text-[var(--color-accent)]`}>
                  <svg className={styles.quickActionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
                </div>
                <div>
                  <p className={styles.quickActionLabel}>{label}</p>
                  <p className={styles.quickActionSub}>{sub}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className={styles.activityCard}>
        <div className={styles.activityHeader}>
          <h3 className={styles.activityTitle}>Recent Activity</h3>
          <Link href="/dashboard/properties" className={styles.activityViewAll}>
            View all activity →
          </Link>
        </div>

        {!recentProperties || recentProperties.length === 0 ? (
          <div className={styles.activityEmpty}>
            No listings yet.{' '}
            <Link href="/dashboard/properties/new" className={styles.activityEmptyLink}>Add your first property →</Link>
          </div>
        ) : (
          <div className={styles.overflowXAuto}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHead}>
                <th className={styles.tableThWide}>Listing Detail</th>
                <th className={styles.tableTh}>Date Listed</th>
                <th className={styles.tableTh}>Status</th>
                <th className={styles.tableThWide}>Action</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {(recentProperties as any[]).map((p) => (
                <tr key={p.id} className={styles.tableRow}>
                  <td className={styles.tableTdWide}>
                    <div className="flex items-center gap-3">
                      <div className={styles.activityListIcon}>
                        <svg className={styles.activityListIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                      </div>
                      <div>
                        <p className={styles.activityListTitle}>{p.title}</p>
                        <p className={styles.activityListSub}>{p.state}</p>
                      </div>
                    </div>
                  </td>
                  <td className={styles.tableTd}>
                    <span className={styles.activityDate}>
                      {new Date(p.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className={styles.tableTd}>
                    {p.status === 'active' ? <span className={styles.statusPillActive}>{p.status}</span> :
                     p.status === 'sold' ? <span className={styles.statusPillSold}>{p.status}</span> :
                     <span className={styles.statusPillInactive}>{p.status}</span>}
                  </td>
                  <td className={styles.tableTd}>
                    <Link href={`/properties/${p.id}`} className={styles.activityLink}>
                      View Analytics
                    </Link>
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
