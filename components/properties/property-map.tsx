'use client'

import { useEffect, useRef } from 'react'

interface PropertyMapProps {
  lat: number
  lng: number
  label: string
  className?: string
}

export function PropertyMap({ lat, lng, label, className }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (mapInstanceRef.current) return

    async function initMap() {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')

      if (!mapRef.current) return

      const icon = L.divIcon({
        className: '',
        html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#D97736" stroke="white" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      })

      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 14,
        scrollWheelZoom: false,
        attributionControl: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map)

      L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(label)

      mapInstanceRef.current = map
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [lat, lng, label])

  return (
    <div
      ref={mapRef}
      className={className || 'w-full h-48 rounded-lg overflow-hidden'}
      style={{ background: 'var(--color-surface-2)' }}
    />
  )
}
