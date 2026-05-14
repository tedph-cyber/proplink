'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AvatarUploadProps {
  userId: string
  currentAvatarUrl?: string | null
  onUploadComplete: (url: string) => void
}

export function AvatarUpload({ userId, currentAvatarUrl, onUploadComplete }: AvatarUploadProps) {
  const supabase = createClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('File must be under 2MB.')
      return
    }

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `avatars/${userId}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId)

      if (updateError) throw updateError

      onUploadComplete(publicUrl)
    } catch (err: any) {
      alert(err.message || 'Failed to upload avatar')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[var(--color-surface-2)] flex-shrink-0">
        {currentAvatarUrl ? (
          <img src={currentAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-6 h-6 text-[var(--color-text-hint)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
            <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFile}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="px-4 py-2 rounded-lg bg-[var(--color-surface-2)] text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors disabled:opacity-50"
      >
        {currentAvatarUrl ? 'Change Photo' : 'Upload Photo'}
      </button>
    </div>
  )
}
