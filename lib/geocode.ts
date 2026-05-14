export interface GeocodeResult {
  lat: number
  lng: number
  displayName?: string
}

export async function geocodeAddress(
  city: string | null,
  state: string,
  lga: string | null,
  country: string = 'Nigeria'
): Promise<GeocodeResult | null> {
  const parts = [lga, city, state, country].filter(Boolean)
  const q = parts.join(', ')

  if (!q) return null

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'StrongTowerHoldings/1.0 (property listing platform)',
      'Accept-Language': 'en',
    },
  })

  if (!res.ok) return null

  const data = await res.json()
  if (!data || data.length === 0) return null

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  }
}
