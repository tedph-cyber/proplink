import { Property, PropertyMedia } from '@/lib/types'
import { PropertyCard } from './property-card'
import styles from '@/styles/property-grid.module.css'

interface PropertyGridProps {
  properties: (Property & { property_media?: PropertyMedia[] })[]
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyInner}>
          <div className={styles.emptyIcon}>🏠</div>
          <h3 className={styles.emptyTitle}>No Properties Found</h3>
          <p className={styles.emptyDesc}>Check back later for new listings.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
