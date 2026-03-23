import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BlogPost, BLOG_CATEGORIES } from '@/lib/types'
import { estimateReadTime } from '@/lib/utils'
import { BlogContent } from '@/components/blog/blog-content'
import { BlogCard } from '@/components/blog/blog-card'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) return { title: 'Post Not Found – PropLink' }

  return {
    title: `${post.title} – PropLink Blog`,
    description: post.excerpt || undefined,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) notFound()

  const typedPost = post as BlogPost
  const category = BLOG_CATEGORIES.find(c => c.value === typedPost.category)
  const readTime = estimateReadTime(typedPost.content)
  const date = typedPost.published_at
    ? new Date(typedPost.published_at).toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  // Related posts (same category, exclude current)
  const { data: relatedRaw } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .eq('category', typedPost.category)
    .neq('id', typedPost.id)
    .order('published_at', { ascending: false })
    .limit(3)

  const relatedPosts = (relatedRaw || []) as BlogPost[]

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-zinc-500 mb-8">
        <Link href="/" className="hover:text-zinc-800 transition-colors">Home</Link>
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link href="/blog" className="hover:text-zinc-800 transition-colors">Blog</Link>
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-zinc-800 font-medium line-clamp-1">{typedPost.title}</span>
      </nav>

      {/* Cover image */}
      {typedPost.cover_image_url && (
        <div className="relative rounded-2xl overflow-hidden aspect-[16/7] bg-zinc-100 mb-8">
          <img
            src={typedPost.cover_image_url}
            alt={typedPost.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {category && (
            <span className="absolute bottom-4 left-4 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-zinc-800">
              {category.label}
            </span>
          )}
        </div>
      )}

      {/* Post header */}
      <header className="mb-8">
        {!typedPost.cover_image_url && category && (
          <span className="inline-block rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold mb-4">
            {category.label}
          </span>
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 leading-tight mb-4">
          {typedPost.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
          {date && <span>{date}</span>}
          <span>&middot;</span>
          <span>{readTime} min read</span>
          {typedPost.tags && typedPost.tags.length > 0 && (
            <>
              <span>&middot;</span>
              <div className="flex flex-wrap gap-1">
                {typedPost.tags.map(tag => (
                  <span key={tag} className="bg-zinc-100 rounded-full px-2 py-0.5 text-xs text-zinc-600">
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Article content */}
      <article className="mb-12">
        <BlogContent content={typedPost.content} />
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-zinc-200 pt-10 mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-6">Related Posts</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map(related => (
              <BlogCard key={related.id} post={related} />
            ))}
          </div>
        </section>
      )}

      {/* Property CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0568fd]/8 to-[#c379df]/8 border border-[#0568fd]/15 p-8 text-center">
        <h3 className="text-xl font-bold text-zinc-900 mb-2">
          Ready to find your property?
        </h3>
        <p className="text-zinc-600 mb-5 text-sm">
          Browse thousands of houses and land listings across Nigeria.
        </p>
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 rounded-full bg-[#0568fd] text-white px-6 py-2.5 text-sm font-semibold hover:bg-[#0568fd]/90 transition-colors"
        >
          Browse Listings
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
