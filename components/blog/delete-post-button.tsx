'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('Delete this post? This cannot be undone.')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/blog/${postId}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      } else {
        const d = await res.json().catch(() => ({}))
        alert(d.error ?? 'Failed to delete post')
      }
    } catch {
      alert('Network error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="p-2.5 rounded-xl hover:bg-red-50 text-[var(--color-text-muted)] hover:text-red-600 transition-all disabled:opacity-40"
      title="Delete"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  )
}
