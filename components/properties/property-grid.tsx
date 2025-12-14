import { Property, PropertyMedia } from '@/lib/types'
import { PropertyCard } from './property-card'

interface PropertyGridProps {
  properties: (Property & { property_media?: PropertyMedia[] })[]
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-zinc-300">
        <div className="text-center">
          <div className="mb-4 text-6xl">🏠</div>
          <h3 className="mb-2 text-xl font-semibold text-zinc-900">No Properties Found</h3>
          <p className="text-zinc-600">Check back later for new listings.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
