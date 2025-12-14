'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { PropertyType, PropertyFeatures } from '@/lib/types'

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara'
]

export default function NewPropertyPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  
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
    // Features for houses
    bedrooms: '',
    bathrooms: '',
    // Features for land
    land_size: '',
    land_size_unit: 'sqm' as 'sqm' | 'sqft' | 'acres' | 'hectares',
    // Additional features
    additionalFeatures: '',
  })

  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Limit to 10 files
    if (files.length + mediaFiles.length > 10) {
      setError('Maximum 10 images/videos allowed')
      return
    }

    // Validate file types and sizes
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

    setMediaFiles(prev => [...prev, ...validFiles])
    
    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setMediaPreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index))
    setMediaPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Build features object
      const features: PropertyFeatures = {}
      
      if (formData.property_type === 'house') {
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

      // Insert property
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert({
          seller_id: user.id,
          title: formData.title,
          description: formData.description,
          property_type: formData.property_type,
          price_min: parseInt(formData.price_min),
          price_max: formData.price_max ? parseInt(formData.price_max) : null,
          country: formData.country,
          state: formData.state,
          lga: formData.lga || null,
          city: formData.city || null,
          features,
          status: 'active'
        })
        .select()
        .single()

      if (propertyError) throw propertyError

      // Upload media files
      if (mediaFiles.length > 0) {
        for (let i = 0; i < mediaFiles.length; i++) {
          const file = mediaFiles[i]
          const fileExt = file.name.split('.').pop()
          const fileName = `${property.id}/${Date.now()}-${i}.${fileExt}`
          const filePath = `property-media/${fileName}`

          // Upload to Supabase Storage
          const isImage = file.type.startsWith('image/')
          const bucketName = isImage ? 'property-images' : 'property-videos'
          const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file)

          if (uploadError) throw uploadError

          // Get public URL
          const { data: { publicUrl } } = await supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath)

          // Insert media record
          const { error: mediaError } = await supabase
            .from('property_media')
            .insert({
              property_id: property.id,
              media_url: publicUrl,
              media_type: isImage ? 'image' : 'video',
              display_order: i
            })

          if (mediaError) throw mediaError
        }
      }

      // Redirect to properties list
      router.push('/dashboard/properties')
    } catch (err: any) {
      setError(err.message || 'Failed to create property')
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Add New Property</h1>
        <p className="mt-2 text-zinc-600">List a property for sale</p>
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
              placeholder="e.g., 4 Bedroom Duplex in Lekki"
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
              placeholder="Describe the property features, location, and any other relevant details..."
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

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Price (₦) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                required
                placeholder="e.g., 50000000"
                value={formData.price_min}
                onChange={(e) => setFormData({ ...formData, price_min: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Max Price (₦) <span className="text-zinc-500">(optional)</span>
              </label>
              <Input
                type="number"
                placeholder="For price ranges"
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
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
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
                LGA
              </label>
              <Input
                placeholder="e.g., Eti-Osa"
                value={formData.lga}
                onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              City/Area <span className="text-red-500">*</span>
            </label>
            <Input
              required
              placeholder="e.g., Lekki Phase 1"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>

          {/* Conditional Features */}
          {formData.property_type === 'house' ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Bedrooms
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g., 4"
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
                  placeholder="e.g., 3"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                />
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
                  placeholder="e.g., 500"
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
                  onChange={(e) => setFormData({ ...formData, land_size_unit: e.target.value as any })}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                >
                  <option value="sqm">Square Meters</option>
                  <option value="sqft">Square Feet</option>
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
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
              placeholder="e.g., Swimming pool, Security, Generator (comma-separated)"
              value={formData.additionalFeatures}
              onChange={(e) => setFormData({ ...formData, additionalFeatures: e.target.value })}
            />
            <p className="mt-1 text-xs text-zinc-500">Separate features with commas</p>
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Photos & Videos <span className="text-zinc-500">(Max 10 files, 10MB each)</span>
            </label>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
            
            {/* Media Previews */}
            {mediaPreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {mediaPreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    {mediaFiles[index].type.startsWith('image/') ? (
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
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
                      onClick={() => removeMedia(index)}
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
              {submitting ? 'Publishing...' : 'Publish Property'}
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
