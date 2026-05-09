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

  return (
    <div className="p-6 md:p-10 max-w-[1200px] mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)]">Edit Post</h1>
        <p className="text-[var(--color-text-muted)] mt-1">Update your blog article.</p>
      </div>
      <BlogPostForm postId={id} initialData={post as BlogPost} />
    </div>
  )
}
