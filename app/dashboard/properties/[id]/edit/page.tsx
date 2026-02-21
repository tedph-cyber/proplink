'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { PropertyType, PropertyFeatures, Property, PropertyMedia, HouseType, BedroomCategory, LandSizeUnit } from '@/lib/types'
import { NIGERIAN_STATES, STATE_LGA_MAPPING_SIMPLIFIED, HOUSE_TYPES, BEDROOM_CATEGORIES, LAND_SIZE_UNITS } from '@/lib/constants'

interface EditPropertyPageProps {
  params: {
    id: string
  }
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
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
  }, [params.id])

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
        .eq('id', params.id)
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
          price_min: parseInt(formData.price_min),
          price_max: formData.price_max ? parseInt(formData.price_max) : null,
          state: formData.state,
          lga: formData.lga || null,
          city: formData.city || null,
          status: formData.status,
          features,
        })
        .eq('id', params.id)
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
            const filePath = `property-media/${params.id}/${urlParts[urlParts.length - 1]}`
            
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
          const fileName = `${params.id}/${Date.now()}-${i}.${fileExt}`
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
              property_id: params.id,
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
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900"></div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          {error || 'Property not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Edit Property</h1>
        <p className="mt-2 text-zinc-600">Update property details</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="space-y-6 rounded-lg border border-zinc-200 bg-white p-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Property Title <span className="text-red-500">*</span>
            </label>
            <Input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
            />
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Property Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.property_type}
              onChange={(e) => setFormData({ ...formData, property_type: e.target.value as PropertyType })}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            >
              <option value="house">House</option>
              <option value="land">Land</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            >
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Price (₦) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                required
                value={formData.price_min}
                onChange={(e) => setFormData({ ...formData, price_min: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Max Price (₦)
              </label>
              <Input
                type="number"
                value={formData.price_max}
                onChange={(e) => setFormData({ ...formData, price_max: e.target.value })}
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value, lga: '' })}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              >
                <option value="">Select State</option>
                {NIGERIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Local Government Area
              </label>
              {formData.state && availableLGAs.length > 0 ? (
                <select
                  value={formData.lga}
                  onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
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
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              City/Area <span className="text-red-500">*</span>
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
              {/* House Types */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  House Type(s) <span className="text-zinc-500">(select all that apply)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {HOUSE_TYPES.map(type => (
                    <label key={type.value} className="flex items-center cursor-pointer">
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
                        className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                      />
                      <span className="ml-2 text-sm text-zinc-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bedroom Category */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Bedroom Category
                </label>
                <select
                  value={formData.bedroom_category}
                  onChange={(e) => setFormData({ ...formData, bedroom_category: e.target.value as BedroomCategory })}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                >
                  <option value="">Select Bedroom Count</option>
                  {BEDROOM_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Legacy fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Bedrooms <span className="text-zinc-500">(exact count)</span>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Bathrooms
                  </label>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Land Size
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.land_size}
                  onChange={(e) => setFormData({ ...formData, land_size: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Unit
                </label>
                <select
                  value={formData.land_size_unit}
                  onChange={(e) => setFormData({ ...formData, land_size_unit: e.target.value as LandSizeUnit })}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
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
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Additional Features
            </label>
            <Input
              value={formData.additionalFeatures}
              onChange={(e) => setFormData({ ...formData, additionalFeatures: e.target.value })}
            />
          </div>

          {/* Existing Media */}
          {existingMedia.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Current Media
              </label>
              <div className="grid grid-cols-3 gap-4">
                {existingMedia.map((media) => (
                  <div
                    key={media.id}
                    className={`relative ${
                      mediaToDelete.includes(media.id) ? 'opacity-50' : ''
                    }`}
                  >
                    {media.media_type === 'image' ? (
                      <img
                        src={media.media_url}
                        alt="Property"
                        className="h-32 w-full rounded-lg object-cover"
                      />
                    ) : (
                      <video
                        src={media.media_url}
                        className="h-32 w-full rounded-lg object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => toggleDeleteExistingMedia(media.id)}
                      className={`absolute -right-2 -top-2 rounded-full px-2 py-1 text-xs text-white ${
                        mediaToDelete.includes(media.id)
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-red-500 hover:bg-red-600'
                      }`}
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
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Add New Photos & Videos
            </label>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
            
            {newMediaPreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {newMediaPreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    {newMediaFiles[index].type.startsWith('image/') ? (
                      <img
                        src={preview}
                        alt={`New ${index + 1}`}
                        className="h-32 w-full rounded-lg object-cover"
                      />
                    ) : (
                      <video
                        src={preview}
                        className="h-32 w-full rounded-lg object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeNewMedia(index)}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
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
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
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
