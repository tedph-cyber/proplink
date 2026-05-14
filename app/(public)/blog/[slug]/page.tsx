import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BlogPost } from '@/lib/types'

const CATEGORY_LABELS: Record<string, string> = {
  'market-insights': 'Market Insights',
  'buyers-guide': "Buyer's Guide",
  'sellers-tips': 'Sellers Tips',
  'investment': 'Investment',
  'legal-finance': 'Legal & Finance',
  'neighborhood': 'Neighborhood',
}

const CATEGORY_COLORS: Record<string, string> = {
  'market-insights': 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]',
  'buyers-guide': 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]',
  'sellers-tips': 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]',
  'investment': 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]',
  'legal-finance': 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]',
  'neighborhood': 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]',
}

function readTime(content: string) {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

async function renderMarkdown(content: string) {
  try {
    const { marked } = await import('marked')
    return marked(content) as string
  } catch {
    return `<p>${content.replace(/\n/g, '</p><p>')}</p>`
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*, author:profiles(id, company_name)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) notFound()

  const typedPost = post as BlogPost

  // Related posts
  const { data: relatedPosts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image_url, category, published_at, created_at')
    .eq('status', 'published')
    .eq('category', typedPost.category)
    .neq('id', typedPost.id)
    .order('published_at', { ascending: false })
    .limit(3)

  const html = await renderMarkdown(typedPost.content)
  const minutes = readTime(typedPost.content)
  const pubDate = typedPost.published_at ?? typedPost.created_at

  return (
    <main className="px-6 lg:px-10 py-16 lg:py-20 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-8">
        <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-[var(--color-accent)] transition-colors">Blog</Link>
        <span>/</span>
        <span className="text-[var(--color-text)] font-medium truncate max-w-[200px]">{typedPost.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Article */}
        <article className="flex-1 min-w-0">
          {/* Cover */}
          {typedPost.cover_image_url && (
            <div className="relative rounded-[2rem] overflow-hidden aspect-[16/8] mb-10">
              <img
                src={typedPost.cover_image_url}
                alt={typedPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${CATEGORY_COLORS[typedPost.category] ?? 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]'}`}>
                  {CATEGORY_LABELS[typedPost.category] ?? typedPost.category}
                </span>
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 flex-wrap mb-6 text-sm text-[var(--color-text-muted)]">
            {!typedPost.cover_image_url && (
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${CATEGORY_COLORS[typedPost.category] ?? 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]'}`}>
                {CATEGORY_LABELS[typedPost.category] ?? typedPost.category}
              </span>
            )}
            <span>
              {new Date(pubDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
            <span>{minutes} min read</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] text-[var(--color-text)] mb-8">
            {typedPost.title}
          </h1>

          {typedPost.excerpt && (
            <p className="text-xl text-[var(--color-text-muted)] leading-relaxed mb-10 pb-10 border-b border-[var(--color-border)]/20">
              {typedPost.excerpt}
            </p>
          )}

          {/* Content */}
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* Tags */}
          {typedPost.tags && typedPost.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-10 border-t border-[var(--color-border)]/20">
              {typedPost.tags.map((tag) => (
                <span key={tag} className="px-4 py-1.5 rounded-full bg-[var(--color-surface-2)] text-sm font-medium text-[var(--color-text-muted)]">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="lg:w-72 shrink-0 space-y-8">
          {/* CTA Card */}
          <div className="bg-[var(--color-accent)] p-8 rounded-[2rem] text-white shadow-xl shadow-[var(--color-accent)]/20 sticky top-28">
            <h4 className="text-xl font-extrabold mb-3">Browse Properties</h4>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              Find your next investment property on Nigeria&apos;s most trusted platform.
            </p>
            <Link
              href="/properties"
              className="block w-full bg-[var(--color-surface)] text-[var(--color-accent)] font-extrabold py-3 rounded-xl text-center transition-all hover:scale-105 active:scale-95"
            >
              Browse Listings →
            </Link>
          </div>

          {/* Related posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="border border-[var(--color-border)]/15 p-8 rounded-[2rem]">
              <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-6">
                Related Posts
              </h4>
              <div className="space-y-6">
                {(relatedPosts as BlogPost[]).map((p) => (
                  <Link key={p.id} href={`/blog/${p.slug}`} className="flex gap-3 group">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[var(--color-surface-2)] shrink-0">
                      {p.cover_image_url ? (
                        <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface)]" />
                      )}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold leading-snug group-hover:text-[var(--color-accent)] transition-colors">
                        {p.title}
                      </h5>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                        {p.published_at
                          ? new Date(p.published_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
                          : new Date(p.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
                        }
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Related posts section (bottom) */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="mt-20 pt-16 border-t border-[var(--color-border)]/20">
          <h2 className="text-2xl font-extrabold tracking-tight mb-8">More in {CATEGORY_LABELS[typedPost.category] ?? typedPost.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(relatedPosts as BlogPost[]).map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="flex flex-col bg-[var(--color-surface)] rounded-2xl overflow-hidden group">
                <div className="aspect-[16/10] overflow-hidden">
                  {p.cover_image_url ? (
                    <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface)]" />
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className={`font-bold text-xs uppercase tracking-widest mb-2 ${CATEGORY_COLORS[p.category] ?? 'text-[var(--color-accent)]'}`}>
                    {CATEGORY_LABELS[p.category] ?? p.category}
                  </span>
                  <h3 className="text-lg font-bold tracking-tight group-hover:text-[var(--color-accent)] transition-colors">{p.title}</h3>
                  {p.excerpt && <p className="text-sm text-[var(--color-text-muted)] mt-2 line-clamp-2">{p.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Property CTA Strip */}
      <section className="mt-16 bg-[var(--color-text)] rounded-[2rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-text)] to-[var(--color-text)]/80" />
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Ready to find your property?</h2>
          <p className="text-white/60">Browse listings across Nigeria on StrongTower Holdings.</p>
        </div>
        <Link href="/properties" className="relative z-10 bg-[var(--color-accent)] px-8 py-4 rounded-full text-white font-bold text-sm whitespace-nowrap shadow-lg">
          Browse Listings →
        </Link>
      </section>
    </main>
  )
}
