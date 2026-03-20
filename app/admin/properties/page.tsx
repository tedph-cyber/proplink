import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Property, PropertyMedia, Profile } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { formatPriceRange } from '@/lib/utils'
import { DeletePropertyButton } from '@/components/properties/delete-property-button'

export default async function AdminPropertiesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  // Fetch all properties with seller info
  const { data: properties } = await supabase
    .from('properties')
    .select(`
      *,
      property_media (*),
      profiles!properties_seller_id_fkey (
        id,
        whatsapp_number,
        seller_type,
        company_name
      )
    `)
    .order('created_at', { ascending: false })

  const typedProperties = properties as (Property & { 
    property_media: PropertyMedia[]
    profiles: Profile 
  })[] | null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Manage Properties</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            {typedProperties?.length || 0} {typedProperties?.length === 1 ? 'property' : 'properties'} total
          </p>
        </div>
        <Link
          href="/admin"
          className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {!typedProperties || typedProperties.length === 0 ? (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-12 text-center">
          <p className="text-[var(--muted-foreground)]">No properties listed yet</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {typedProperties.map((property) => {
            const firstImage = property.property_media
              ?.filter(m => m.media_type === 'image')
              .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))[0]

            const seller = property.profiles

            return (
              <div
                key={property.id}
                className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="grid md:grid-cols-[250px_1fr] gap-6">
                  {/* Property Image */}
                  <div className="relative aspect-4/3 md:aspect-auto md:h-full bg-[var(--muted)]">
                    {firstImage ? (
                      <img
                        src={firstImage.media_url}
                        alt={property.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <svg className="h-12 w-12 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Badge className="capitalize">{property.property_type}</Badge>
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
                          <h3 className="text-xl font-semibold text-[var(--foreground)] mb-1">
                            {property.title}
                          </h3>
                          <p className="text-sm text-[var(--muted-foreground)]">
                            {property.city}, {property.state}
                          </p>
                        </div>
                      </div>

                      <p className="text-lg font-bold text-[var(--foreground)] mb-3">
                        {formatPriceRange(property.price_min, property.price_max)}
                      </p>

                      <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-4">
                        {property.description}
                      </p>

                      {/* Seller Info */}
                      <div className="mb-4 p-3 bg-[var(--muted)] rounded-lg">
                        <p className="text-xs font-medium text-[var(--muted-foreground)] mb-1">Seller</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-[var(--foreground)]">
                              {seller?.company_name || 'Individual Seller'}
                            </p>
                            <p className="text-xs text-[var(--muted-foreground)]">
                              {seller?.whatsapp_number || 'No WhatsApp'}
                            </p>
                          </div>
                          <Badge className="capitalize text-xs">
                            {seller?.seller_type || 'individual'}
                          </Badge>
                        </div>
                      </div>

                      {/* Property Features */}
                      {property.features && (
                        <div className="flex flex-wrap gap-3 text-xs text-[var(--muted-foreground)]">
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
                          <span className="text-[var(--muted-foreground)]">
                            • Posted {new Date(property.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6 pt-4 border-t border-[var(--border)]">
                      <Link href={`/properties/${property.id}`} className="flex-1">
                        <button className="w-full rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)]">
                          View Public
                        </button>
                      </Link>
                      <Link href={`/dashboard/properties/${property.id}/edit`} className="flex-1">
                        <button className="w-full rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)]">
                          Edit
                        </button>
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
