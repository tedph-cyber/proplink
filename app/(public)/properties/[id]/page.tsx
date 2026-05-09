import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Property, PropertyMedia, Profile } from '@/lib/types'
import { generateWhatsAppLink, formatPriceRange, truncateText } from '@/lib/utils'
import type { Metadata } from 'next'
import styles from '@/styles/property-detail.module.css'

interface PropertyPageProps {
  params: Promise<{ id: string }>
}

async function getProperty(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select(`*, property_media (*), profiles (*)`)
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data as Property & { property_media: PropertyMedia[]; profiles: Profile }
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { id } = await params
  const property = await getProperty(id)
  if (!property) return { title: 'Property Not Found | StrongTower Holdings' }

  const images = (property.property_media || []).filter(m => m.media_type === 'image')
  const coverImage = images[0]

  return {
    title: `${property.title} | StrongTower Holdings`,
    description: truncateText(property.description, 160),
    openGraph: {
      title: property.title,
      description: truncateText(property.description, 160),
      images: coverImage ? [coverImage.media_url] : [],
    },
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params
  const property = await getProperty(id)
  if (!property) notFound()

  const { property_media, profiles: seller } = property
  const images = (property_media || []).filter(m => m.media_type === 'image')
  const [coverImage, ...thumbImages] = images
  const whatsappLink = generateWhatsAppLink(seller.whatsapp_number, property.title, property.id)

  const locationParts = [property.city, property.lga, property.state, property.country].filter(Boolean)

  const statusClass = property.status === 'active'
    ? styles.statusActive
    : property.status === 'sold'
    ? styles.statusSold
    : styles.statusOther

  return (
    <main className={styles.main}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/properties">Properties</Link>
        <span>/</span>
        <span className={styles.breadcrumbCurrent}>{truncateText(property.title, 50)}</span>
      </nav>

      {/* Gallery */}
      <section className={styles.gallery}>
        <div className={styles.mainImageWrap}>
          {coverImage ? (
            <img src={coverImage.media_url} alt={property.title} />
          ) : (
            <div className={styles.imagePlaceholder}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          )}
          <div className={styles.galleryBadges}>
            <span className={styles.verifiedBadge}>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              Verified Listing
            </span>
            <span className={`${styles.statusBadge} ${statusClass}`}>
              {property.status}
            </span>
          </div>
        </div>

        {thumbImages.length > 0 && (
          <div className={styles.thumbStrip}>
            {coverImage && (
              <div className={styles.thumbActive}>
                <img src={coverImage.media_url} alt={property.title} />
              </div>
            )}
            {thumbImages.map((img, i) => (
              <div key={img.id} className={styles.thumbItem}>
                <img src={img.media_url} alt={`${property.title} ${i + 2}`} />
                {i === thumbImages.length - 1 && images.length > 5 && (
                  <div className={styles.thumbOverflow}>
                    +{images.length - 5}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Main Content + Sidebar */}
      <div className={styles.layout}>
        {/* Left Content */}
        <div>
          {/* Header */}
          <div className={styles.propertyHeader}>
            <div className={styles.propertyHeaderInner}>
              <div>
                <h1 className={styles.propertyTitle}>{property.title}</h1>
                <div className={styles.propertyLocation}>
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  <span>{locationParts.join(', ')}</span>
                </div>
              </div>
              <div className={styles.priceCard}>
                <p className={styles.priceLabel}>Asking Price</p>
                <p className={styles.priceValue}>{formatPriceRange(property.price_min, property.price_max)}</p>
              </div>
            </div>
          </div>

          {/* Feature Grid */}
          {property.features && (
            <div className={styles.featureGrid}>
              {property.features.bedrooms && (
                <div className={styles.featureCard}>
                  <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12h18M3 12V9a2 2 0 012-2h14a2 2 0 012 2v3M3 12v6m18-6v6M3 18h18M5 12V9h14v3" />
                  </svg>
                  <p className={styles.featureLabel}>{property.features.bedrooms} Bedrooms</p>
                </div>
              )}
              {property.features.bathrooms && (
                <div className={styles.featureCard}>
                  <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 22H4a2 2 0 01-2-2v-7m20 0v7a2 2 0 01-2 2H7m13-9H2M7 2h10a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1V3a1 1 0 011-1z" />
                  </svg>
                  <p className={styles.featureLabel}>{property.features.bathrooms} Bathrooms</p>
                </div>
              )}
              {property.features.land_size && (
                <div className={styles.featureCard}>
                  <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 20h16M4 20V4m0 16l4-4m-4 4l4 4M20 4H4M20 4v16M20 4l-4 4m4-4l-4-4" />
                  </svg>
                  <p className={styles.featureLabel}>
                    {property.features.land_size} {property.features.land_size_unit ?? 'sqm'}
                  </p>
                </div>
              )}
              {property.features.house_types && property.features.house_types.length > 0 && (
                <div className={styles.featureCard}>
                  <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <p className={styles.featureLabelCap}>
                    {property.features.house_types[0].replace('_', ' ')}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <h2 className={styles.sectionTitle}>Description</h2>
            <p className={styles.description}>{property.description}</p>
          </div>

          {/* Additional Features */}
          {property.features?.additional_features && property.features.additional_features.length > 0 && (
            <div className={styles.addFeatures}>
              <h2 className={styles.sectionTitle}>Additional Features</h2>
              <div>
                {property.features.additional_features.map((f, i) => (
                  <span key={i} className={styles.addFeatureTag}>{f}</span>
                ))}
              </div>
            </div>
          )}

          {/* Safety Tip */}
          <div className={styles.safetyTip}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className={styles.safetyTipTitle}>StrongTower Holdings Safety Tip</p>
              <p className={styles.safetyTipText}>
                Never pay for inspections. Always meet in a public place for the first time. Ensure you verify all land titles with appropriate authorities before making payments.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Seller Card */}
          <div className={styles.sellerCard}>
            <p className={styles.sellerLabel}>Listed By</p>
            <div className={styles.sellerProfile}>
              <div className={styles.sellerAvatar}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className={styles.sellerName}>{seller.company_name ?? 'Property Owner'}</h3>
                <p className={styles.sellerMeta}>{seller.seller_type ?? 'Individual'} · Direct Owner</p>
                <span className={styles.verifiedTag}>
                  <svg viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  Verified Member
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappBtn}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Message on WhatsApp
              </a>
              <a
                href={`tel:${seller.whatsapp_number}`}
                className={styles.callBtn}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now
              </a>
            </div>
          </div>

          {/* Location Card */}
          <div className={styles.locationCard}>
            <p className={styles.locationCardTitle}>
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              Location
            </p>
            <p className={styles.locationCardText}>{locationParts.join(', ')}</p>
            <div className={styles.mapPlaceholder}>
              <div className={styles.mapPlaceholderInner}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p>Map view</p>
              </div>
            </div>
          </div>

          {/* Listed date */}
          <div className={styles.listedDate}>
            Listed {new Date(property.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Mobile floating WhatsApp button */}
      <div className={styles.mobileFab}>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>
    </main>
  )
}
