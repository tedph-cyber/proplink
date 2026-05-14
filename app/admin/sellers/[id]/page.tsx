import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Profile, Property, PropertyMedia } from '@/lib/types'
import { formatPriceRange, formatLocation } from '@/lib/utils'
import { DeleteSellerButton } from '@/components/admin/delete-seller-button'
import adminStyles from '@/styles/admin.module.css'
import editorStyles from '@/styles/blog-editor.module.css'

type PropertyWithMedia = Property & { property_media: PropertyMedia[] }

export default async function AdminSellerDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const { data: seller } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!seller) {
    return (
      <div className={adminStyles.pageNarrow}>
        <div className={adminStyles.emptyState}>
          <p className={adminStyles.emptyStateTitle}>Seller not found</p>
          <p className={adminStyles.emptyStateText}>The seller you are looking for does not exist.</p>
          <div className={adminStyles.emptyStateCta}>
            <Link href="/admin/sellers" className={adminStyles.emptyStateLink}>← Back to Users</Link>
          </div>
        </div>
      </div>
    )
  }

  const { data: properties } = await supabase
    .from('properties')
    .select(`*, property_media(*)`)
    .eq('seller_id', id)
    .order('created_at', { ascending: false })

  const typedProperties = (properties as PropertyWithMedia[]) || []

  const totalProperties = typedProperties.length
  const activeProperties = typedProperties.filter(p => p.status === 'active').length
  const soldProperties = typedProperties.filter(p => p.status === 'sold').length
  const inactiveProperties = typedProperties.filter(p => p.status === 'inactive').length

  const displayName = seller.username || seller.company_name || 'Individual Seller'
  const avatarLetter = displayName.charAt(0).toUpperCase()

  return (
    <div className={adminStyles.pageNarrow}>

      {/* Breadcrumbs */}
      <nav className={editorStyles.breadcrumbs}>
        <Link href="/admin" className={editorStyles.breadcrumbLink}>Admin</Link>
        <span>/</span>
        <Link href="/admin/sellers" className={editorStyles.breadcrumbLink}>Users</Link>
        <span>/</span>
        <span className={editorStyles.breadcrumbCurrent}>
          {displayName}
        </span>
      </nav>

      {/* 2-column layout */}
      <div className={editorStyles.layout}>

        {/* ─── Main Column ─── */}
        <div className={editorStyles.mainColumn}>

          {/* Profile Header Card */}
          <div className={editorStyles.card}>
            <div className="flex items-start gap-6">
              <div className={'w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface)] flex items-center justify-center'}>
                {seller.avatar_url ? (
                  <img src={seller.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-[var(--color-accent)]">{avatarLetter}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-text)]">
                      {displayName}
                    </h1>
                    {seller.username && seller.company_name && (
                      <p className="text-xs text-[var(--color-text-muted)]">@{seller.username} · {seller.company_name}</p>
                    )}
                    {seller.username && !seller.company_name && (
                      <p className="text-xs text-[var(--color-text-muted)]">@{seller.username}</p>
                    )}
                  </div>
                  <span className={seller.seller_type === 'agent' ? adminStyles.sellerTypeAgent :
                    seller.seller_type === 'developer' ? adminStyles.sellerTypeDeveloper :
                    adminStyles.sellerTypeIndividual}
                  >
                    {seller.seller_type || 'individual'}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  Member since {new Date(seller.created_at).toLocaleDateString('en-NG', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className={adminStyles.statsRow}>
            <div className={adminStyles.statCardSurface}>
              <div>
                <p className={adminStyles.statLabelMuted}>Total Properties</p>
              </div>
              <p className={adminStyles.statValueDefault}>{totalProperties}</p>
            </div>
            <div className={adminStyles.statCardSurface}>
              <div>
                <p className={adminStyles.statLabelMuted}>Active</p>
              </div>
              <p className="text-2xl font-extrabold mt-4 tracking-tight text-[#22c55e]">{activeProperties}</p>
            </div>
            <div className={adminStyles.statCardSurface}>
              <div>
                <p className={adminStyles.statLabelMuted}>Sold</p>
              </div>
              <p className="text-2xl font-extrabold mt-4 tracking-tight text-[#f97316]">{soldProperties}</p>
            </div>
            <div className={adminStyles.statCardSurface}>
              <div>
                <p className={adminStyles.statLabelMuted}>Inactive</p>
              </div>
              <p className="text-2xl font-extrabold mt-4 tracking-tight text-[var(--color-text-muted)]">{inactiveProperties}</p>
            </div>
          </div>

          {/* Properties Table */}
          {typedProperties.length === 0 ? (
            <div className={adminStyles.emptyState}>
              <p className={adminStyles.emptyStateTitle}>No properties listed</p>
              <p className={adminStyles.emptyStateText}>This seller has not listed any properties yet.</p>
            </div>
          ) : (
            <div className={adminStyles.tableWrapBorder}>
              <div className={adminStyles.tableSectionHeader}>
                <div className={adminStyles.tableSectionHeaderInner}>
                  <h3 className={adminStyles.tableSectionTitle}>
                    Properties ({totalProperties})
                  </h3>
                </div>
              </div>
              <table className={adminStyles.table}>
                <thead>
                  <tr className={adminStyles.tableHead}>
                    <th className={adminStyles.tableThWide}>Property</th>
                    <th className={adminStyles.tableTh}>Status</th>
                    <th className={adminStyles.tableTh}>Price</th>
                    <th className={adminStyles.tableTh}>Location</th>
                    <th className={adminStyles.tableThRightWide}>Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-surface-2)]">
                  {typedProperties.map((property) => {
                    const firstImage = property.property_media
                      ?.filter(m => m.media_type === 'image')
                      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))[0]

                    const statusClass = property.status === 'active' ? adminStyles.statusPillActive :
                      property.status === 'sold' ? adminStyles.statusPillSold :
                      adminStyles.statusPillInactive

                    return (
                      <tr key={property.id} className={adminStyles.tableRow}>
                        <td className={adminStyles.tableTdWide}>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--color-surface-2)]">
                              {firstImage ? (
                                <img src={firstImage.media_url} alt={property.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg className="w-5 h-5 text-[var(--color-text-hint)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <Link href={`/dashboard/properties/${property.id}/edit`} className="font-semibold text-sm text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors line-clamp-1">
                                {property.title}
                              </Link>
                              <p className="text-xs text-[var(--color-text-muted)] mt-0.5 capitalize">{property.property_type}</p>
                            </div>
                          </div>
                        </td>
                        <td className={adminStyles.tableTd}>
                          <span className={statusClass}>{property.status}</span>
                        </td>
                        <td className={adminStyles.tableTd}>
                          <span className="font-semibold text-sm text-[var(--color-accent)]">
                            {formatPriceRange(property.price_min, property.price_max)}
                          </span>
                        </td>
                        <td className={adminStyles.tableTd}>
                          <span className="text-sm text-[var(--color-text-muted)]">
                            {property.city || property.lga ? formatLocation(property.city || property.lga || '', property.state) : property.state}
                          </span>
                        </td>
                        <td className={adminStyles.tableTdRightWide}>
                          <span className="text-sm text-[var(--color-text-muted)]">
                            {new Date(property.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div className={adminStyles.tableFooter}>
                <p className={adminStyles.tableFooterText}>
                  Showing <span className={adminStyles.tableFooterCount}>{typedProperties.length}</span> properties
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ─── Sidebar Column ─── */}
        <div className={editorStyles.sidebarColumn}>

          {/* Contact Info */}
          <div className={editorStyles.card}>
            <h3 className={editorStyles.cardTitle}>Contact Information</h3>

            {seller.whatsapp_number && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-whatsapp)]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[var(--color-whatsapp)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)] font-medium">WhatsApp</p>
                  <a
                    href={`https://wa.me/${seller.whatsapp_number.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[var(--color-whatsapp)] hover:underline"
                  >
                    {seller.whatsapp_number}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-muted)] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-muted)] font-medium">Joined</p>
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  {new Date(seller.created_at).toLocaleDateString('en-NG', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-2)] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-muted)] font-medium">Account ID</p>
                <p className="text-sm font-mono text-[var(--color-text)]">{seller.id.slice(0, 12)}…</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={editorStyles.card}>
            <h3 className={editorStyles.cardTitle}>Quick Actions</h3>

            {seller.whatsapp_number && (
              <a
                href={`https://wa.me/${seller.whatsapp_number.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-lg bg-[var(--color-whatsapp)] text-white text-sm font-bold hover:opacity-90 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Send WhatsApp Message
              </a>
            )}

            <Link
              href={`/admin/sellers`}
              className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-text)] text-sm font-bold hover:bg-[var(--color-border)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Users
            </Link>

            <hr className="border-t border-[var(--color-border)]" />

            <DeleteSellerButton sellerId={seller.id} sellerName={displayName} />
          </div>

        </div>
      </div>
    </div>
  )
}
