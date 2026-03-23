import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { title, slug, category, tags, excerpt, cover_image_url, status, content } = body

  if (!title || !slug || !category || !content) {
    return NextResponse.json({ error: 'title, slug, category, and content are required' }, { status: 400 })
  }

  const { data: post, error } = await supabase
    .from('blog_posts')
    .insert({
      title,
      slug,
      category,
      tags: tags || [],
      excerpt: excerpt || null,
      cover_image_url: cover_image_url || null,
      status: status || 'draft',
      content,
      author_id: user.id,
      published_at: status === 'published' ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(post, { status: 201 })
}
