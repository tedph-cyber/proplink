import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function verifyAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') return null
  return user
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const user = await verifyAdmin(supabase)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { title, slug, category, tags, excerpt, cover_image_url, status, content } = body

  // Fetch current post to check status transition
  const { data: current } = await supabase
    .from('blog_posts')
    .select('status, published_at')
    .eq('id', id)
    .single()

  if (!current) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  const wasPublished = current.status === 'published'
  const willBePublished = status === 'published'

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (title !== undefined) updates.title = title
  if (slug !== undefined) updates.slug = slug
  if (category !== undefined) updates.category = category
  if (tags !== undefined) updates.tags = tags
  if (excerpt !== undefined) updates.excerpt = excerpt || null
  if (cover_image_url !== undefined) updates.cover_image_url = cover_image_url || null
  if (status !== undefined) updates.status = status
  if (content !== undefined) updates.content = content

  // Set published_at when transitioning to published for the first time
  if (willBePublished && !wasPublished && !current.published_at) {
    updates.published_at = new Date().toISOString()
  }
  // Clear published_at if reverting to draft
  if (!willBePublished && wasPublished) {
    updates.published_at = null
  }

  const { data: post, error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(post)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const user = await verifyAdmin(supabase)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
