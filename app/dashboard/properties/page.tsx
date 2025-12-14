import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Property, PropertyMedia } from '@/lib/types'
import { formatPriceRange } from '@/lib/utils'
import { DeletePropertyButton } from '@/components/properties/delete-property-button'

export default async function MyPropertiesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's properties with media
  const { data: properties } = await supabase
    .from('properties')
    .select(`
      *,
      property_media (*)
    `)
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  const typedProperties = properties as (Property & { property_media: PropertyMedia[] })[] | null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">My Properties</h1>
          <p className="mt-2 text-zinc-600">
            {typedProperties?.length || 0} {typedProperties?.length === 1 ? 'property' : 'properties'} listed
          </p>
        </div>
        <Link href="/dashboard/properties/new">
          <Button>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Property
          </Button>
        </Link>
      </div>

      {!typedProperties || typedProperties.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-zinc-200 flex items-center justify-center">
            <svg className="h-6 w-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">No properties yet</h2>
          <p className="text-zinc-600 mb-6">Start listing your properties to reach potential buyers.</p>
          <Link href="/dashboard/properties/new">
            <Button>List Your First Property</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {typedProperties.map((property) => {
            const firstImage = property.property_media
              ?.filter(m => m.media_type === 'image')
              .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))[0]

            return (
              <div
                key={property.id}
                className="rounded-lg border border-zinc-200 bg-white overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="grid md:grid-cols-[300px_1fr] gap-6">
                  {/* Property Image */}
                  <div className="relative aspect-4/3 md:aspect-auto md:h-full bg-zinc-100">
                    {firstImage ? (
                      <img
                        src={firstImage.media_url}
                        alt={property.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <svg className="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge variant={property.status === 'active' ? 'success' : property.status === 'sold' ? 'warning' : 'default'}>
                        {property.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-6 flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-zinc-900 mb-1">
                            {property.title}
                          </h3>
                          <p className="text-sm text-zinc-600">
                            {property.city}, {property.state}
                          </p>
                        </div>
                        <Badge className="capitalize">{property.property_type}</Badge>
                      </div>

                      <p className="text-lg font-bold text-zinc-900 mb-3">
                        {formatPriceRange(property.price_min, property.price_max)}
                      </p>

                      <p className="text-sm text-zinc-600 line-clamp-2 mb-4">
                        {property.description}
                      </p>

                      {/* Property Features */}
                      {property.features && (
                        <div className="flex flex-wrap gap-3 text-xs text-zinc-600">
                          {property.property_type === 'house' && (
                            <>
                              {property.features.bedrooms && (
                                <span className="flex items-center gap-1">
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                  </svg>
                                  {property.features.bedrooms} beds
                                </span>
                              )}
                              {property.features.bathrooms && (
                                <span className="flex items-center gap-1">
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                  </svg>
                                  {property.features.bathrooms} baths
                                </span>
                              )}
                            </>
                          )}
                          {property.property_type === 'land' && property.features.land_size && (
                            <span className="flex items-center gap-1">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                              </svg>
                              {property.features.land_size} {property.features.land_size_unit}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {property.property_media?.length || 0} photos
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6 pt-4 border-t border-zinc-200">
                      <Link href={`/properties/${property.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </Button>
                      </Link>
                      <Link href={`/dashboard/properties/${property.id}/edit`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </Button>
                      </Link>
                      <DeletePropertyButton
                        propertyId={property.id}
                        propertyTitle={property.title}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
