import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BlogPostForm } from '@/components/blog/blog-post-form'

export default async function NewBlogPostPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">New Blog Post</h1>
        <p className="mt-1 text-zinc-500 text-sm">Write and publish a new article.</p>
      </div>
      <BlogPostForm />
    </div>
  )
}
