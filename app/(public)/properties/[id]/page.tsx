import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Bed, Bath, Ruler, Home, Check, Shield, MessageCircle, ArrowLeft, Share2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Property, PropertyMedia, Profile } from '@/lib/types'
import { generateWhatsAppLink, formatPriceRange, truncateText } from '@/lib/utils'
import { PropertyGallery } from '@/components/properties/property-gallery'
import { PropertyCard } from '@/components/properties/property-card'
import type { Metadata } from 'next'
import styles from '@/styles/property-detail.module.css'

interface PropertyPageProps {
  params: Promise<{ id: string }>
}

async function getProperty(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select(`*, property_media(*), profiles(*)`)
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data as Property & { property_media: PropertyMedia[]; profiles: Profile }
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { id } = await params
  const property = await getProperty(id)
  if (!property) return { title: 'Property Not Found' }

  const images = (property.property_media || []).filter((m) => m.media_type === 'image')
  const coverImage = images[0]
  const location = [property.city, property.lga, property.state].filter(Boolean).join(', ')

  return {
    title: property.title,
    description: truncateText(property.description, 160),
    openGraph: {
      title: `${property.title} — ${property.property_type === 'house' ? 'House' : 'Land'} in ${location}`,
      description: truncateText(property.description, 160),
      url: `https://strongtowerholdings.com.ng/properties/${id}`,
      images: coverImage ? [{ url: coverImage.media_url, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
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

  const media = property.property_media || []
  const seller = property.profiles
  const whatsappLink = generateWhatsAppLink(
    seller?.whatsapp_number || '',
    property.title,
    property.id
  )

  const locationParts = [property.city, property.lga, property.state, property.country].filter(Boolean)

  interface Fact { icon: React.ReactNode; value: string; label: string }
  const facts: Fact[] = []
  if (property.property_type === 'house') {
    const bedroomCount = property.features?.bedroom_category
      ? property.features.bedroom_category.replace('_plus', '+')
      : property.features?.bedrooms
        ? `${property.features.bedrooms}`
        : null
    if (bedroomCount) facts.push({ icon: <Bed size={20} />, value: bedroomCount, label: 'Bedrooms' })
    if (property.features?.bathrooms) facts.push({ icon: <Bath size={20} />, value: `${property.features.bathrooms}`, label: 'Bathrooms' })
  }
  if (property.features?.land_size) {
    const unit = property.features.land_size_unit || 'sqm'
    facts.push({ icon: <Ruler size={20} />, value: `${property.features.land_size} ${unit}`, label: property.property_type === 'house' ? 'Floor area' : 'Plot size' })
  }
  facts.push({ icon: <Home size={20} />, value: property.property_type === 'house' ? 'House' : 'Land', label: 'Property type' })

  const supabase = await createClient()
  const { data: similar } = await supabase
    .from('properties')
    .select(`*, property_media(*)`)
    .eq('status', 'active')
    .neq('id', property.id)
    .or(`state.eq.${property.state},property_type.eq.${property.property_type}`)
    .limit(3)
    .order('created_at', { ascending: false })

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <Link href="/properties" className={styles.back}>
          <ArrowLeft size={16} />
          Back to properties
        </Link>

        <PropertyGallery media={media} title={property.title} />

        <div className={styles.layout}>
          <div>
            <div className={styles.titleRow}>
              <div>
                <div className={styles.tags}>
                  {property.status === 'active' && (
                    <span className={styles.verifyBadge}>
                      <Check size={14} />
                      Verified listing
                    </span>
                  )}
                  <span className={styles.typeBadge}>
                    <Home size={14} />
                    {property.property_type === 'house' ? 'House' : 'Land'}
                  </span>
                </div>
                <h1 className={styles.title}>{property.title}</h1>
                <p className={styles.location}>
                  <MapPin size={16} />
                  {locationParts.join(', ')}
                </p>
              </div>
              <div className={styles.iconBtns}>
                <button>
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {facts.length > 0 && (
              <div className={styles.facts}>
                {facts.map((f, i) => (
                  <div key={i} className={styles.fact}>
                    <span className={styles.factIcon}>{f.icon}</span>
                    <div>
                      <span className={styles.factValue}>{f.value}</span>
                      <span className={styles.factLabel}> {f.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <section className={styles.section}>
              <h2>About this property</h2>
              <p>{property.description}</p>
              <p>
                This listing is offered directly by the verified owner — no agents, no middlemen.
                Documents are available on request, and you can arrange an inspection at a time
                that suits you. StrongTower confirms the title, owner identity and photographs
                before any property earns its verified badge.
              </p>
            </section>

            {property.features?.additional_features && property.features.additional_features.length > 0 && (
              <section className={styles.section}>
                <h2>What this place offers</h2>
                <div className={styles.amenGrid}>
                  {property.features.additional_features.map((f, i) => (
                    <div key={i} className={styles.amen}>
                      <Check size={17} />
                      {f}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className={styles.section}>
              <h2>Where you&apos;ll be</h2>
              <div className={styles.map}>
                <span style={{ zIndex: 1, opacity: 0.5 }}>
                  Map — {property.city || property.lga || property.state}
                </span>
                <div className={styles.mapPin}>
                  <MapPin size={22} />
                </div>
              </div>
              <p className={styles.mapNote}>
                Exact location shared with serious enquirers after first contact, for the owner&apos;s privacy and safety.
              </p>
            </section>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.contactCard}>
              <div className={styles.contactPrice}>
                {formatPriceRange(property.price_min, property.price_max)}
              </div>

              <div className={styles.contactOwner}>
                <div className={styles.contactAvatar}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text-hint)' }}>
                    {seller?.company_name?.[0] || seller?.username?.[0] || 'O'}
                  </span>
                </div>
                <div>
                  <strong className={styles.contactOwnerName}>
                    {seller?.company_name || 'Property Owner'}
                  </strong>
                  <span className={styles.contactOwnerMeta}>
                    Verified · Direct Owner
                  </span>
                </div>
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactWa}
              >
                <MessageCircle size={19} />
                Contact Seller on WhatsApp
              </a>

              <div className={styles.contactSafe}>
                <Shield size={16} />
                <p>
                  Never pay before inspecting.{' '}
                  <Link href="/">Read our safety guide</Link>.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {similar && similar.length > 0 && (
          <section className={styles.similar}>
            <h2>More in {property.state}</h2>
            <div className={styles.similarGrid}>
              {similar.map((s: any) => (
                <PropertyCard key={s.id} property={s} />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className={styles.mobileContact}>
        <div className={styles.mcPrice}>
          {formatPriceRange(property.price_min, property.price_max)}
        </div>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mcBtn}
        >
          <MessageCircle size={18} />
          Contact
        </a>
      </div>
    </main>
  )
}
