'use client'

import { useState, useEffect, useMemo, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { PropertyType, PropertyFeatures, Property, PropertyMedia, HouseType, BedroomCategory, LandSizeUnit, ListingCategory } from '@/lib/types'
import { NIGERIAN_STATES, STATE_LGA_MAPPING_SIMPLIFIED, HOUSE_TYPES, BEDROOM_CATEGORIES, LAND_SIZE_UNITS, LISTING_CATEGORIES } from '@/lib/constants'
import styles from '@/styles/admin.module.css'

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: propertyId } = use(params)
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [property, setProperty] = useState<Property | null>(null)
  const [existingMedia, setExistingMedia] = useState<PropertyMedia[]>([])
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'house' as PropertyType,
    listing_category: '' as ListingCategory | '',
    price_min: '',
    price_max: '',
    country: 'Nigeria',
    state: '',
    lga: '',
    city: '',
    status: 'active' as 'active' | 'sold' | 'inactive',
    house_types: [] as HouseType[],
    bedroom_category: '' as BedroomCategory | '',
    bedrooms: '',
    bathrooms: '',
    land_size: '',
    land_size_unit: 'sqm' as LandSizeUnit,
    additionalFeatures: '',
  })

  // Get LGAs for selected state
  const availableLGAs = useMemo(() => {
    return formData.state ? (STATE_LGA_MAPPING_SIMPLIFIED[formData.state] || []) : []
  }, [formData.state])

  const [newMediaFiles, setNewMediaFiles] = useState<File[]>([])
  const [newMediaPreviews, setNewMediaPreviews] = useState<string[]>([])
  const [mediaToDelete, setMediaToDelete] = useState<string[]>([])

  useEffect(() => {
    loadProperty()
  }, [propertyId])

  const loadProperty = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error: fetchError } = await supabase
        .from('properties')
        .select(`
          *,
          property_media (*)
        `)
        .eq('id', propertyId)
        .eq('seller_id', user.id)
        .single()

      if (fetchError || !data) {
        setError('Property not found or you do not have permission to edit it')
        setLoading(false)
        return
      }

      const prop = data as Property & { property_media: PropertyMedia[] }
      setProperty(prop)
      setExistingMedia(prop.property_media || [])

      // Populate form
      setFormData({
        title: prop.title,
        description: prop.description,
        property_type: prop.property_type,
        listing_category: (prop.listing_category as ListingCategory | '') || '',
        price_min: prop.price_min.toString(),
        price_max: prop.price_max?.toString() || '',
        country: prop.country,
        state: prop.state,
        lga: prop.lga || '',
        city: prop.city || '',
        status: prop.status,
        house_types: prop.features?.house_types || [],
        bedroom_category: prop.features?.bedroom_category || '',
        bedrooms: prop.features?.bedrooms?.toString() || '',
        bathrooms: prop.features?.bathrooms?.toString() || '',
        land_size: prop.features?.land_size?.toString() || '',
        land_size_unit: prop.features?.land_size_unit || 'sqm',
        additionalFeatures: prop.features?.additional_features?.join(', ') || '',
      })

      setLoading(false)
    } catch (err: any) {
      setError(err.message || 'Failed to load property')
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    const totalMedia = existingMedia.length - mediaToDelete.length + newMediaFiles.length + files.length
    if (totalMedia > 10) {
      setError('Maximum 10 images/videos allowed')
      return
    }

    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      const isUnder10MB = file.size <= 10 * 1024 * 1024
      
      if (!isImage && !isVideo) {
        setError('Only images and videos are allowed')
        return false
      }
      if (!isUnder10MB) {
        setError('Files must be under 10MB')
        return false
      }
      return true
    })

    setNewMediaFiles(prev => [...prev, ...validFiles])
    
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewMediaPreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeNewMedia = (index: number) => {
    setNewMediaFiles(prev => prev.filter((_, i) => i !== index))
    setNewMediaPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const toggleDeleteExistingMedia = (mediaId: string) => {
    setMediaToDelete(prev =>
      prev.includes(mediaId)
        ? prev.filter(id => id !== mediaId)
        : [...prev, mediaId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Build features object
      const features: PropertyFeatures = {}
      
      if (formData.property_type === 'house') {
        // New categorization fields
        if (formData.house_types.length > 0) {
          features.house_types = formData.house_types
        }
        if (formData.bedroom_category) {
          features.bedroom_category = formData.bedroom_category
        }
        // Backward compatibility
        if (formData.bedrooms) features.bedrooms = parseInt(formData.bedrooms)
        if (formData.bathrooms) features.bathrooms = parseInt(formData.bathrooms)
      } else {
        if (formData.land_size) {
          features.land_size = parseFloat(formData.land_size)
          features.land_size_unit = formData.land_size_unit
        }
      }
      
      if (formData.additionalFeatures) {
        features.additional_features = formData.additionalFeatures
          .split(',')
          .map(f => f.trim())
          .filter(Boolean)
      }

      // Update property
      const { error: updateError } = await supabase
        .from('properties')
        .update({
          title: formData.title,
          description: formData.description,
          property_type: formData.property_type,
          listing_category: formData.listing_category || null,
          price_min: parseInt(formData.price_min),
          price_max: formData.price_max ? parseInt(formData.price_max) : null,
          country: 'Nigeria',
          state: formData.state,
          lga: formData.lga || null,
          city: formData.city || null,
          status: formData.status,
          features,
        })
        .eq('id', propertyId)
        .eq('seller_id', user.id)

      if (updateError) throw updateError

      // Delete marked media
      if (mediaToDelete.length > 0) {
        for (const mediaId of mediaToDelete) {
          const media = existingMedia.find(m => m.id === mediaId)
          if (media) {
            // Extract file path from URL
            const urlParts = media.media_url.split('/')
            const bucketName = media.media_type === 'image' ? 'property-images' : 'property-videos'
            const filePath = `property-media/${propertyId}/${urlParts[urlParts.length - 1]}`
            
            // Delete from storage
            await supabase.storage.from(bucketName).remove([filePath])
            
            // Delete record
            await supabase.from('property_media').delete().eq('id', mediaId)
          }
        }
      }

      // Upload new media
      if (newMediaFiles.length > 0) {
        const maxOrder = Math.max(...existingMedia.map(m => m.display_order || 0), 0)
        
        for (let i = 0; i < newMediaFiles.length; i++) {
          const file = newMediaFiles[i]
          const fileExt = file.name.split('.').pop()
          const fileName = `${propertyId}/${Date.now()}-${i}.${fileExt}`
          const filePath = `property-media/${fileName}`
          const isImage = file.type.startsWith('image/')
          const bucketName = isImage ? 'property-images' : 'property-videos'

          const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file)

          if (uploadError) throw uploadError

          const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath)

          const { error: mediaError } = await supabase
            .from('property_media')
            .insert({
              property_id: propertyId,
              media_url: publicUrl,
              media_type: isImage ? 'image' : 'video',
              display_order: maxOrder + i + 1
            })

          if (mediaError) throw mediaError
        }
      }

      router.push('/dashboard/properties')
    } catch (err: any) {
      setError(err.message || 'Failed to update property')
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className={styles.loadingCenter}><div className={styles.loadingSpinner} /></div>
  }

  if (!property) {
    return (
      <div>
        <div className={styles.errorBanner}>
          {error || 'Property not found'}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.editWrap + ' max-w-3xl'}>
      <div className={styles.formSection}>
        <h1 className={styles.formSectionHeading}>Edit Property</h1>
        <p className={styles.formSectionDesc}>Update property details</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.editSection}>
          {/* Title */}
          <div>
            <label className={styles.editLabel}>
              Property Title <span className={styles.editLabelRequired}>*</span>
            </label>
            <Input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className={styles.editLabel}>
              Description <span className={styles.editLabelRequired}>*</span>
            </label>
            <Textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
            />
          </div>

          {/* Category + Status */}
          <div className={styles.editGrid}>
            <div>
              <label className={styles.editLabel}>
                Listing Category <span className={styles.editLabelRequired}>*</span>
              </label>
              <select
                required
                value={formData.listing_category}
                onChange={(e) => {
                  const val = e.target.value as ListingCategory
                  const cat = LISTING_CATEGORIES.find(c => c.value === val)
                  setFormData({ ...formData, listing_category: val, property_type: cat ? cat.propertyType : 'house' })
                }}
                className={styles.editSelect}
              >
                <option value="">Select Category</option>
                {LISTING_CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.editLabel}>
                Status <span className={styles.editLabelRequired}>*</span>
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className={styles.editSelect}
              >
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <div className={styles.editGrid}>
            <div>
              <label className={styles.editLabel}>
                Price (₦) <span className={styles.editLabelRequired}>*</span>
              </label>
              <Input
                type="number"
                required
                value={formData.price_min}
                onChange={(e) => setFormData({ ...formData, price_min: e.target.value })}
              />
            </div>
            <div>
              <label className={styles.editLabel}>Max Price (₦)</label>
              <Input
                type="number"
                value={formData.price_max}
                onChange={(e) => setFormData({ ...formData, price_max: e.target.value })}
              />
            </div>
          </div>

          {/* Location */}
          <div className={styles.editGrid}>
            <div>
              <label className={styles.editLabel}>
                State <span className={styles.editLabelRequired}>*</span>
              </label>
              <select
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value, lga: '' })}
                className={styles.editSelect}
              >
                <option value="">Select State</option>
                {NIGERIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.editLabel}>Local Government Area</label>
              {formData.state && availableLGAs.length > 0 ? (
                <select
                  value={formData.lga}
                  onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                  className={styles.editSelect}
                >
                  <option value="">Select LGA</option>
                  {availableLGAs.map(lga => (
                    <option key={lga} value={lga}>{lga}</option>
                  ))}
                </select>
              ) : (
                <Input
                  placeholder={formData.state ? 'No LGAs available' : 'Select state first'}
                  value={formData.lga}
                  onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                  disabled={!formData.state}
                />
              )}
            </div>
          </div>

          <div>
            <label className={styles.editLabel}>
              City/Area <span className={styles.editLabelRequired}>*</span>
            </label>
            <Input
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>

          {/* Conditional Features */}
          {formData.property_type === 'house' ? (
            <div className="space-y-4">
              <div>
                <label className={styles.editLabel}>
                  House Type(s) <span className="text-[var(--color-text-muted)]">(select all that apply)</span>
                </label>
                <div className={styles.chipGrid}>
                  {HOUSE_TYPES.map(type => (
                    <label key={type.value} className={styles.editCheckboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.house_types.includes(type.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, house_types: [...formData.house_types, type.value] })
                          } else {
                            setFormData({ ...formData, house_types: formData.house_types.filter(t => t !== type.value) })
                          }
                        }}
                        className={styles.editCheckbox}
                      />
                      <span className={styles.editCheckboxText}>{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className={styles.editLabel}>Bedroom Category</label>
                <select
                  value={formData.bedroom_category}
                  onChange={(e) => setFormData({ ...formData, bedroom_category: e.target.value as BedroomCategory })}
                  className={styles.editSelect}
                >
                  <option value="">Select Bedroom Count</option>
                  {BEDROOM_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className={styles.editGrid}>
                <div>
                  <label className={styles.editLabel}>Bedrooms <span className="text-[var(--color-text-muted)]">(exact count)</span></label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  />
                </div>
                <div>
                  <label className={styles.editLabel}>Bathrooms</label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.editGrid}>
              <div>
                <label className={styles.editLabel}>Land Size</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.land_size}
                  onChange={(e) => setFormData({ ...formData, land_size: e.target.value })}
                />
              </div>
              <div>
                <label className={styles.editLabel}>Unit</label>
                <select
                  value={formData.land_size_unit}
                  onChange={(e) => setFormData({ ...formData, land_size_unit: e.target.value as LandSizeUnit })}
                  className={styles.editSelect}
                >
                  {LAND_SIZE_UNITS.map(unit => (
                    <option key={unit.value} value={unit.value}>{unit.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Additional Features */}
          <div>
            <label className={styles.editLabel}>Additional Features</label>
            <Input
              value={formData.additionalFeatures}
              onChange={(e) => setFormData({ ...formData, additionalFeatures: e.target.value })}
            />
          </div>

          {/* Existing Media */}
          {existingMedia.length > 0 && (
            <div>
              <label className={styles.editLabel}>Current Media</label>
              <div className={styles.editMediaGrid}>
                {existingMedia.map((media) => (
                  <div
                    key={media.id}
                    className={mediaToDelete.includes(media.id) ? styles.editMediaItemDimmed : styles.editMediaItem}
                  >
                    {media.media_type === 'image' ? (
                      <img src={media.media_url} alt="Property" className={styles.editMediaThumb} />
                    ) : (
                      <video src={media.media_url} className={styles.editMediaThumb} />
                    )}
                    <button
                      type="button"
                      onClick={() => toggleDeleteExistingMedia(media.id)}
                      className={mediaToDelete.includes(media.id) ? styles.editMediaToggleRestore : styles.editMediaToggleDelete}
                    >
                      {mediaToDelete.includes(media.id) ? '↺' : '✕'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Media Upload */}
          <div>
            <label className={styles.editLabel}>Add New Photos & Videos</label>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className={styles.editFileInput}
            />
            
            {newMediaPreviews.length > 0 && (
              <div className={styles.editNewMediaGrid}>
                {newMediaPreviews.map((preview, index) => (
                  <div key={index} className={styles.editNewMediaItem}>
                    {newMediaFiles[index].type.startsWith('image/') ? (
                      <img src={preview} alt={`New ${index + 1}`} className={styles.editMediaThumb} />
                    ) : (
                      <video src={preview} className={styles.editMediaThumb} />
                    )}
                    <button
                      type="button"
                      onClick={() => removeNewMedia(index)}
                      className={styles.editNewMediaRemove}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className={styles.editError + ' bg-[var(--color-destructive-muted)] text-[var(--color-destructive)]'}>
              {error}
            </div>
          )}

          {/* Submit Buttons */}
          <div className={styles.editActions}>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push('/dashboard/properties')}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
