import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BlogPost } from '@/lib/types'
import { BlogPostForm } from '@/components/blog/blog-post-form'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (!post) notFound()

  const typedPost = post as BlogPost

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Edit Post</h1>
        <p className="mt-1 text-zinc-500 text-sm line-clamp-1">{typedPost.title}</p>
      </div>
      <BlogPostForm postId={id} initialData={typedPost} />
    </div>
  )
}
