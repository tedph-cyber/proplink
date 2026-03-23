'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BlogPostStatus } from '@/lib/types'

interface Props {
  postId: string
  currentStatus: BlogPostStatus
}

export function PublishToggleButton({ postId, currentStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const isPublished = currentStatus === 'published'

  const handleToggle = async () => {
    setLoading(true)
    try {
      await fetch(`/api/blog/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: isPublished ? 'draft' : 'published' }),
      })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`text-xs transition-colors px-2 py-1 rounded disabled:opacity-50 ${
        isPublished
          ? 'text-orange-600 hover:text-orange-800 hover:bg-orange-50'
          : 'text-green-600 hover:text-green-800 hover:bg-green-50'
      }`}
    >
      {loading ? '…' : isPublished ? 'Unpublish' : 'Publish'}
    </button>
  )
}
