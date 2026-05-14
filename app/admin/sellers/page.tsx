import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/lib/types'
import styles from '@/styles/admin.module.css'

export default async function AdminSellersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const [
    { count: totalSellers },
    { count: agentCount },
    { count: individualCount },
    { data: sellers },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'seller'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'seller').eq('seller_type', 'agent'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'seller').eq('seller_type', 'individual'),
    supabase.from('profiles').select(`*, properties:properties(count)`).eq('role', 'seller').order('created_at', { ascending: false }),
  ])

  const typedSellers = sellers as (Profile & { properties: { count: number }[] })[] | null

  const statData = [
    { label: 'Total Sellers', value: totalSellers ?? 0, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { label: 'Individuals', value: individualCount ?? 0, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ]

  return (
    <div className={styles.pageNarrow}>
      {/* Header */}
      <div className={styles.pageHeaderRow}>
        <div>
          <h1 className={styles.pageTitleLg}>
            User{' '}
            <span className="text-[var(--color-accent)]">Management</span>
          </h1>
          <p className={styles.pageSubtitle}>View and manage all registered sellers on the platform.</p>
        </div>
      </div>

      {/* Stats */}
      <section className={styles.statsRow}>
        {statData.map(({ label, value, icon }) => (
          <div key={label} className={styles.statCardSurface}>
            <div>
              <div className={styles.statIconAccent}>
                <svg className={styles.statIconSm} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
              </div>
              <p className={styles.statLabelMuted}>{label}</p>
            </div>
            <p className={styles.statValueDefault}>{value}</p>
          </div>
        ))}
        <div className={styles.statCardAccent}>
          <div>
            <div className={styles.statIconWhite}>
              <svg className={styles.statIconSm} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className={styles.statLabelWhite}>Agents</p>
          </div>
          <p className={styles.statValueWhite}>{agentCount ?? 0}</p>
        </div>
      </section>

      {/* Table */}
      {!typedSellers || typedSellers.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateTitle}>No sellers registered yet</p>
          <p className={styles.emptyStateText}>Sellers will appear here after they create an account.</p>
        </div>
      ) : (
        <div className={styles.tableWrapBorder}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHead}>
                <th className={styles.tableThWide}>Seller</th>
                <th className={styles.tableTh}>Type</th>
                <th className={styles.tableTh}>WhatsApp</th>
                <th className={styles.tableTh}>Properties</th>
                <th className={styles.tableTh}>Joined</th>
                <th className={styles.tableThRightWide}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-2)]">
              {typedSellers.map((seller) => {
                const propertyCount = seller.properties?.[0]?.count || 0

                return (
                  <tr key={seller.id} className={styles.tableRow}>
                    <td className={styles.tableTdWide}>
                      <div className={styles.userBadge}>
                        <div className={styles.userAvatar + ' bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface)] overflow-hidden'}>
                          {seller.avatar_url ? (
                            <img src={seller.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className={styles.userAvatarLetter}>
                              {(seller.company_name || seller.username || 'S').charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className={styles.userName}>{seller.username || seller.company_name || 'Individual Seller'}</p>
                          <p className={styles.userId}>{seller.id.slice(0, 8)}…</p>
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableTd}>
                      {seller.seller_type === 'agent' ? <span className={styles.sellerTypeAgent}>{seller.seller_type}</span> :
                       seller.seller_type === 'developer' ? <span className={styles.sellerTypeDeveloper}>{seller.seller_type}</span> :
                       <span className={styles.sellerTypeIndividual}>{seller.seller_type || 'individual'}</span>}
                    </td>
                    <td className={styles.tableTd}>
                      <span className={styles.whatsappText}>{seller.whatsapp_number || '—'}</span>
                    </td>
                    <td className={styles.tableTd}>
                      <span className={styles.propertyCountBadge}>
                        <svg className={styles.propertyCountIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {propertyCount}
                      </span>
                    </td>
                    <td className={styles.tableTd}>
                      <span className={styles.whatsappText}>
                        {new Date(seller.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className={styles.tableTdRightWide}>
                      <Link href={`/admin/sellers/${seller.id}`} className={styles.marketLink}>
                        View →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className={styles.tableFooter}>
            <p className={styles.tableFooterText}>
              Showing <span className={styles.tableFooterCount}>{typedSellers.length}</span> sellers
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
