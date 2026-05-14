 import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BlogPost } from '@/lib/types'
import styles from '@/styles/blog.module.css'

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

const TOPICS = [
  { label: 'Land Titles', href: '/blog?category=legal-finance' },
  { label: 'First-time Buyers', href: '/blog?category=buyers-guide' },
  { label: 'Investment Guides', href: '/blog?category=investment' },
  { label: 'Lagos Market', href: '/blog?category=neighborhood' },
  { label: 'Construction Tips', href: '/blog?category=sellers-tips' },
]

function SearchIcon() {
  return (
    <svg className={styles.sidebarSearchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg className={styles.gridCardLinkArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg className={styles.newsletterIcon} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  )
}

function EmptyIcon() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  )
}

export default async function BlogListingPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*, author:profiles(id, company_name)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const typedPosts = (posts ?? []) as BlogPost[]
  const [featured, ...rest] = typedPosts
  const gridPosts = rest.slice(0, 2)
  const widePosts = rest.slice(2, 3)

  return (
    <main className="container-base py-16 lg:py-20">
      {/* ── Content ────────────────────────────── */}
      <div className={styles.layout}>
        {/* Main */}
        <div className={styles.mainContent}>
          {/* Hero */}
          <section className={styles.hero}>
            <div className={styles.heroGlow} />
            <div className={styles.heroInner}>
              <span className={styles.heroBadge}>Insight &amp; Analysis</span>
              <h1 className={styles.heroTitle}>
                StrongTower Holdings Blog: Your Guide to the Nigerian Property Market
              </h1>
              <p className={styles.heroSubtitle}>
                Expert insights, legal tips, and neighborhood guides to help you buy with confidence.
              </p>
            </div>
          </section>

          {typedPosts.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <EmptyIcon />
              </div>
              <h2 className={styles.emptyTitle}>No Insights Yet</h2>
              <p className={styles.emptyText}>
                We&apos;re crafting in-depth guides on the Nigerian property market.
                Check back soon for expert analysis and investment tips.
              </p>
              <Link href="/properties" className={styles.emptyCta}>
                Browse Properties
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <Link href={`/blog/${featured.slug}`} className={`${styles.featuredCard} ${styles.fadeIn}`}>
                  <div className={styles.featuredInner}>
                    <div className={styles.featuredImageWrap}>
                      {featured.cover_image_url ? (
                        <img
                          src={featured.cover_image_url}
                          alt={featured.title}
                          className={styles.featuredImage}
                        />
                      ) : (
                        <div className={styles.featuredImageBg} />
                      )}
                      <span className={styles.featuredBadge}>Featured</span>
                    </div>
                    <div className={styles.featuredContent}>
                      <div className={styles.featuredMeta}>
                        <span className={styles.featuredCategory}>
                          {CATEGORY_LABELS[featured.category] ?? featured.category}
                        </span>
                        <span className={styles.featuredDot} />
                        <span className={styles.featuredDate}>
                          {featured.published_at
                            ? new Date(featured.published_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
                            : new Date(featured.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
                          }
                        </span>
                      </div>
                      <h2 className={styles.featuredTitle}>{featured.title}</h2>
                      {featured.excerpt && (
                        <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
                      )}
                      <div className={styles.featuredFooter}>
                        <div>
                          <p className={styles.featuredReadTime}>{readTime(featured.content)} min read</p>
                          <p className={styles.featuredReadCat}>
                            {CATEGORY_LABELS[featured.category] ?? featured.category}
                          </p>
                        </div>
                        <div className={styles.featuredArrow}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Grid */}
              {gridPosts.length > 0 && (
                <div className={styles.grid}>
                  {gridPosts.map((post, i) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className={`${styles.gridCard} ${styles.fadeIn}`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div className={styles.gridCardImageWrap}>
                        {post.cover_image_url ? (
                          <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className={styles.gridCardImage}
                          />
                        ) : (
                          <div className={styles.gridCardImageBg} />
                        )}
                      </div>
                      <div className={styles.gridCardBody}>
                        <span className={styles.gridCardCategory}>
                          {CATEGORY_LABELS[post.category] ?? post.category}
                        </span>
                        <h3 className={styles.gridCardTitle}>{post.title}</h3>
                        {post.excerpt && (
                          <p className={styles.gridCardExcerpt}>{post.excerpt}</p>
                        )}
                        <span className={styles.gridCardLink}>
                          Read Full Article
                          <ArrowRightIcon />
                        </span>
                      </div>
                    </Link>
                  ))}

                  {/* Wide card */}
                  {widePosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className={`${styles.wideCard} ${styles.fadeIn}`}
                    >
                      <div className={styles.wideImageWrap}>
                        {post.cover_image_url ? (
                          <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className={styles.wideImage}
                          />
                        ) : (
                          <div className={styles.wideImageBg} />
                        )}
                      </div>
                      <div className={styles.wideBody}>
                        <span className={styles.wideCategory}>
                          {CATEGORY_LABELS[post.category] ?? post.category}
                        </span>
                        <h3 className={styles.wideTitle}>{post.title}</h3>
                        {post.excerpt && (
                          <p className={styles.wideExcerpt}>{post.excerpt}</p>
                        )}
                        <span className={styles.wideLink}>
                          Read Full Article
                          <ArrowRightIcon />
                        </span>
                      </div>
                    </Link>
                  ))}

                  {/* Remaining posts */}
                  {rest.slice(3).map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className={styles.gridCard}
                    >
                      <div className={styles.gridCardImageWrap}>
                        {post.cover_image_url ? (
                          <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className={styles.gridCardImage}
                          />
                        ) : (
                          <div className={styles.gridCardImageBg} />
                        )}
                      </div>
                      <div className={styles.gridCardBody}>
                        <span className={styles.gridCardCategory}>
                          {CATEGORY_LABELS[post.category] ?? post.category}
                        </span>
                        <h3 className={styles.gridCardTitle}>{post.title}</h3>
                        {post.excerpt && (
                          <p className={styles.gridCardExcerpt}>{post.excerpt}</p>
                        )}
                        <span className={styles.gridCardLink}>
                          Read Full Article
                          <ArrowRightIcon />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Sidebar ────────────────────────────── */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            {/* Search */}
            <div className={`${styles.sidebarSection} ${styles.sidebarSearch}`}>
              <input
                className={styles.sidebarSearchInput}
                placeholder="Search insights..."
                type="text"
              />
              <SearchIcon />
            </div>

            {/* Topics */}
            <div className={styles.sidebarSection}>
              <h4 className={styles.sidebarLabel}>Popular Topics</h4>
              <div className={styles.sidebarTopics}>
                {TOPICS.map(({ label, href }) => (
                  <Link key={label} href={href} className={styles.sidebarTopic}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className={styles.newsletter}>
              <div className={styles.newsletterGlow} />
              <MailIcon />
              <h4 className={styles.newsletterTitle}>Stay Informed</h4>
              <p className={styles.newsletterText}>
                Join 5,000+ investors receiving our monthly market report and exclusive legal breakdowns.
              </p>
              <div className={styles.newsletterForm}>
                <input
                  className={styles.newsletterInput}
                  placeholder="Your email"
                  type="email"
                />
                <button className={styles.newsletterBtn} type="submit">
                  Subscribe Now
                </button>
              </div>
            </div>

            {/* Recent Posts */}
            {typedPosts.length > 1 && (
              <div className={styles.recentPosts}>
                <h4 className={styles.sidebarLabel}>Latest Posts</h4>
                <div className={styles.recentList}>
                  {typedPosts.slice(0, 3).map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className={styles.recentItem}
                    >
                      <div className={styles.recentImage}>
                        {post.cover_image_url ? (
                          <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className={styles.recentImg}
                          />
                        ) : (
                          <div className={styles.recentImgBg} />
                        )}
                      </div>
                      <div>
                        <h5 className={styles.recentTitle}>{post.title}</h5>
                        <p className={styles.recentDate}>
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
                            : new Date(post.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
                          }
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  )
}
