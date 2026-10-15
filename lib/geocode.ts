export interface GeocodeResult {
  lat: number
  lng: number
  displayName?: string
}

async function queryNominatim(q: string): Promise<GeocodeResult | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=ng`

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

export async function geocodeAddress(
  city: string | null,
  state: string,
  lga: string | null,
  country: string = 'Nigeria'
): Promise<GeocodeResult | null> {
  if (!city && !state) return null

  // Try progressively simpler queries
  const queries: string[] = []
  if (city && lga) queries.push(`${city}, ${lga}, ${state}, ${country}`)
  if (city) queries.push(`${city}, ${state}, ${country}`)
  if (lga) queries.push(`${lga}, ${state}, ${country}`)
  if (state) queries.push(`${state}, ${country}`)

  for (const q of queries) {
    const result = await queryNominatim(q)
    if (result) return result
  }

  return null
}
