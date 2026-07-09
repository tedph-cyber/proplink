import Link from 'next/link'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { BlogPost, BLOG_CATEGORIES } from '@/lib/types'
import { estimateReadTime } from '@/lib/utils'
import { StoryCard } from '@/components/blog/blog-card'
import styles from '@/styles/blog.module.css'

export const metadata: Metadata = {
  title: 'The Foundation',
  description: 'Field notes on buying, building and owning property in Nigeria — written for people who would rather skip the agent.',
  openGraph: { title: 'The Foundation — StrongTower Journal', description: 'Field notes on buying, building and owning property in Nigeria.' },
  twitter: { card: 'summary_large_image', title: 'The Foundation — StrongTower Journal', description: 'Field notes on buying, building and owning property in Nigeria.' },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function BlogListingPage(props: { searchParams: Promise<{ category?: string }> }) {
  const searchParams = await props.searchParams
  const activeCategory = searchParams.category ?? 'all'

  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const typedPosts = (posts ?? []) as BlogPost[]

  const filtered = activeCategory === 'all'
    ? typedPosts
    : typedPosts.filter(p => p.category === activeCategory)

  const lead = filtered.find(p => (p as any).featured) || filtered[0] || null
  const rest = filtered.filter(p => p !== lead)
  const wideIndex = 3

  return (
    <main className={styles.journal}>
      <header className={styles.masthead}>
        <div className={styles.mastheadRule} />
        <div className={styles.mastheadTop}>
          <span className={styles.mastheadKicker}>StrongTower Journal · Est. 2024</span>
          <span className={styles.mastheadIssue}>
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} · {filtered.length} {filtered.length === 1 ? 'dispatch' : 'dispatches'}
          </span>
        </div>
        <h1 className={styles.mastheadTitle}>The Foundation</h1>
        <p className={styles.mastheadStand}>
          Field notes on buying, building and owning property in Nigeria — written for people who would rather skip the agent.
        </p>
      </header>

      <div className={styles.rail}>
        <div className={styles.railInner}>
          <Link
            href="/blog"
            className={`${styles.chip} ${activeCategory === 'all' ? styles.chipActive : ''}`}
          >
            All
          </Link>
          {BLOG_CATEGORIES.map(c => (
            <Link
              key={c.value}
              href={`/blog?category=${c.value}`}
              className={`${styles.chip} ${activeCategory === c.value ? styles.chipActive : ''}`}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.wrap}>
        {lead && (
          <Link href={`/blog/${lead.slug}`} className={styles.leadStory}>
            <div className={styles.leadMedia}>
              {lead.cover_image_url ? (
                <img src={lead.cover_image_url} alt={lead.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'var(--color-surface-2)', position: 'absolute', inset: 0 }} />
              )}
              <span className={styles.leadBadge}>Featured</span>
            </div>
            <div className={styles.leadBody}>
              <span className={styles.leadEyebrow}>
                {BLOG_CATEGORIES.find(c => c.value === lead.category)?.label ?? lead.category}
              </span>
              <h2 className={styles.leadTitle}>{lead.title}</h2>
              {lead.excerpt && <p className={styles.leadExcerpt}>{lead.excerpt}</p>}
              <div className={styles.leadMeta}>
                <span>{lead.published_at ? formatDate(lead.published_at) : formatDate(lead.created_at)}</span>
                <span className={styles.leadDot} />
                <span>{estimateReadTime(lead.content)} min read</span>
              </div>
              <span className={styles.leadLink}>Read the story →</span>
            </div>
          </Link>
        )}

        {rest.length > 0 && (
          <div className={styles.grid}>
            {rest.map((p, i) => {
              if (i === wideIndex && rest.length > wideIndex + 1) {
                return (
                  <Link key={p.id} href={`/blog/${p.slug}`} className={styles.wideStory}>
                    <div className={styles.wideMedia}>
                      {p.cover_image_url ? (
                        <img src={p.cover_image_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: 'var(--color-surface-2)', position: 'absolute', inset: 0 }} />
                      )}
                    </div>
                    <div className={styles.wideBody}>
                      <span className={styles.storyEyebrow}>
                        {BLOG_CATEGORIES.find(c => c.value === p.category)?.label ?? p.category}
                      </span>
                      <h3 className={styles.storyTitle}>{p.title}</h3>
                      {p.excerpt && <p className={styles.storyExcerpt}>{p.excerpt}</p>}
                      <div className={styles.storyFoot}>
                        <span>{p.published_at ? formatDate(p.published_at) : formatDate(p.created_at)}</span>
                        <span>·</span>
                        <span>{estimateReadTime(p.content)} min read</span>
                      </div>
                    </div>
                  </Link>
                )
              }
              if (i !== wideIndex) {
                return <StoryCard key={p.id} post={p} />
              }
              return null
            })}
          </div>
        )}

        {filtered.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyMark}>✦</div>
            <h2 className={styles.emptyTitle}>No dispatches yet</h2>
            <p className={styles.emptyText}>
              We haven&apos;t published anything in this category yet. Check back soon.
            </p>
            <Link href="/blog" className={styles.emptyCta}>View all stories</Link>
          </div>
        )}

        <section className={styles.newsletter}>
          <div className={styles.newsletterInner}>
            <p className={styles.newsletterEyebrow}>Stay informed</p>
            <h3 className={styles.newsletterTitle}>The market report, once a month.</h3>
            <p className={styles.newsletterText}>
              Join 5,000+ buyers, sellers and investors getting our monthly read on the Nigerian property market — plus the legal breakdowns we wish we&apos;d had earlier.
            </p>
            <form className={styles.newsletterForm}>
              <input className={styles.newsletterInput} type="email" placeholder="Your email address" />
              <button className={styles.newsletterBtn} type="submit">Subscribe</button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}
