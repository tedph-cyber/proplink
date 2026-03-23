import { createClient } from '@/lib/supabase/server'
import { BlogPost } from '@/lib/types'
import { BlogGrid } from '@/components/blog/blog-grid'

export const metadata = {
  title: 'Blog – PropLink',
  description: 'Real estate insights, tips, and market trends for the Nigerian property market.',
}

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const typedPosts = (posts || []) as BlogPost[]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="mb-10 max-w-2xl">
        <h1 className="text-4xl font-bold text-zinc-900 mb-3 leading-tight">
          PropLink Blog
        </h1>
        <p className="text-lg text-zinc-500">
          Real estate insights, market trends, and expert guides for buyers, sellers, and investors in Nigeria.
        </p>
      </div>

      {typedPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 h-16 w-16 rounded-full bg-zinc-100 flex items-center justify-center">
            <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-zinc-800 mb-2">No posts yet</h2>
          <p className="text-zinc-500 text-sm">Check back soon — we're working on something great.</p>
        </div>
      ) : (
        <BlogGrid posts={typedPosts} />
      )}
    </div>
  )
}
