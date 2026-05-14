'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { PropertyMedia } from '@/lib/types'

interface ImageGalleryProps {
  media: PropertyMedia[]
  propertyTitle: string
}

export function ImageGallery({ media, propertyTitle }: ImageGalleryProps) {
  const images = media.filter(m => m.media_type === 'image')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const goTo = useCallback((index: number) => {
    setSelectedIndex(((index % images.length) + images.length) % images.length)
  }, [images.length])

  const goNext = useCallback(() => goTo(selectedIndex + 1), [goTo, selectedIndex])
  const goPrev = useCallback(() => goTo(selectedIndex - 1), [goTo, selectedIndex])

  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [lightboxOpen, goNext, goPrev])

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] w-full rounded-lg bg-[var(--color-surface-2)] flex items-center justify-center">
        <div className="text-center text-[var(--color-text-muted)]">
          <div className="mb-2 text-4xl opacity-40">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm">No images available</p>
        </div>
      </div>
    )
  }

  const selectedImage = images[selectedIndex]

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-4">
        {/* Main Image (click to open lightbox) */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-[var(--color-surface-2)] group cursor-zoom-in block text-left"
        >
          <Image
            src={selectedImage.media_url}
            alt={`${propertyTitle} - Image ${selectedIndex + 1}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={selectedIndex === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />

          {/* Zoom hint */}
          <div className="absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white/80 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            View fullscreen
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goPrev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-[var(--color-surface)]/90 p-2 shadow-lg transition-all hover:bg-[var(--color-surface)] hover:scale-110 opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goNext() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-[var(--color-surface)]/90 p-2 shadow-lg transition-all hover:bg-[var(--color-surface)] hover:scale-110 opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-sm text-white">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </button>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                  index === selectedIndex
                    ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)] opacity-70 hover:opacity-100'
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

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
            aria-label="Close lightbox"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-6 left-6 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80">
            {selectedIndex + 1} / {images.length}
          </div>

          {/* Image */}
          <div
            className="relative w-full h-full max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedIndex].media_url}
              alt={`${propertyTitle} - Image ${selectedIndex + 1}`}
              fill
              className="object-contain"
              priority
              sizes="90vw"
            />
          </div>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goPrev() }}
                className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-4 text-white hover:bg-white/20 transition-colors"
                aria-label="Previous image"
              >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goNext() }}
                className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-4 text-white hover:bg-white/20 transition-colors"
                aria-label="Next image"
              >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Thumbnail strip at bottom */}
          {images.length > 1 && (
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all ${
                    index === selectedIndex
                      ? 'border-white opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <Image
                    src={image.media_url}
                    alt={`Thumbnail ${index + 1}`}
                    width={64}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
