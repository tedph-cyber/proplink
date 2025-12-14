'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface DeletePropertyButtonProps {
  propertyId: string
  propertyTitle: string
}

export function DeletePropertyButton({ propertyId, propertyTitle }: DeletePropertyButtonProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${propertyTitle}"? This action cannot be undone.`)) {
      return
    }

    setDeleting(true)

    try {
      const response = await fetch(`/api/properties/${propertyId}/delete`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to delete property')
      }

      router.refresh()
    } catch (error) {
      alert('Failed to delete property. Please try again.')
      setDeleting(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleDelete}
      disabled={deleting}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </Button>
  )
}
