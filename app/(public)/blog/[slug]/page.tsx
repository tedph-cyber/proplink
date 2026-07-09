import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { BlogPost, BLOG_CATEGORIES } from '@/lib/types'
import { estimateReadTime } from '@/lib/utils'
import { ReadingProgress } from '@/components/blog/reading-progress'
import { StoryCard } from '@/components/blog/blog-card'
import styles from '@/styles/blog-post.module.css'

const CATEGORY_LABELS: Record<string, string> = {
  'market-insights': 'Market Insights',
  'buyers-guide': "Buyer's Guide",
  'sellers-tips': 'Sellers Tips',
  'investment': 'Investment',
  'legal-finance': 'Legal & Finance',
  'neighborhood': 'Neighborhood',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
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

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, slug, featured_image, category')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) return { title: 'Post Not Found' }

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      url: `https://strongtowerholdings.com.ng/blog/${slug}`,
      images: post.featured_image ? [{ url: post.featured_image, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.featured_image ? [post.featured_image] : [],
    },
  }
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
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
    .select('*')
    .eq('status', 'published')
    .eq('category', typedPost.category)
    .neq('id', typedPost.id)
    .order('published_at', { ascending: false })
    .limit(3)

  const related = (relatedPosts ?? []) as BlogPost[]

  const html = await renderMarkdown(typedPost.content)
  const readTime = estimateReadTime(typedPost.content)
  const pubDate = typedPost.published_at ?? typedPost.created_at

  const categoryLabel = BLOG_CATEGORIES.find(c => c.value === typedPost.category)?.label ?? typedPost.category

  return (
    <main className={styles.page}>
      <ReadingProgress />

      <div className={styles.wrap}>
        <Link href="/blog" className={styles.backLink}>
          ← The Foundation
        </Link>

        <header className={styles.articleHead}>
          <span className={styles.articleEyebrow}>{categoryLabel}</span>
          <h1 className={styles.articleTitle}>{typedPost.title}</h1>
          {typedPost.excerpt && (
            <p className={styles.articleStand}>{typedPost.excerpt}</p>
          )}
          <div className={styles.articleMeta}>
            {typedPost.author?.company_name && (
              <>
                <span><strong>{typedPost.author.company_name}</strong></span>
                <span className={styles.articleMetaDot} />
              </>
            )}
            <span>{formatDate(pubDate)}</span>
            <span className={styles.articleMetaDot} />
            <span>{readTime} min read</span>
          </div>
        </header>

        {typedPost.cover_image_url && (
          <div className={styles.coverWrap}>
            <img src={typedPost.cover_image_url} alt={typedPost.title} />
          </div>
        )}

        <div className={styles.articleLayout}>
          <aside className={styles.shareRail}>
            <span className={styles.shareRailLabel}>Share</span>
            <button className={styles.shareBtn} aria-label="Share">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
              </svg>
            </button>
            <button className={styles.shareBtn} aria-label="Copy link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </button>
            <button className={styles.shareBtnWa} aria-label="Share on WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </button>
          </aside>

          <article className={styles.articleBody}>
            <div dangerouslySetInnerHTML={{ __html: html }} />

            <div className={styles.tags}>
              <span className={styles.tag}>{categoryLabel}</span>
              <span className={styles.tag}>Nigeria</span>
              <span className={styles.tag}>Property</span>
              <span className={styles.tag}>StrongTower</span>
            </div>

            {typedPost.author && (
              <div className={styles.authorPlate}>
                <div className={styles.authorPlateAv} />
                <div>
                  <span className={styles.authorPlateName}>
                    {typedPost.author.company_name ?? 'StrongTower Editorial'}
                  </span>
                  <span className={styles.authorPlateRole}>Contributor to The Foundation</span>
                </div>
              </div>
            )}
          </article>

          <div />
        </div>

        {related.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedSectionTitle}>More from The Foundation</h2>
            <div className={styles.relatedGrid}>
              {related.map(r => (
                <StoryCard key={r.id} post={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
