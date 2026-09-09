'use server'

import { createClient } from '@/lib/supabase/server'
import { geocodeAddress } from '@/lib/geocode'

export async function geocodeAndUpdateProperty(
  propertyId: string,
  city: string | null,
  state: string,
  lga: string | null
): Promise<{ success: boolean; coords?: { lat: number; lng: number } }> {
  try {
    const result = await geocodeAddress(city, state, lga)
    if (!result) return { success: false }

    const supabase = await createClient()
    const { error } = await supabase
      .from('properties')
      .update({
        latitude: result.lat,
        longitude: result.lng,
      })
      .eq('id', propertyId)

    if (error) return { success: false }

    return { success: true, coords: { lat: result.lat, lng: result.lng } }
  } catch {
    return { success: false }
  }
}
