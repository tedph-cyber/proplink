'use client'

import dynamic from 'next/dynamic'

const PropertyMap = dynamic(() => import('@/components/properties/property-map').then(m => m.PropertyMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 rounded-lg bg-[var(--color-surface-2)] flex items-center justify-center">
      <div className="text-center text-[var(--color-text-muted)]">
        <svg className="w-8 h-8 mx-auto mb-1 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <p className="text-xs">Loading map...</p>
      </div>
    </div>
  ),
})

interface MapWrapperProps {
  lat: number
  lng: number
  label: string
}

export function MapWrapper({ lat, lng, label }: MapWrapperProps) {
  return <PropertyMap lat={lat} lng={lng} label={label} className="w-full h-48 rounded-lg overflow-hidden" />
}
