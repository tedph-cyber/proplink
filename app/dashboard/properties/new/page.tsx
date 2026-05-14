'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PropertyType, PropertyFeatures, HouseType, BedroomCategory, LandSizeUnit } from '@/lib/types'
import { NIGERIAN_STATES, STATE_LGA_MAPPING_SIMPLIFIED, HOUSE_TYPES, BEDROOM_CATEGORIES, LAND_SIZE_UNITS } from '@/lib/constants'
import { geocodeAddress } from '@/lib/geocode'
import styles from '@/styles/admin.module.css'

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

      // Geocode address for map display (non-blocking)
      geocodeAddress(formData.city, formData.state, formData.lga).then((result) => {
        if (result) {
          supabase.from('properties').update({
            latitude: result.lat,
            longitude: result.lng,
          }).eq('id', property.id).then()
        }
      })

      router.push('/dashboard/properties')
    } catch (err: any) {
      setError(err.message || 'Failed to create property')
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.formWrap}>
      {/* Progress Steps */}
      <div className={styles.stepProgress}>
        <div className={styles.stepTrack} style={{ maxWidth: '280px' }}>
          {[{ n: 1, label: 'Details' }, { n: 2, label: 'Media' }].map(({ n, label }, i) => (
            <div key={n} className="flex items-center flex-1">
              <div className={styles.stepItem}>
                <button
                  type="button"
                  onClick={() => n < step || (n === 2 && formData.title) ? setStep(n as 1 | 2) : undefined}
                  className={step === n ? styles.stepDotActive : step > n ? styles.stepDotDone : styles.stepDotInactive}
                >
                  {step > n ? (
                    <svg className={styles.stepDotCheck} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : n}
                </button>
                <span className={step === n ? styles.stepLabelActive : styles.stepLabelInactive}>
                  {label}
                </span>
              </div>
              {i === 0 && <div className={styles.stepConnector} />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form */}
        <div className="lg:col-span-9">
          {step === 1 ? (
            <>
              <div className={styles.formSection}>
                <h1 className={styles.formSectionHeading}>Basic Information</h1>
                <p className={styles.formSectionDesc}>Start by defining the core identity of your property listing.</p>
              </div>

              {error && <div className={styles.errorBanner}>{error}</div>}

              <div className={styles.formFields}>
                {/* Title */}
                <div>
                  <label className={styles.formLabel}>Property Title</label>
                  <input className={styles.formInput} placeholder="e.g. Modern Minimalist Villa in Lekki Phase 1" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                </div>

                {/* Category + Listing Type */}
                <div className={styles.formGrid}>
                  <div>
                    <label className={styles.formLabel}>Category</label>
                    <select className={styles.formSelect} value={formData.property_type} onChange={e => setFormData({ ...formData, property_type: e.target.value as PropertyType })}>
                      <option value="house">House</option>
                      <option value="land">Land</option>
                    </select>
                  </div>
                  <div>
                    <label className={styles.formLabel}>Listing Type</label>
                    <div className="flex bg-[var(--color-surface-2)] p-1 rounded-[6px]">
                      {['sale', 'rent'].map(t => (
                        <button key={t} type="button" onClick={() => setFormData({ ...formData, listing_type: t })}
                          className={formData.listing_type === t ? styles.toggleBtnActive : styles.toggleBtnDefault}>
                          For {t === 'sale' ? 'Sale' : 'Rent'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className={styles.formGrid}>
                  <div>
                    <label className={styles.formLabel}>Price (₦)</label>
                    <div className={styles.inputWrap}>
                      <span className={styles.formInputPrefix}>₦</span>
                      <input type="number" className={styles.formInputWithPrefix} placeholder="0.00" value={formData.price_min} onChange={e => setFormData({ ...formData, price_min: e.target.value })} required />
                    </div>
                  </div>
                  <div>
                    <label className={styles.formLabel}>Max Price (₦) <span className={styles.formLabelHint}>optional</span></label>
                    <div className={styles.inputWrap}>
                      <span className={styles.formInputPrefix}>₦</span>
                      <input type="number" className={styles.formInputWithPrefix} placeholder="For ranges" value={formData.price_max} onChange={e => setFormData({ ...formData, price_max: e.target.value })} />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className={styles.formGrid}>
                  <div>
                    <label className={styles.formLabel}>State</label>
                    <select className={styles.formSelect} value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value, lga: '' })} required>
                      <option value="">Select State</option>
                      {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={styles.formLabel}>LGA</label>
                    {formData.state && availableLGAs.length > 0 ? (
                      <select className={styles.formSelect} value={formData.lga} onChange={e => setFormData({ ...formData, lga: e.target.value })}>
                        <option value="">Select LGA</option>
                        {availableLGAs.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    ) : (
                      <input className={styles.formInput} placeholder={formData.state ? 'Enter LGA' : 'Select state first'} value={formData.lga} onChange={e => setFormData({ ...formData, lga: e.target.value })} disabled={!formData.state} />
                    )}
                  </div>
                </div>

                <div>
                  <label className={styles.formLabel}>City / Area</label>
                  <input className={styles.formInput} placeholder="e.g. Lekki Phase 1" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} required />
                </div>

                {/* Description */}
                <div>
                  <div className={styles.formDescHeader}>
                    <label className={styles.formLabel} style={{ marginBottom: 0 }}>Description</label>
                    <span className={formData.description.length > 500 ? styles.charCountWarn : styles.charCount}>
                      {formData.description.length}/1000
                    </span>
                  </div>
                  <textarea className={styles.formTextarea} maxLength={1000} rows={5} placeholder="Describe the property in detail — features, surroundings, unique selling points..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                </div>

                {/* Type-specific fields */}
                {formData.property_type === 'house' ? (
                  <div className="space-y-5">
                    <div>
                      <label className={styles.formLabel}>House Type(s)</label>
                      <div className={styles.chipGrid}>
                        {HOUSE_TYPES.map(t => (
                          <label key={t.value} className={formData.house_types.includes(t.value) ? styles.chipLabelActive : styles.chipLabel}>
                            <input type="checkbox" className={styles.chipHidden} checked={formData.house_types.includes(t.value)} onChange={e => setFormData({ ...formData, house_types: e.target.checked ? [...formData.house_types, t.value] : formData.house_types.filter(x => x !== t.value) })} />
                            <span className="text-sm font-medium">{t.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className={styles.formLabel}>Bedroom Category</label>
                        <select className={styles.formSelect} value={formData.bedroom_category} onChange={e => setFormData({ ...formData, bedroom_category: e.target.value as BedroomCategory })}>
                          <option value="">Select</option>
                          {BEDROOM_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={styles.formLabel}>Bedrooms</label>
                        <input type="number" min="0" className={styles.formInput} placeholder="e.g. 4" value={formData.bedrooms} onChange={e => setFormData({ ...formData, bedrooms: e.target.value })} />
                      </div>
                      <div>
                        <label className={styles.formLabel}>Bathrooms</label>
                        <input type="number" min="0" className={styles.formInput} placeholder="e.g. 3" value={formData.bathrooms} onChange={e => setFormData({ ...formData, bathrooms: e.target.value })} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.formGrid}>
                    <div>
                      <label className={styles.formLabel}>Land Size</label>
                      <input type="number" min="0" step="0.01" className={styles.formInput} placeholder="e.g. 500" value={formData.land_size} onChange={e => setFormData({ ...formData, land_size: e.target.value })} />
                    </div>
                    <div>
                      <label className={styles.formLabel}>Unit</label>
                      <select className={styles.formSelect} value={formData.land_size_unit} onChange={e => setFormData({ ...formData, land_size_unit: e.target.value as LandSizeUnit })}>
                        {LAND_SIZE_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label className={styles.formLabel}>Additional Features</label>
                  <input className={styles.formInput} placeholder="e.g. Swimming pool, Security, Generator (comma-separated)" value={formData.additionalFeatures} onChange={e => setFormData({ ...formData, additionalFeatures: e.target.value })} />
                </div>

                {/* Actions */}
                <div className={styles.formActionsRow}>
                  <button type="button" className={styles.cancelBtn} onClick={() => router.push('/dashboard/properties')}>
                    Cancel
                  </button>
                  <button type="button" onClick={() => { if (!formData.title || !formData.price_min || !formData.state) { setError('Please fill in title, price, and state.'); return; } setError(''); setStep(2) }}
                    className={styles.submitBtn}>
                    Continue to Media →
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.formSection}>
                <h1 className={styles.formSectionHeading}>Media Upload</h1>
                <p className={styles.formSectionDesc}>Add photos and videos to showcase your property.</p>
              </div>

              {error && <div className={styles.errorBanner}>{error}</div>}

              <form onSubmit={handleSubmit} className={styles.formFields}>
                {/* Drop zone */}
                <div>
                  <label className={styles.formLabel}>Photos & Videos <span className={styles.formLabelHint}>max 10 files, 10MB each</span></label>
                  <label className={styles.dropZone}>
                    <div className="flex flex-col items-center gap-2">
                      <svg className={styles.dropZoneIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className={styles.dropZoneText}>Click to upload or drag & drop</span>
                      <span className={styles.dropZoneSub}>JPG, PNG, MP4 up to 10MB</span>
                    </div>
                    <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>

                {/* Previews */}
                {mediaPreviews.length > 0 && (
                  <div className={styles.previewGrid}>
                    {mediaPreviews.map((preview, i) => (
                      <div key={i} className={styles.previewItem}>
                        {mediaFiles[i]?.type.startsWith('image/') ? (
                          <img src={preview} alt="" className={styles.previewMedia} />
                        ) : (
                          <video src={preview} className={styles.previewMedia} />
                        )}
                        <button type="button" onClick={() => { setMediaFiles(p => p.filter((_, idx) => idx !== i)); setMediaPreviews(p => p.filter((_, idx) => idx !== i)) }}
                          className={styles.previewRemove + ' bg-[var(--color-destructive)] text-white hover:scale-110'}>
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className={styles.formActionsRow}>
                  <button type="button" onClick={() => setStep(1)} className={styles.cancelBtn}>
                    ← Back to Details
                  </button>
                  <button type="submit" disabled={submitting} className={styles.submitBtn}>
                    {submitting ? 'Publishing…' : 'Publish Property'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Sidebar Tips */}
        <div className={styles.formSidebar}>
          <div className={styles.formSidebarSticky}>
            <div className={styles.sidebarTipCard}>
              <div className={styles.sidebarTipImage + ' bg-[var(--color-surface-2)]'}>
                <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop" alt="" className={styles.sidebarTipImg} />
              </div>
              <h3 className={styles.sidebarTipTitle}>Curator&apos;s Tip</h3>
              <ul className={styles.sidebarTipList}>
                {[
                  { icon: '✓', text: 'Detailed titles attract <strong class="text-[var(--color-text)] font-bold">40% more engagement</strong> than generic ones.' },
                  { icon: '💡', text: 'Ensure the price reflects current market values in your LGA.' },
                  { icon: '🛡', text: 'Your contact info is never shared until a buyer is verified by StrongTower Holdings.' },
                ].map(({ icon, text }) => (
                  <li key={icon} className={styles.sidebarTipItem}>
                    <span className={styles.sidebarTipAccent}>{icon}</span>
                    <span dangerouslySetInnerHTML={{ __html: text }} />
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.helpCard}>
              <div className={styles.helpIconWrap}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <div>
                <p className={styles.helpTitle}>Need assistance?</p>
                <p className={styles.helpDesc}>Chat with a Listing Agent now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
