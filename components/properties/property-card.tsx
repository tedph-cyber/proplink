import Link from 'next/link'
import Image from 'next/image'
import { Property, PropertyMedia } from '@/lib/types'
import { formatPriceRange, formatLocation, getHouseTypeLabels, getBedroomLabel, formatLandSize } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface PropertyCardProps {
  property: Property & {
    property_media?: PropertyMedia[]
  }
}

export function PropertyCard({ property }: PropertyCardProps) {
  const coverImage = property.property_media?.find(m => m.media_type === 'image')
  const imageUrl = coverImage?.media_url || '/placeholder-property.svg'

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="group overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:border-[var(--primary)]">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--muted)]">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Property Type Badge */}
          <div className="absolute left-3 top-3">
            <Badge variant={property.property_type === 'house' ? 'info' : 'success'}>
              {property.property_type === 'house' ? '🏠 House' : '🏞️ Land'}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold text-[var(--card-foreground)] line-clamp-2 group-hover:text-[var(--primary)] transition-colors tracking-[var(--letter-spacing)]">
            {property.title}
          </h3>

          {/* Price */}
          <p className="mb-3 text-xl font-bold text-[var(--primary)] tracking-[var(--letter-spacing)]">
            {formatPriceRange(property.price_min, property.price_max)}
          </p>

          {/* Location */}
          <p className="text-sm text-[var(--muted-foreground)] tracking-[var(--letter-spacing)]">
            📍 {formatLocation(property.city || '', property.state)}
          </p>

          {/* Features Preview (if house) */}
          {property.property_type === 'house' && property.features && (
            <div className="mt-3 space-y-2 text-xs text-[var(--muted-foreground)]">
              {property.features.house_types && property.features.house_types.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {property.features.house_types.map((type, idx) => (
                    <Badge key={idx} variant="default" className="text-xs">
                      {getHouseTypeLabels([type])[0]}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                {property.features.bedroom_category && (
                  <span>🛏️ {getBedroomLabel(property.features.bedroom_category)}</span>
                )}
                {property.features.bedrooms && (
                  <span>🛏️ {property.features.bedrooms} beds</span>
                )}
                {property.features.bathrooms && (
                  <span>🚿 {property.features.bathrooms} baths</span>
                )}
              </div>
            </div>
          )}

          {/* Features Preview (if land) */}
          {property.property_type === 'land' && property.features && (
            <div className="mt-3 space-y-2 text-xs text-[var(--muted-foreground)]">
              {property.features.land_size && property.features.land_size_unit && (
                <div>📏 {formatLandSize(property.features.land_size, property.features.land_size_unit)}</div>
              )}
              {property.features.land_size && !property.features.land_size_unit && (
                <div>📏 {property.features.land_size} sqm</div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
