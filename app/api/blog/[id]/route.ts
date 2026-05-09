import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function verifyAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') return null
  return user
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const user = await verifyAdmin(supabase)
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { title, slug, category, excerpt, cover_image_url, tags, status, content } = body

  // Get current post to check status transition
  const { data: current } = await supabase.from('blog_posts').select('status, published_at').eq('id', id).single()

  const updates: Record<string, unknown> = {
    title, slug, category,
    excerpt: excerpt ?? null,
    cover_image_url: cover_image_url ?? null,
    tags: tags ?? [],
    status: status ?? 'draft',
    content,
    updated_at: new Date().toISOString(),
  }

  // Set published_at on first publish
  if (status === 'published' && current?.status !== 'published') {
    updates.published_at = new Date().toISOString()
  } else if (status === 'draft') {
    updates.published_at = null
  }

  const { data, error } = await supabase.from('blog_posts').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const user = await verifyAdmin(supabase)
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
