import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Property, PropertyMedia } from '@/lib/types'
import { formatPriceRange } from '@/lib/utils'
import { DeletePropertyButton } from '@/components/properties/delete-property-button'
import styles from '@/styles/admin.module.css'

export default async function MyPropertiesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's properties with media
  const { data: properties } = await supabase
    .from('properties')
    .select(`
      *,
      property_media (*)
    `)
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  const typedProperties = properties as (Property & { property_media: PropertyMedia[] })[] | null

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={styles.pageTitleLg}>My Properties</h1>
          <p className={styles.pageSubtitle}>
            {typedProperties?.length || 0} {typedProperties?.length === 1 ? 'property' : 'properties'} listed
          </p>
        </div>
        <Link href="/dashboard/properties/new" className={styles.submitBtn + ' flex items-center gap-2'}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Property
        </Link>
      </div>

      {!typedProperties || typedProperties.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] p-12 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center">
            <svg className="h-6 w-6 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-2">No properties yet</h2>
          <p className="text-[var(--color-text-muted)] mb-6">Start listing your properties to reach potential buyers.</p>
          <Link href="/dashboard/properties/new" className={styles.submitBtn}>
            List Your First Property
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {typedProperties.map((property) => {
            const firstImage = property.property_media
              ?.filter(m => m.media_type === 'image')
              .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))[0]

            return (
              <div key={property.id} className={styles.dashPropertyCard}>
                <div className={styles.dashPropertyGrid}>
                  {/* Property Image */}
                  <div className={styles.dashPropertyImageWrap + ' aspect-[4/3] md:aspect-auto md:h-full'}>
                    {firstImage ? (
                      <img src={firstImage.media_url} alt={property.title} className={styles.dashPropertyImage} />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <svg className="h-12 w-12 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      {property.status === 'active' ? <span className={styles.statusPillActive}>{property.status}</span> :
                       property.status === 'sold' ? <span className={styles.statusPillSold}>{property.status}</span> :
                       <span className={styles.statusPillPending}>{property.status}</span>}
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className={styles.dashPropertyDetails}>
                    <div className="flex-1">
                      <div className={styles.dashPropertyHeader}>
                        <div>
                          <h3 className={styles.dashPropertyName}>{property.title}</h3>
                          <p className={styles.dashPropertyLocation}>{property.city}, {property.state}</p>
                        </div>
                        {property.property_type === 'house' ? <span className={styles.statusPillActive}>{property.property_type}</span> :
                         <span className={styles.statusPillInactive}>{property.property_type}</span>}
                      </div>

                      <p className={styles.dashPropertyPrice}>{formatPriceRange(property.price_min, property.price_max)}</p>

                      <p className={styles.dashPropertyDesc}>{property.description}</p>

                      {/* Property Features */}
                      {property.features && (
                        <div className={styles.dashPropertyFeatures}>
                          {property.property_type === 'house' && (
                            <>
                              {property.features.bedrooms && (
                                <span className={styles.dashPropertyFeature}>
                                  <svg className={styles.dashPropertyFeatureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                  </svg>
                                  {property.features.bedrooms} beds
                                </span>
                              )}
                              {property.features.bathrooms && (
                                <span className={styles.dashPropertyFeature}>
                                  <svg className={styles.dashPropertyFeatureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                  </svg>
                                  {property.features.bathrooms} baths
                                </span>
                              )}
                            </>
                          )}
                          {property.property_type === 'land' && property.features.land_size && (
                            <span className={styles.dashPropertyFeature}>
                              <svg className={styles.dashPropertyFeatureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                              </svg>
                              {property.features.land_size} {property.features.land_size_unit}
                            </span>
                          )}
                          <span className={styles.dashPropertyFeature}>
                            <svg className={styles.dashPropertyFeatureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {property.property_media?.length || 0} photos
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className={styles.dashPropertyActions}>
                      <Link href={`/properties/${property.id}`} className={`${styles.dashPropertyActionBtn} ${styles.cancelBtn} flex items-center justify-center gap-2 p-3 rounded-xl border border-[var(--color-border)]`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </Link>
                      <Link href={`/dashboard/properties/${property.id}/edit`} className={`${styles.dashPropertyActionBtn} ${styles.cancelBtn} flex items-center justify-center gap-2 p-3 rounded-xl border border-[var(--color-border)]`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
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
