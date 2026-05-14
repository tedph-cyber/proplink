'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  postId: string
  postTitle: string
}

export function DeleteBlogPostButton({ postId, postTitle }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Delete "${postTitle}"? This cannot be undone.`)) return

    setLoading(true)
    try {
      await fetch(`/api/blog/${postId}`, { method: 'DELETE' })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs text-red-500 hover:text-red-700 transition-colors px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50"
    >
      {loading ? '…' : 'Delete'}
    </button>
  )
}
