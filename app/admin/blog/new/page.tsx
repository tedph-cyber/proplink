import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BlogPostForm } from '@/components/blog/blog-post-form'

export default async function NewBlogPostPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  return <BlogPostForm />
}
