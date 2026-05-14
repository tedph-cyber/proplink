import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Property, PropertyMedia, Profile } from '@/lib/types'
import { formatPriceRange } from '@/lib/utils'
import { DeletePropertyButton } from '@/components/properties/delete-property-button'
import styles from '@/styles/admin.module.css'

export default async function AdminPropertiesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const [
    { count: totalCount },
    { count: activeCount },
    { count: pendingCount },
    { data: properties },
  ] = await Promise.all([
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('properties').select(`
      *,
      property_media (*),
      profiles!properties_seller_id_fkey (id, whatsapp_number, seller_type, company_name)
    `).order('created_at', { ascending: false }),
  ])

  const typedProperties = properties as (Property & {
    property_media: PropertyMedia[]
    profiles: Profile
  })[] | null

  const statData = [
    { label: 'Total Listings', value: totalCount ?? 0, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'Active Now', value: activeCount ?? 0, icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { label: 'Pending Review', value: pendingCount ?? 0, icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ]

  return (
    <div className={styles.pageNarrow}>
      {/* Header */}
      <div className={styles.pageHeaderRow}>
        <div>
          <h1 className={styles.pageTitleLg}>
            Inventory{' '}
            <span className="text-[var(--color-accent)]">Overview</span>
          </h1>
          <p className={styles.pageSubtitle}>Review, edit and manage all property listings.</p>
        </div>
      </div>

      {/* Stats Row */}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={statData[1].icon} />
              </svg>
            </div>
            <p className={styles.statLabelWhite}>{statData[1].label}</p>
          </div>
          <p className={styles.statValueWhite}>{statData[1].value}</p>
        </div>
      </section>

      {/* Content */}
      {!typedProperties || typedProperties.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateTitle}>No properties listed yet</p>
          <p className={styles.emptyStateText}>Listings will appear here once sellers add properties.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={styles.tableSectionHeaderInner}>
            <h2 className="font-bold text-lg text-[var(--color-text-muted)]">Manage Listings</h2>
            <span className={styles.tableSectionSort}>Sort: Recent</span>
          </div>

          {typedProperties.map((property) => {
            const firstImage = property.property_media
              ?.filter(m => m.media_type === 'image')
              .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))[0]
            const seller = property.profiles

            return (
              <div key={property.id} className={styles.propertyRow}>
                {/* Thumbnail */}
                <div className={styles.propertyThumb}>
                  {firstImage ? (
                    <img src={firstImage.media_url} alt={property.title} className={styles.propertyThumbImg} />
                  ) : (
                    <div className={styles.propertyThumbPlaceholder}>
                      <svg className={styles.propertyThumbIcon + ' text-[#b2c5ff]'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className={styles.propertyInfo}>
                  <div>
                    <div className={styles.propertyHeader}>
                      <h3 className={styles.propertyTitle}>{property.title}</h3>
                      {property.status === 'active' ? <span className={styles.statusPillActive}>{property.status}</span> :
                       property.status === 'sold' ? <span className={styles.statusPillSold}>{property.status}</span> :
                       <span className={styles.statusPillInactive}>{property.status}</span>}
                    </div>
                    <p className={styles.propertyMeta}>
                      {[property.city, property.lga, property.state].filter(Boolean).join(', ')}
                    </p>
                    {seller && (
                      <p className={styles.propertySeller}>
                        by <span className={styles.propertySellerName}>{seller.company_name || 'Individual Seller'}</span>
                        {' · '}{seller.seller_type}
                      </p>
                    )}
                  </div>

                  <div className={styles.propertyFooter}>
                    <p className={styles.propertyPrice}>{formatPriceRange(property.price_min, property.price_max)}</p>
                    <div className={styles.propertyActions}>
                      <Link href={`/properties/${property.id}`} className={styles.propertyActionBtn} title="View public listing" target="_blank">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      <Link href={`/dashboard/properties/${property.id}/edit`} className={styles.propertyActionBtn} title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <DeletePropertyButton propertyId={property.id} propertyTitle={property.title} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
