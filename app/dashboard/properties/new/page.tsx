'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PropertyType, PropertyFeatures, HouseType, BedroomCategory, LandSizeUnit } from '@/lib/types'
import { NIGERIAN_STATES, STATE_LGA_MAPPING_SIMPLIFIED, HOUSE_TYPES, BEDROOM_CATEGORIES, LAND_SIZE_UNITS } from '@/lib/constants'

const inputClass = "w-full bg-[var(--color-surface-2)] border-none rounded-[6px] py-4 px-5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:bg-[var(--color-surface)] transition-all"
const labelClass = "block text-xs font-bold tracking-widest uppercase text-[var(--color-text)]/60 mb-2"
const selectClass = "w-full bg-[var(--color-surface-2)] border-none rounded-[6px] py-4 px-5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:bg-[var(--color-surface)] appearance-none transition-all"

export default function NewPropertyPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState<1 | 2>(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'house' as PropertyType,
    listing_type: 'sale',
    price_min: '',
    price_max: '',
    state: '',
    lga: '',
    city: '',
    house_types: [] as HouseType[],
    bedroom_category: '' as BedroomCategory | '',
    bedrooms: '',
    bathrooms: '',
    land_size: '',
    land_size_unit: 'sqm' as LandSizeUnit,
    additionalFeatures: '',
  })

  const availableLGAs = useMemo(() => {
    return formData.state ? (STATE_LGA_MAPPING_SIMPLIFIED[formData.state] || []) : []
  }, [formData.state])

  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + mediaFiles.length > 10) { setError('Maximum 10 files'); return }
    const valid = files.filter(f => {
      if (!f.type.startsWith('image/') && !f.type.startsWith('video/')) { setError('Images and videos only'); return false }
      if (f.size > 10 * 1024 * 1024) { setError('Files must be under 10MB'); return false }
      return true
    })
    setMediaFiles(p => [...p, ...valid])
    valid.forEach(f => {
      const r = new FileReader()
      r.onloadend = () => setMediaPreviews(p => [...p, r.result as string])
      r.readAsDataURL(f)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const features: PropertyFeatures = {}
      if (formData.property_type === 'house') {
        if (formData.house_types.length > 0) features.house_types = formData.house_types
        if (formData.bedroom_category) features.bedroom_category = formData.bedroom_category
        if (formData.bedrooms) features.bedrooms = parseInt(formData.bedrooms)
        if (formData.bathrooms) features.bathrooms = parseInt(formData.bathrooms)
      } else {
        if (formData.land_size) { features.land_size = parseFloat(formData.land_size); features.land_size_unit = formData.land_size_unit }
      }
      if (formData.additionalFeatures) features.additional_features = formData.additionalFeatures.split(',').map(f => f.trim()).filter(Boolean)

      const { data: property, error: propertyError } = await supabase.from('properties').insert({
        seller_id: user.id,
        title: formData.title,
        description: formData.description,
        property_type: formData.property_type,
        price_min: parseInt(formData.price_min),
        price_max: formData.price_max ? parseInt(formData.price_max) : null,
        country: 'Nigeria',
        state: formData.state,
        lga: formData.lga || null,
        city: formData.city || null,
        features,
        status: 'active',
      }).select().single()

      if (propertyError) throw propertyError

      for (let i = 0; i < mediaFiles.length; i++) {
        const file = mediaFiles[i]
        const fileExt = file.name.split('.').pop()
        const filePath = `property-media/${property.id}/${Date.now()}-${i}.${fileExt}`
        const isImage = file.type.startsWith('image/')
        const bucket = isImage ? 'property-images' : 'property-videos'
        const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file)
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath)
        await supabase.from('property_media').insert({ property_id: property.id, media_url: publicUrl, media_type: isImage ? 'image' : 'video', display_order: i })
      }
      router.push('/dashboard/properties')
    } catch (err: any) {
      setError(err.message || 'Failed to create property')
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Progress Steps */}
      <div className="flex justify-center mb-14">
        <div className="flex items-center w-full max-w-sm">
          {[{ n: 1, label: 'Details' }, { n: 2, label: 'Media' }].map(({ n, label }, i) => (
            <div key={n} className="flex items-center flex-1">
              <div className="flex flex-col items-center relative flex-1">
                <button
                  type="button"
                  onClick={() => n < step || (n === 2 && formData.title) ? setStep(n as 1 | 2) : undefined}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-all ${
                    step === n
                      ? 'bg-[var(--color-accent)] text-white shadow-[var(--shadow-card)]'
                      : step > n
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]/40'
                  }`}
                >
                  {step > n ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : n}
                </button>
                <span className={`absolute -bottom-7 text-xs font-bold tracking-wider uppercase whitespace-nowrap ${step === n ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]/40'}`}>
                  {label}
                </span>
              </div>
              {i === 0 && <div className="h-[2px] flex-1 bg-[var(--color-surface-2)] mx-2" />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-4">
        {/* Form */}
        <div className="lg:col-span-8">
          {step === 1 ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)]">Basic Information</h1>
                <p className="text-[var(--color-text-muted)] mt-1">Start by defining the core identity of your property listing.</p>
              </div>

              {error && <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className={labelClass}>Property Title</label>
                  <input className={inputClass} placeholder="e.g. Modern Minimalist Villa in Lekki Phase 1" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                </div>

                {/* Category + Listing Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Category</label>
                    <select className={selectClass} value={formData.property_type} onChange={e => setFormData({ ...formData, property_type: e.target.value as PropertyType })}>
                      <option value="house">House</option>
                      <option value="land">Land</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Listing Type</label>
                    <div className="flex bg-[var(--color-surface-2)] p-1 rounded-[6px]">
                      {['sale', 'rent'].map(t => (
                        <button key={t} type="button" onClick={() => setFormData({ ...formData, listing_type: t })}
                          className={`flex-1 py-3 px-4 rounded-[4px] text-sm font-semibold transition-all capitalize ${formData.listing_type === t ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]'}`}>
                          For {t === 'sale' ? 'Sale' : 'Rent'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Price (₦)</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] font-medium text-sm">₦</span>
                      <input type="number" className={inputClass + ' pl-10'} placeholder="0.00" value={formData.price_min} onChange={e => setFormData({ ...formData, price_min: e.target.value })} required />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Max Price (₦) <span className="normal-case font-normal tracking-normal opacity-60">optional</span></label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] font-medium text-sm">₦</span>
                      <input type="number" className={inputClass + ' pl-10'} placeholder="For ranges" value={formData.price_max} onChange={e => setFormData({ ...formData, price_max: e.target.value })} />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>State</label>
                    <select className={selectClass} value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value, lga: '' })} required>
                      <option value="">Select State</option>
                      {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>LGA</label>
                    {formData.state && availableLGAs.length > 0 ? (
                      <select className={selectClass} value={formData.lga} onChange={e => setFormData({ ...formData, lga: e.target.value })}>
                        <option value="">Select LGA</option>
                        {availableLGAs.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    ) : (
                      <input className={inputClass} placeholder={formData.state ? 'Enter LGA' : 'Select state first'} value={formData.lga} onChange={e => setFormData({ ...formData, lga: e.target.value })} disabled={!formData.state} />
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>City / Area</label>
                  <input className={inputClass} placeholder="e.g. Lekki Phase 1" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} required />
                </div>

                {/* Description */}
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea className={inputClass + ' resize-none'} rows={5} placeholder="Describe the property in detail — features, surroundings, unique selling points..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                </div>

                {/* Type-specific fields */}
                {formData.property_type === 'house' ? (
                  <div className="space-y-5">
                    <div>
                      <label className={labelClass}>House Type(s)</label>
                      <div className="grid grid-cols-2 gap-2">
                        {HOUSE_TYPES.map(t => (
                          <label key={t.value} className={`flex items-center gap-2.5 px-4 py-3 rounded-lg cursor-pointer transition-all border ${formData.house_types.includes(t.value) ? 'border-[var(--color-accent)] bg-[var(--color-accent-muted)] text-[var(--color-accent)]' : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-accent)]/50'}`}>
                            <input type="checkbox" className="hidden" checked={formData.house_types.includes(t.value)} onChange={e => setFormData({ ...formData, house_types: e.target.checked ? [...formData.house_types, t.value] : formData.house_types.filter(x => x !== t.value) })} />
                            <span className="text-sm font-medium">{t.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className={labelClass}>Bedroom Category</label>
                        <select className={selectClass} value={formData.bedroom_category} onChange={e => setFormData({ ...formData, bedroom_category: e.target.value as BedroomCategory })}>
                          <option value="">Select</option>
                          {BEDROOM_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Bedrooms</label>
                        <input type="number" min="0" className={inputClass} placeholder="e.g. 4" value={formData.bedrooms} onChange={e => setFormData({ ...formData, bedrooms: e.target.value })} />
                      </div>
                      <div>
                        <label className={labelClass}>Bathrooms</label>
                        <input type="number" min="0" className={inputClass} placeholder="e.g. 3" value={formData.bathrooms} onChange={e => setFormData({ ...formData, bathrooms: e.target.value })} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Land Size</label>
                      <input type="number" min="0" step="0.01" className={inputClass} placeholder="e.g. 500" value={formData.land_size} onChange={e => setFormData({ ...formData, land_size: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClass}>Unit</label>
                      <select className={selectClass} value={formData.land_size_unit} onChange={e => setFormData({ ...formData, land_size_unit: e.target.value as LandSizeUnit })}>
                        {LAND_SIZE_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label className={labelClass}>Additional Features</label>
                  <input className={inputClass} placeholder="e.g. Swimming pool, Security, Generator (comma-separated)" value={formData.additionalFeatures} onChange={e => setFormData({ ...formData, additionalFeatures: e.target.value })} />
                </div>

                {/* Actions */}
                <div className="pt-6 flex justify-between items-center border-t border-[var(--color-border)]/10">
                  <button type="button" className="text-[var(--color-text-muted)] font-semibold hover:text-[var(--color-accent)] transition-colors text-sm" onClick={() => router.push('/dashboard/properties')}>
                    Cancel
                  </button>
                  <button type="button" onClick={() => { if (!formData.title || !formData.price_min || !formData.state) { setError('Please fill in title, price, and state.'); return; } setError(''); setStep(2) }}
                    className="bg-[var(--color-accent)] px-10 py-4 rounded-xl text-white font-bold">
                    Continue to Media →
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)]">Media Upload</h1>
                <p className="text-[var(--color-text-muted)] mt-1">Add photos and videos to showcase your property.</p>
              </div>

              {error && <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Drop zone */}
                <div>
                  <label className={labelClass}>Photos & Videos <span className="normal-case font-normal tracking-normal opacity-60">max 10 files, 10MB each</span></label>
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-[var(--color-border)] rounded-xl cursor-pointer bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-2)] transition-all group">
                    <div className="flex flex-col items-center gap-2 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className="font-semibold text-sm">Click to upload or drag & drop</span>
                      <span className="text-xs opacity-60">JPG, PNG, MP4 up to 10MB</span>
                    </div>
                    <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>

                {/* Previews */}
                {mediaPreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {mediaPreviews.map((preview, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden aspect-square">
                        {mediaFiles[i]?.type.startsWith('image/') ? (
                          <img src={preview} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <video src={preview} className="w-full h-full object-cover" />
                        )}
                        <button type="button" onClick={() => { setMediaFiles(p => p.filter((_, idx) => idx !== i)); setMediaPreviews(p => p.filter((_, idx) => idx !== i)) }}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[var(--color-destructive)] text-white text-xs flex items-center justify-center hover:scale-110 transition-transform">
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="pt-6 flex justify-between items-center border-t border-[var(--color-border)]/10">
                  <button type="button" onClick={() => setStep(1)} className="text-[var(--color-text-muted)] font-semibold hover:text-[var(--color-accent)] transition-colors text-sm">
                    ← Back to Details
                  </button>
                  <button type="submit" disabled={submitting} className="bg-[var(--color-accent)] px-10 py-4 rounded-xl text-white font-bold disabled:opacity-60 disabled:cursor-not-allowed">
                    {submitting ? 'Publishing…' : 'Publish Property'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Sidebar Tips */}
        <div className="lg:col-span-4">
          <div className="sticky top-8 space-y-6">
            <div className="bg-[var(--color-surface)] rounded-xl p-8 shadow-[var(--shadow-card)]">
              <div className="w-full h-40 rounded-lg overflow-hidden mb-6 bg-[var(--color-surface-2)]">
                <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text)] mb-4">Curator&apos;s Tip</h3>
              <ul className="space-y-4">
                {[
                  { icon: '✓', text: 'Detailed titles attract **40% more engagement** than generic ones.' },
                  { icon: '💡', text: 'Ensure the price reflects current market values in your LGA.' },
                  { icon: '🛡', text: 'Your contact info is never shared until a buyer is verified by StrongTower Holdings.' },
                ].map(({ icon, text }) => (
                  <li key={icon} className="flex gap-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
                    <span className="mt-0.5 text-[var(--color-accent)] font-bold flex-shrink-0">{icon}</span>
                    <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-[var(--color-text)]">$1</strong>') }} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[var(--color-surface-2)]/40 rounded-xl p-5 flex items-center gap-4">
              <div className="bg-[var(--color-accent-muted)] p-3 rounded-full text-[var(--color-accent)] flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--color-text)]">Need assistance?</p>
                <p className="text-xs text-[var(--color-text-muted)]">Chat with a Listing Agent now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
