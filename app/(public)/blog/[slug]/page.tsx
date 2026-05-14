import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BlogPost } from '@/lib/types'
import styles from '@/styles/blog-post.module.css'

const CATEGORY_LABELS: Record<string, string> = {
  'market-insights': 'Market Insights',
  'buyers-guide': "Buyer's Guide",
  'sellers-tips': 'Sellers Tips',
  'investment': 'Investment',
  'legal-finance': 'Legal & Finance',
  'neighborhood': 'Neighborhood',
}

function readTime(content: string) {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

async function renderMarkdown(content: string) {
  try {
    const { marked } = await import('marked')
    const html = await marked(content)
    return html as string
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
    <main className={styles.page}>
      <div className="container-base">

        {/* ─── Breadcrumb ───────────────────────── */}
        <nav className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <span>/</span>
          <Link href="/blog" className={styles.breadcrumbLink}>Blog</Link>
          <span>/</span>
          <span className={styles.breadcrumbCurrent}>{typedPost.title}</span>
        </nav>

        {/* ─── Layout ───────────────────────────── */}
        <div className={styles.layout}>

          {/* ─── Article ─────────────────────────── */}
          <article className={styles.article}>

            {typedPost.cover_image_url && (
              <div className={styles.coverWrap}>
                <img src={typedPost.cover_image_url} alt={typedPost.title} className={styles.coverImage} />
                <div className={styles.coverOverlay} />
                <span className={styles.coverBadge}>
                  {CATEGORY_LABELS[typedPost.category] ?? typedPost.category}
                </span>
              </div>
            )}

            {/* Meta */}
            <div className={styles.meta}>
              {!typedPost.cover_image_url && (
                <span className={styles.metaCategory}>
                  {CATEGORY_LABELS[typedPost.category] ?? typedPost.category}
                </span>
              )}
              <span>{new Date(pubDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span className={styles.metaDot} />
              <span>{minutes} min read</span>
            </div>

            <h1 className={styles.title}>{typedPost.title}</h1>

            {typedPost.excerpt && (
              <p className={styles.excerpt}>{typedPost.excerpt}</p>
            )}

            {/* Content */}
            <div
              className={styles.prose}
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {/* Tags */}
            {typedPost.tags && typedPost.tags.length > 0 && (
              <div className={styles.tags}>
                {typedPost.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>#{tag}</span>
                ))}
              </div>
            )}

          </article>

          {/* ─── Sidebar ─────────────────────────── */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarCta}>
              <div className={styles.sidebarCtaBg} />
              <div className={styles.sidebarCtaContent}>
                <h4 className={styles.sidebarCtaTitle}>Browse Properties</h4>
                <p className={styles.sidebarCtaText}>
                  Find your next investment on Nigeria&apos;s most trusted property platform.
                </p>
                <Link href="/properties" className={styles.sidebarCtaBtn}>
                  Browse Listings &rarr;
                </Link>
              </div>
            </div>

            {relatedPosts && relatedPosts.length > 0 && (
              <div className={styles.sidebarRelated}>
                <h4 className={styles.sidebarRelatedTitle}>Related Posts</h4>
                <div className={styles.sidebarRelatedList}>
                  {(relatedPosts as BlogPost[]).map((p) => (
                    <Link key={p.id} href={`/blog/${p.slug}`} className={styles.sidebarRelatedItem}>
                      <div className={styles.sidebarRelatedImg}>
                        {p.cover_image_url ? (
                          <img src={p.cover_image_url} alt={p.title} />
                        ) : (
                          <div className={styles.sidebarRelatedImgPlaceholder} />
                        )}
                      </div>
                      <div>
                        <h5 className={styles.sidebarRelatedPostTitle}>{p.title}</h5>
                        <p className={styles.sidebarRelatedDate}>
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

        {/* ─── Related Posts Section ────────────── */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedSectionTitle}>
              More in {CATEGORY_LABELS[typedPost.category] ?? typedPost.category}
            </h2>
            <div className={styles.relatedGrid}>
              {(relatedPosts as BlogPost[]).map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className={styles.relatedCard}>
                  <div className={styles.relatedCardImage}>
                    {p.cover_image_url ? (
                      <img src={p.cover_image_url} alt={p.title} />
                    ) : (
                      <div className={styles.relatedCardImagePlaceholder} />
                    )}
                  </div>
                  <div className={styles.relatedCardBody}>
                    <span className={styles.relatedCardCategory}>
                      {CATEGORY_LABELS[p.category] ?? p.category}
                    </span>
                    <h3 className={styles.relatedCardTitle}>{p.title}</h3>
                    {p.excerpt && (
                      <p className={styles.relatedCardExcerpt}>{p.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ─── CTA Strip ────────────────────────── */}
        <section className={styles.ctaStrip}>
          <div className={styles.ctaStripInner}>
            <div>
              <h2 className={styles.ctaStripTitle}>Ready to find your property?</h2>
              <p className={styles.ctaStripText}>Browse listings across Nigeria on StrongTower Holdings.</p>
            </div>
            <Link href="/properties" className={styles.ctaStripBtn}>
              Browse Listings &rarr;
            </Link>
          </div>
        </section>

      </div>
    </main>
  )
}
