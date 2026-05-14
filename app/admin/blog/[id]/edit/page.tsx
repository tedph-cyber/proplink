import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BlogPostForm } from '@/components/blog/blog-post-form'
import { BlogPost } from '@/lib/types'

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const { data: post } = await supabase.from('blog_posts').select('*').eq('id', id).single()
  if (!post) notFound()

  return <BlogPostForm postId={id} initialData={post as BlogPost} />
}
