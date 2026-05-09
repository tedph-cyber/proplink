import Link from 'next/link'
import { MapPin, Bed, Bath, Ruler } from 'lucide-react'
import { Property, PropertyMedia } from '@/lib/types'
import { formatPriceRange, formatLocation, getHouseTypeLabels, getBedroomLabel, formatLandSize } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import styles from '@/styles/property-card.module.css'

interface PropertyCardProps {
  property: Property & {
    property_media?: PropertyMedia[]
  }
}

export function PropertyCard({ property }: PropertyCardProps) {
  const coverImage = property.property_media?.find(m => m.media_type === 'image')
  const imageUrl = coverImage?.media_url || '/placeholder-property.svg'

  return (
    <Link href={`/properties/${property.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={imageUrl} alt={property.title} />
        <div className={styles.badgeWrap}>
          <Badge variant={property.property_type === 'house' ? 'typeHouse' : 'typeLand'}>
            {property.property_type === 'house' ? 'House' : 'Land'}
          </Badge>
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{property.title}</h3>
        <p className={styles.price}>{formatPriceRange(property.price_min, property.price_max)}</p>
        <p className={styles.location}>
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          {formatLocation(property.city || '', property.state)}
        </p>

        {property.property_type === 'house' && property.features && (
          <>
            {property.features.house_types && property.features.house_types.length > 0 && (
              <div className={styles.featureTags}>
                {property.features.house_types.map((type, idx) => (
                  <Badge key={idx} variant="neutral" className="text-xs">
                    {getHouseTypeLabels([type])[0]}
                  </Badge>
                ))}
              </div>
            )}
            <div className={styles.featureIcons}>
              {(property.features.bedroom_category || property.features.bedrooms) && (
                <span className={styles.featureIcon}>
                  <Bed />
                  {property.features.bedroom_category
                    ? getBedroomLabel(property.features.bedroom_category)
                    : `${property.features.bedrooms} beds`}
                </span>
              )}
              {property.features.bathrooms && (
                <span className={styles.featureIcon}>
                  <Bath />
                  {property.features.bathrooms} baths
                </span>
              )}
            </div>
          </>
        )}

        {property.property_type === 'land' && property.features && (
          <div className={styles.featureIcons}>
            {property.features.land_size && (
              <span className={styles.featureIcon}>
                <Ruler />
                {property.features.land_size_unit
                  ? formatLandSize(property.features.land_size, property.features.land_size_unit)
                  : `${property.features.land_size} sqm`}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
