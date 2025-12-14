'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PropertyMedia } from '@/lib/types'

interface ImageGalleryProps {
  media: PropertyMedia[]
  propertyTitle: string
}

export function ImageGallery({ media, propertyTitle }: ImageGalleryProps) {
  const images = media.filter(m => m.media_type === 'image')
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] w-full rounded-lg bg-zinc-100 flex items-center justify-center">
        <div className="text-center text-zinc-500">
          <div className="mb-2 text-4xl">📷</div>
          <p>No images available</p>
        </div>
      </div>
    )
  }

  const selectedImage = images[selectedIndex]

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-zinc-100">
        <Image
          src={selectedImage.media_url}
          alt={`${propertyTitle} - Image ${selectedIndex + 1}`}
          fill
          className="object-cover"
          priority={selectedIndex === 0}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />

        {/* Navigation Arrows (if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white hover:scale-110"
              aria-label="Previous image"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white hover:scale-110"
              aria-label="Next image"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-sm text-white">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                index === selectedIndex
                  ? 'border-zinc-900 ring-2 ring-zinc-900'
                  : 'border-zinc-200 hover:border-zinc-400'
              }`}
            >
              <Image
                src={image.media_url}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="150px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
