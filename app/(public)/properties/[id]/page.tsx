import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Property, PropertyMedia, Profile } from '@/lib/types'
import { ImageGallery } from '@/components/properties/image-gallery'
import { ContactButton } from '@/components/properties/contact-button'
import { Badge } from '@/components/ui/badge'
import { formatPriceRange, formatLocation, truncateText } from '@/lib/utils'
import type { Metadata } from 'next'

interface PropertyPageProps {
  params: Promise<{ id: string }>
}

async function getProperty(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      property_media (*),
      profiles (*)
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data as Property & {
    property_media: PropertyMedia[]
    profiles: Profile
  }
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) {
    return {
      title: 'Property Not Found | PropLink',
    }
  }

  const coverImage = property.property_media?.find(m => m.media_type === 'image')

  return {
    title: `${property.title} | PropLink`,
    description: truncateText(property.description, 160),
    openGraph: {
      title: property.title,
      description: truncateText(property.description, 160),
      images: coverImage ? [coverImage.media_url] : [],
    },
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) {
    notFound()
  }

  const { property_media, profiles: seller } = property
  const media = property_media || []

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-600">
        <Link href="/" className="hover:text-zinc-900">
          Home
        </Link>
        <span>/</span>
        <Link href="/properties" className="hover:text-zinc-900">
          Properties
        </Link>
        <span>/</span>
        <span className="text-zinc-900">{truncateText(property.title, 50)}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <ImageGallery media={media} propertyTitle={property.title} />

          {/* Title and Type */}
          <div>
            <div className="mb-3 flex items-center gap-3">
              <Badge variant={property.property_type === 'house' ? 'info' : 'success'}>
                {property.property_type === 'house' ? '🏠 House' : '🏞️ Land'}
              </Badge>
              <span className="text-sm text-zinc-500">
                Posted {new Date(property.created_at).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
              {property.title}
            </h1>
          </div>

          {/* Price */}
          <div className="rounded-lg bg-zinc-50 p-6">
            <p className="text-sm text-zinc-600 mb-1">Price</p>
            <p className="text-3xl font-bold text-zinc-900">
              {formatPriceRange(property.price_min, property.price_max)}
            </p>
          </div>

          {/* Description */}
          <div>
            <h2 className="mb-3 text-xl font-semibold text-zinc-900">Description</h2>
            <p className="whitespace-pre-wrap text-zinc-700 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Features */}
          {property.features && Object.keys(property.features).length > 0 && (
            <div>
              <h2 className="mb-3 text-xl font-semibold text-zinc-900">Features</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {property.features.bedrooms && (
                  <div className="flex items-center gap-2 rounded-lg border border-zinc-200 p-3">
                    <span className="text-2xl">🛏️</span>
                    <div>
                      <p className="text-sm text-zinc-600">Bedrooms</p>
                      <p className="font-semibold text-zinc-900">{property.features.bedrooms}</p>
                    </div>
                  </div>
                )}
                {property.features.bathrooms && (
                  <div className="flex items-center gap-2 rounded-lg border border-zinc-200 p-3">
                    <span className="text-2xl">🚿</span>
                    <div>
                      <p className="text-sm text-zinc-600">Bathrooms</p>
                      <p className="font-semibold text-zinc-900">{property.features.bathrooms}</p>
                    </div>
                  </div>
                )}
                {property.features.land_size && (
                  <div className="flex items-center gap-2 rounded-lg border border-zinc-200 p-3">
                    <span className="text-2xl">📏</span>
                    <div>
                      <p className="text-sm text-zinc-600">Land Size</p>
                      <p className="font-semibold text-zinc-900">
                        {property.features.land_size} {property.features.land_size_unit || 'sqm'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Features */}
              {property.features.additional_features && property.features.additional_features.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-zinc-700">Additional Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {property.features.additional_features.map((feature, index) => (
                      <Badge key={index} variant="default">
                        ✓ {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Location */}
          <div>
            <h2 className="mb-3 text-xl font-semibold text-zinc-900">Location</h2>
            <div className="space-y-2 rounded-lg border border-zinc-200 p-4">
              <div className="flex items-start gap-2">
                <span className="text-xl">📍</span>
                <div className="flex-1">
                  <p className="font-medium text-zinc-900">{property.city}</p>
                  <p className="text-sm text-zinc-600">
                    {property.lga}, {property.state}, {property.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            {/* Seller Info */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-zinc-900">Seller Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-zinc-600">Seller Type</p>
                  <p className="font-medium capitalize text-zinc-900">
                    {seller.seller_type || 'Individual'}
                  </p>
                </div>
                {seller.company_name && (
                  <div>
                    <p className="text-sm text-zinc-600">Company</p>
                    <p className="font-medium text-zinc-900">{seller.company_name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Button */}
            <ContactButton
              whatsappNumber={seller.whatsapp_number}
              propertyTitle={property.title}
              propertyId={property.id}
            />

            {/* Safety Tips */}
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
              <h4 className="mb-2 font-semibold text-yellow-900 flex items-center gap-2">
                <span>⚠️</span> Safety Tips
              </h4>
              <ul className="space-y-1 text-sm text-yellow-800">
                <li>• Meet seller in a public place</li>
                <li>• Check property documents</li>
                <li>• Don't pay in advance</li>
                <li>• Verify property ownership</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
