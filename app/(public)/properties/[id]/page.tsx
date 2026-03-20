import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Bed, Bath, Ruler, MapPin, AlertTriangle } from 'lucide-react'
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
    .select(`*, property_media (*), profiles (*)`)
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data as Property & { property_media: PropertyMedia[]; profiles: Profile }
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { id } = await params
  const property = await getProperty(id)
  if (!property) return { title: 'Property Not Found | PropLink' }
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
  if (!property) notFound()

  const { property_media, profiles: seller } = property
  const media = property_media || []

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-[var(--muted-foreground)]">
        <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link href="/properties" className="hover:text-[var(--foreground)] transition-colors">Properties</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-[var(--foreground)] truncate max-w-[200px] sm:max-w-none">
          {truncateText(property.title, 50)}
        </span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <ImageGallery media={media} propertyTitle={property.title} />

          {/* Title and Type */}
          <div>
            <div className="mb-3 flex items-center gap-3 flex-wrap">
              <Badge variant={property.property_type === 'house' ? 'info' : 'success'}>
                {property.property_type === 'house' ? 'House' : 'Land'}
              </Badge>
              <span className="text-sm text-[var(--muted-foreground)]">
                Posted {new Date(property.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] leading-snug">
              {property.title}
            </h1>
          </div>

          {/* Price */}
          <div className="rounded-xl bg-gradient-to-r from-[var(--primary)]/5 to-[var(--accent)]/5 border border-[var(--primary)]/15 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1">Price</p>
            <p className="text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
              {formatPriceRange(property.price_min, property.price_max)}
            </p>
          </div>

          {/* Description */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-[var(--foreground)]">Description</h2>
            <p className="whitespace-pre-wrap text-[var(--muted-foreground)] leading-relaxed text-sm sm:text-base">
              {property.description}
            </p>
          </div>

          {/* Features */}
          {property.features && Object.keys(property.features).length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Features</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {property.features.bedrooms && (
                  <FeatureCard icon={<Bed className="w-5 h-5 text-[var(--primary)]" />} label="Bedrooms" value={String(property.features.bedrooms)} />
                )}
                {property.features.bathrooms && (
                  <FeatureCard icon={<Bath className="w-5 h-5 text-[var(--primary)]" />} label="Bathrooms" value={String(property.features.bathrooms)} />
                )}
                {property.features.land_size && (
                  <FeatureCard
                    icon={<Ruler className="w-5 h-5 text-[var(--primary)]" />}
                    label="Land Size"
                    value={`${property.features.land_size} ${property.features.land_size_unit || 'sqm'}`}
                  />
                )}
              </div>

              {property.features.additional_features && property.features.additional_features.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-[var(--muted-foreground)]">Additional Features</p>
                  <div className="flex flex-wrap gap-2">
                    {property.features.additional_features.map((feature, index) => (
                      <Badge key={index} variant="default">✓ {feature}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Location */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-[var(--foreground)]">Location</h2>
            <div className="rounded-xl border border-[var(--border)] p-4 flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10">
                <MapPin className="w-4 h-4 text-[var(--primary)]" />
              </div>
              <div>
                <p className="font-semibold text-[var(--foreground)]">{property.city}</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {[property.lga, property.state, property.country].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-5">
            {/* Seller Info */}
            <div className="rounded-2xl border border-[var(--border)] backdrop-blur-xl bg-white/85 dark:bg-zinc-900/70 p-5 shadow-lg">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Seller Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">Seller Type</p>
                  <p className="font-medium capitalize text-[var(--foreground)]">
                    {seller.seller_type || 'Individual'}
                  </p>
                </div>
                {seller.company_name && (
                  <div>
                    <p className="text-xs text-[var(--muted-foreground)]">Company</p>
                    <p className="font-medium text-[var(--foreground)]">{seller.company_name}</p>
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
            <div className="rounded-2xl bg-amber-50/90 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-700/30 p-4">
              <h4 className="mb-2 font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4" /> Safety Tips
              </h4>
              <ul className="space-y-1 text-sm text-amber-800 dark:text-amber-300">
                <li>• Meet seller in a public place</li>
                <li>• Check property documents</li>
                <li>• Don&apos;t pay in advance</li>
                <li>• Verify property ownership</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10">
        {icon}
      </div>
      <div>
        <p className="text-xs text-[var(--muted-foreground)]">{label}</p>
        <p className="font-semibold text-[var(--foreground)] text-sm">{value}</p>
      </div>
    </div>
  )
}
