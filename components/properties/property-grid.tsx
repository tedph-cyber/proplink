import { Property, PropertyMedia } from '@/lib/types'
import { PropertyCard } from './property-card'

interface PropertyGridProps {
  properties: (Property & { property_media?: PropertyMedia[] })[]
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-[var(--border)]">
        <div className="text-center">
          <div className="mb-4 text-6xl">🏠</div>
          <h3 className="mb-2 text-xl font-semibold text-[var(--foreground)]">No Properties Found</h3>
          <p className="text-[var(--muted-foreground)]">Check back later for new listings.</p>
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
