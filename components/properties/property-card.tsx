import Link from 'next/link'
import Image from 'next/image'
import { Property, PropertyMedia } from '@/lib/types'
import { formatPriceRange, formatLocation } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface PropertyCardProps {
  property: Property & {
    property_media?: PropertyMedia[]
  }
}

export function PropertyCard({ property }: PropertyCardProps) {
  const coverImage = property.property_media?.find(m => m.media_type === 'image')
  const imageUrl = coverImage?.media_url || '/placeholder-property.jpg'

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="group overflow-hidden rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
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
          <h3 className="mb-2 text-lg font-semibold text-zinc-900 line-clamp-2 group-hover:text-zinc-700">
            {property.title}
          </h3>

          {/* Price */}
          <p className="mb-3 text-xl font-bold text-zinc-900">
            {formatPriceRange(property.price_min, property.price_max)}
          </p>

          {/* Location */}
          <p className="text-sm text-zinc-600">
            📍 {formatLocation(property.city || '', property.state)}
          </p>

          {/* Features Preview (if house) */}
          {property.property_type === 'house' && property.features && (
            <div className="mt-3 flex gap-3 text-xs text-zinc-500">
              {property.features.bedrooms && (
                <span>🛏️ {property.features.bedrooms} beds</span>
              )}
              {property.features.bathrooms && (
                <span>🚿 {property.features.bathrooms} baths</span>
              )}
            </div>
          )}

          {/* Features Preview (if land) */}
          {property.property_type === 'land' && property.features?.land_size && (
            <div className="mt-3 text-xs text-zinc-500">
              📏 {property.features.land_size} {property.features.land_size_unit || 'sqm'}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
