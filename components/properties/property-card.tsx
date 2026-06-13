'use client'

import Link from 'next/link'
import { MapPin, Bed, Bath, Ruler, Check, MessageCircle } from 'lucide-react'
import { Property, PropertyMedia } from '@/lib/types'
import { formatPriceRange, formatLocation, getBedroomLabel, formatLandSize } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { generateWhatsAppLink } from '@/lib/utils'
import styles from '@/styles/property-card.module.css'

interface PropertyCardProps {
  property: Property & {
    property_media?: PropertyMedia[]
  }
}

export function PropertyCard({ property }: PropertyCardProps) {
  const coverImage = property.property_media?.find(m => m.media_type === 'image')
  const imageUrl = coverImage?.media_url || '/placeholder-property.svg'
  const whatsappLink = generateWhatsAppLink(
    property.seller?.whatsapp_number || '',
    property.title,
    property.id
  )

  return (
    <div className={styles.card}>
      <Link href={`/properties/${property.id}`} className={styles.imageWrap}>
        <img src={imageUrl} alt={property.title} />
        <div className={styles.badgeWrap}>
          <Badge variant={property.property_type === 'house' ? 'typeHouse' : 'typeLand'}>
            {property.property_type === 'house' ? 'House' : 'Land'}
          </Badge>
        </div>
      </Link>

      <div className={styles.content}>
        <Link href={`/properties/${property.id}`}>
          <h3 className={styles.title}>{property.title}</h3>
        </Link>
        <p className={styles.location}>
          {property.status === 'active' && (
            <span className={styles.verified}><Check size={13} /> Verified</span>
          )}
          <span>
            <MapPin size={13} />
            {formatLocation(property.city || '', property.state)}
          </span>
        </p>

        {property.property_type === 'house' && property.features && (
          <div className={styles.specs}>
            {(property.features.bedroom_category || property.features.bedrooms) && (
              <span>
                <Bed size={15} />
                {property.features.bedroom_category
                  ? getBedroomLabel(property.features.bedroom_category)
                  : `${property.features.bedrooms} beds`}
              </span>
            )}
            {property.features.bathrooms && (
              <span>
                <Bath size={15} />
                {property.features.bathrooms} baths
              </span>
            )}
            {property.features.land_size && (
              <span>
                <Ruler size={15} />
                {property.features.land_size_unit
                  ? formatLandSize(property.features.land_size, property.features.land_size_unit)
                  : `${property.features.land_size} sqm`}
              </span>
            )}
          </div>
        )}

        {property.property_type === 'land' && property.features?.land_size && (
          <div className={styles.specs}>
            <span>
              <Ruler size={15} />
              {property.features.land_size_unit
                ? formatLandSize(property.features.land_size, property.features.land_size_unit)
                : `${property.features.land_size} sqm`}
            </span>
          </div>
        )}

        <p className={styles.price}>{formatPriceRange(property.price_min, property.price_max)}</p>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.whatsappBtn}
          onClick={(e) => e.stopPropagation()}
        >
          <MessageCircle size={17} />
          Contact Seller
        </a>
      </div>
    </div>
  )
}
