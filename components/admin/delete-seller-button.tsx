'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface DeleteSellerButtonProps {
  sellerId: string
  sellerName: string
}

export function DeleteSellerButton({ sellerId, sellerName }: DeleteSellerButtonProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Delete user "${sellerName || 'this seller'}"? This will permanently remove all their properties and data. This action cannot be undone.`)) {
      return
    }

    setDeleting(true)

    try {
      const response = await fetch(`/api/admin/sellers/${sellerId}/delete`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete seller')
      }

      router.push('/admin/sellers')
    } catch (error) {
      alert('Failed to delete seller. Please try again.')
      setDeleting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-lg text-sm font-bold transition-opacity disabled:opacity-50 border border-red-500/30 text-red-400 hover:bg-red-500/10"
    >
      {deleting ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )}
      {deleting ? 'Deleting...' : 'Delete User'}
    </button>
  )
}
