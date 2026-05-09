import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Property, PropertyMedia, Profile } from '@/lib/types'
import { formatPriceRange } from '@/lib/utils'
import { DeletePropertyButton } from '@/components/properties/delete-property-button'

export default async function AdminPropertiesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const [
    { count: totalCount },
    { count: activeCount },
    { count: pendingCount },
    { data: properties },
  ] = await Promise.all([
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('properties').select(`
      *,
      property_media (*),
      profiles!properties_seller_id_fkey (id, whatsapp_number, seller_type, company_name)
    `).order('created_at', { ascending: false }),
  ])

  const typedProperties = properties as (Property & {
    property_media: PropertyMedia[]
    profiles: Profile
  })[] | null

  const stats = [
    { label: 'Total Listings', value: totalCount ?? 0, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', bg: 'bg-[var(--color-surface-2)]', color: 'text-[var(--color-accent)]' },
    { label: 'Active Now', value: activeCount ?? 0, icon: 'M13 10V3L4 14h7v7l9-11h-7z', bg: 'bg-[var(--color-accent)]', color: 'text-white', textValue: 'text-white', textLabel: 'text-white/80' },
    { label: 'Pending Review', value: pendingCount ?? 0, icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', bg: 'bg-[var(--color-surface-2)]', color: 'text-[var(--color-accent)]' },
  ]

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-text)] mb-1">
            Inventory{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]">
              Overview
            </span>
          </h1>
          <p className="text-[var(--color-text-muted)]">Review, edit and manage all property listings.</p>
        </div>
      </div>

      {/* Stats Row */}
      <section className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 [scrollbar-width:none]">
        {stats.map(({ label, value, icon, bg, color, textValue, textLabel }) => (
          <div key={label} className={`min-w-[200px] p-5 rounded-xl ${bg} flex flex-col justify-between flex-shrink-0`}>
            <div>
              <div className={`w-8 h-8 flex items-center justify-center mb-2 ${color}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
              </div>
              <p className={`text-sm font-medium ${textLabel ?? 'text-[var(--color-text-muted)]'}`}>{label}</p>
            </div>
            <p className={`text-3xl font-extrabold mt-4 tracking-tighter ${textValue ?? 'text-[var(--color-text)]'}`}>{value}</p>
          </div>
        ))}
      </section>

      {/* Content */}
      {!typedProperties || typedProperties.length === 0 ? (
        <div className="bg-[var(--color-surface)] rounded-3xl p-16 text-center shadow-[0_2px_16px_-4px_rgba(10,29,47,0.06)]">
          <p className="text-[var(--color-text-muted)] text-lg mb-2 font-semibold">No properties listed yet</p>
          <p className="text-[var(--color-text-muted)] text-sm">Listings will appear here once sellers add properties.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-[var(--color-text-muted)]">Manage Listings</h2>
            <span className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-widest">Sort: Recent</span>
          </div>

          {typedProperties.map((property) => {
            const firstImage = property.property_media
              ?.filter(m => m.media_type === 'image')
              .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))[0]
            const seller = property.profiles

            const statusStyles: Record<string, string> = {
              active: 'bg-green-100 text-green-700',
              pending: 'bg-amber-100 text-amber-700',
              sold: 'bg-slate-200 text-slate-600',
              inactive: 'bg-slate-100 text-slate-500',
            }
            const statusStyle = statusStyles[property.status] ?? 'bg-slate-100 text-slate-500'

            return (
              <div
                key={property.id}
                className="bg-[var(--color-surface)] rounded-xl p-4 flex gap-4 transition-all hover:shadow-md shadow-[0_2px_8px_-2px_rgba(10,29,47,0.04)]"
              >
                {/* Thumbnail */}
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--color-surface-2)]">
                  {firstImage ? (
                    <img src={firstImage.media_url} alt={property.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface)] flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#b2c5ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-[var(--color-text)] leading-tight line-clamp-1">{property.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${statusStyle}`}>
                        {property.status}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] font-medium mt-0.5">
                      {[property.city, property.lga, property.state].filter(Boolean).join(', ')}
                    </p>
                    {seller && (
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                        by <span className="font-semibold text-[var(--color-text)]">{seller.company_name || 'Individual Seller'}</span>
                        {' · '}{seller.seller_type}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <p className="font-extrabold text-[var(--color-accent)] text-base">{formatPriceRange(property.price_min, property.price_max)}</p>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/properties/${property.id}`}
                        className="p-2 rounded-lg hover:bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-all"
                        title="View public listing"
                        target="_blank"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      <Link
                        href={`/dashboard/properties/${property.id}/edit`}
                        className="p-2 rounded-lg hover:bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-all"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <DeletePropertyButton propertyId={property.id} propertyTitle={property.title} />
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
