'use client'

import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, X, Grid3X3 } from 'lucide-react'
import { PropertyMedia } from '@/lib/types'

interface PropertyGalleryProps {
  media: PropertyMedia[]
  title: string
}

export function PropertyGallery({ media, title }: PropertyGalleryProps) {
  const images = media.filter((m) => m.media_type === 'image')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const mainImage = images[0]
  const sideImages = images.slice(1, 4)

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  }, [images.length])

  if (images.length === 0) {
    return (
      <div style={{
        aspectRatio: '16/8',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-surface-2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-hint)',
        marginBottom: 32,
      }}>
        No images available
      </div>
    )
  }

  return (
    <>
      <div className="gallery-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: 8,
        aspectRatio: '16/8',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        marginBottom: 32,
      }}>
        {/* Main image */}
        <div
          className="gallery-main"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
          onClick={() => openLightbox(0)}
        >
          <img
            src={mainImage.media_url}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.8s var(--ease-base)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
          />
        </div>

        {/* Side images */}
        {[0, 1, 2].map((i) => {
          const img = sideImages[i]
          if (!img) {
            return (
              <div key={`empty-${i}`} style={{
                position: 'relative',
                overflow: 'hidden',
                background: 'var(--color-surface-2)',
                borderRadius: 0,
              }} />
            )
          }
          const isLast = i === 2 && images.length > 4
          return (
            <div
              key={img.id}
              style={{
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onClick={() => openLightbox(i + 1)}
            >
              <img
                src={img.media_url}
                alt={`${title} ${i + 2}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.8s var(--ease-base)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
              />
              {isLast && (
                <button
                  style={{
                    position: 'absolute',
                    right: 14,
                    bottom: 14,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    background: 'var(--color-surface)',
                    color: 'var(--color-text)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '9px 15px',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    boxShadow: 'var(--shadow-modal)',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    openLightbox(0)
                  }}
                >
                  <Grid3X3 size={16} />
                  Show all photos
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={closeLightbox}
        >
          <button
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              zIndex: 10,
            }}
            onClick={closeLightbox}
          >
            <X size={22} />
          </button>

          <button
            style={{
              position: 'absolute',
              left: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              zIndex: 10,
            }}
            onClick={(e) => { e.stopPropagation(); prev() }}
          >
            <ChevronLeft size={22} />
          </button>

          <img
            src={images[lightboxIndex]?.media_url}
            alt={`${title} ${lightboxIndex + 1}`}
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: 8,
            }}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            style={{
              position: 'absolute',
              right: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              zIndex: 10,
            }}
            onClick={(e) => { e.stopPropagation(); next() }}
          >
            <ChevronRight size={22} />
          </button>

          <div
            style={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-body)',
            }}
          >
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
