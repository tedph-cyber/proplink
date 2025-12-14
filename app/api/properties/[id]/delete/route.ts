import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify ownership
    const { data: property } = await supabase
      .from('properties')
      .select('seller_id, property_media (*)')
      .eq('id', params.id)
      .single()

    if (!property || property.seller_id !== user.id) {
      return NextResponse.json(
        { error: 'Property not found or unauthorized' },
        { status: 404 }
      )
    }

    // Delete media files from storage
    if (property.property_media && property.property_media.length > 0) {
      for (const media of property.property_media) {
        try {
          // Extract file path from URL
          const urlParts = media.media_url.split('/')
          const bucketName = media.media_type === 'image' ? 'property-images' : 'property-videos'
          const filePath = `property-media/${params.id}/${urlParts[urlParts.length - 1]}`
          
          await supabase.storage.from(bucketName).remove([filePath])
        } catch (err) {
          console.error('Error deleting media file:', err)
        }
      }
    }

    // Delete property_media records (will cascade automatically if FK is set up)
    await supabase
      .from('property_media')
      .delete()
      .eq('property_id', params.id)

    // Delete property
    const { error: deleteError } = await supabase
      .from('properties')
      .delete()
      .eq('id', params.id)
      .eq('seller_id', user.id)

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete property' },
      { status: 500 }
    )
  }
}
