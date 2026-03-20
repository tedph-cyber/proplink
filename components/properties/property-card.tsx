import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Bed, Bath, Ruler } from 'lucide-react'
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
    <Link href={`/properties/${property.id}`} className="block group">
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 hover:border-[var(--primary)]/40 h-full">

        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--muted)]">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Property Type Badge */}
          <div className="absolute left-3 top-3">
            <Badge variant={property.property_type === 'house' ? 'info' : 'success'}>
              {property.property_type === 'house' ? 'House' : 'Land'}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="mb-1.5 text-base font-semibold text-[var(--card-foreground)] line-clamp-2 group-hover:text-[var(--primary)] transition-colors leading-snug">
            {property.title}
          </h3>

          {/* Price */}
          <p className="mb-3 text-lg font-bold text-[var(--primary)] border-l-2 border-[var(--primary)] pl-2">
            {formatPriceRange(property.price_min, property.price_max)}
          </p>

          {/* Location */}
          <p className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] mb-3">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {formatLocation(property.city || '', property.state)}
          </p>

          {/* Features (house) */}
          {property.property_type === 'house' && property.features && (
            <div className="space-y-2">
              {property.features.house_types && property.features.house_types.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {property.features.house_types.map((type, idx) => (
                    <Badge key={idx} variant="default" className="text-xs">
                      {getHouseTypeLabels([type])[0]}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-4 text-xs text-[var(--muted-foreground)]">
                {(property.features.bedroom_category || property.features.bedrooms) && (
                  <span className="flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5" />
                    {property.features.bedroom_category
                      ? getBedroomLabel(property.features.bedroom_category)
                      : `${property.features.bedrooms} beds`}
                  </span>
                )}
                {property.features.bathrooms && (
                  <span className="flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5" />
                    {property.features.bathrooms} baths
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Features (land) */}
          {property.property_type === 'land' && property.features && (
            <div className="text-xs text-[var(--muted-foreground)]">
              {property.features.land_size && (
                <span className="flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5" />
                  {property.features.land_size_unit
                    ? formatLandSize(property.features.land_size, property.features.land_size_unit)
                    : `${property.features.land_size} sqm`}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
