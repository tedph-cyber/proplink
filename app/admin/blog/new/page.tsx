import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BlogPostForm } from '@/components/blog/blog-post-form'

export default async function NewBlogPostPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  return (
    <div className="p-6 md:p-10 max-w-[1200px] mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)]">New Blog Post</h1>
        <p className="text-[var(--color-text-muted)] mt-1">Create a new article for the StrongTower Holdings blog.</p>
      </div>
      <BlogPostForm />
    </div>
  )
}
