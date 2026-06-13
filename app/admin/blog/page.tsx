import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BlogPost } from '@/lib/types'
import { DeletePostButton } from '@/components/blog/delete-post-button'
import styles from '@/styles/admin.module.css'

const CATEGORY_LABELS: Record<string, string> = {
  'market-insights': 'Market Insights',
  'buyers-guide': "Buyer's Guide",
  'sellers-tips': 'Sellers Tips',
  'investment': 'Investment',
  'legal-finance': 'Legal & Finance',
  'neighborhood': 'Neighborhood',
}

const FILTERS = [
  { value: '', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
] as const

async function getFilterCounts() {
  const supabase = await createClient()
  const base = supabase.from('blog_posts')
  const { count: total } = await base.select('*', { count: 'exact', head: true })
  const { count: published } = await base.select('*', { count: 'exact', head: true }).eq('status', 'published')
  const { count: draft } = await base.select('*', { count: 'exact', head: true }).eq('status', 'draft')
  return { total: total ?? 0, published: published ?? 0, draft: draft ?? 0 }
}

export default async function AdminBlogPage(props: { searchParams?: Promise<{ status?: string }> }) {
  const searchParams = await props.searchParams
  const filterStatus = searchParams?.status || ''
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  let query = supabase
    .from('blog_posts')
    .select('*, author:profiles(company_name)', { count: 'exact' })

  if (filterStatus === 'published' || filterStatus === 'draft') {
    query = query.eq('status', filterStatus)
  }

  const { data: posts, count } = await query
    .order('created_at', { ascending: false })
    .limit(20)

  const typedPosts = (posts ?? []) as BlogPost[]
  const filterCounts = await getFilterCounts()

  return (
    <div className={styles.pageNarrow}>
      {/* Header */}
      <div className={styles.pageHeaderRow}>
        <div>
          <h1 className={styles.pageTitleLg}>Blog Posts</h1>
          <p className={styles.pageSubtitle}>Write and manage your market insights and guides.</p>
        </div>
        <Link href="/admin/blog/new" className={styles.newPostBtn}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {FILTERS.map(({ value, label }) => {
          const isActive = filterStatus === value || (!filterStatus && !value)
          const href = value ? `/admin/blog?status=${value}` : '/admin/blog'
          const countKey =
            value === 'published' ? 'published' as const
            : value === 'draft' ? 'draft' as const
            : 'total' as const
          const chipLabel = `${label} (${filterCounts[countKey]})`
          return (
            <Link
              key={value}
              href={href}
              className={isActive ? styles.filterChipActive : styles.filterChip}
            >
              {chipLabel}
            </Link>
          )
        })}
      </div>

      {/* Empty State (no table) */}
      {typedPosts.length === 0 ? (
        <div className={styles.emptyStateBorder}>
          <div className="flex flex-col items-center justify-center min-h-[360px] px-8">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface-2)]">
              <svg className="h-8 w-8 text-[var(--color-text-hint)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">
              {filterStatus === 'draft' ? 'No drafts yet' : filterStatus === 'published' ? 'No published posts yet' : 'No blog posts yet'}
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] text-center max-w-sm mb-8">
              {filterStatus
                ? `No ${filterStatus} posts found. Try switching to a different filter.`
                : 'Your published articles and drafts will appear here. Create your first post to get started.'}
            </p>
            <Link href="/admin/blog/new" className={styles.emptyNewPostBtn}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Post
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className={styles.tableWrapBorder}>
            <table className={`${styles.table} ${styles.desktopTable}`}>
              <thead>
                <tr className={styles.tableHead}>
                  <th className={styles.tableThWide} scope="col">Post Details</th>
                  <th className={styles.tableTh} scope="col">Category</th>
                  <th className={styles.tableTh} scope="col">Status</th>
                  <th className={styles.tableTh} scope="col">Date</th>
                  <th className={styles.tableThRightWide} scope="col">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-surface-2)]">
                {typedPosts.map((post) => (
                  <tr key={post.id} className={styles.tableRow}>
                    <td className={styles.tableTdWide}>
                      <div className="flex items-center gap-5">
                        <div className={styles.blogThumb}>
                          {post.cover_image_url ? (
                            <img src={post.cover_image_url} alt={post.title} className={styles.blogThumbImg} />
                          ) : (
                            <div className={`${styles.blogThumbPlaceholder} bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface)]`} />
                          )}
                        </div>
                        <div>
                          <h3 className={styles.blogTitle}>
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className={styles.blogExcerpt}>{post.excerpt}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableTdCategory}>
                      <span className={styles.categoryBadge}>
                        {CATEGORY_LABELS[post.category] ?? post.category}
                      </span>
                    </td>
                    <td className={styles.tableTdStatus}>
                      {post.status === 'published' ? (
                        <span className={styles.statusActive}>
                          <span className={styles.statusActiveDot} />
                          Published
                        </span>
                      ) : (
                        <span className={styles.statusDraft}>
                          <span className={styles.statusDraftDot} />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className={styles.tableTdDate}>
                      <span className="text-[var(--color-text-muted)] text-sm font-medium">
                        {new Date(post.published_at ?? post.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className={styles.tableTdRightWide}>
                      <div className="flex justify-end items-center gap-1">
                        <Link
                          href={post.status === 'published' ? `/blog/${post.slug}` : `/admin/blog/${post.id}/preview`}
                          className={styles.blogActionBtn}
                          title={post.status === 'published' ? 'View' : 'Preview'}
                          target={post.status === 'published' ? '_blank' : undefined}
                        >
                          <svg className={styles.blogActionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link href={`/admin/blog/${post.id}/edit`} className={styles.blogActionBtn} title="Edit">
                          <svg className={styles.blogActionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <DeletePostButton postId={post.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {typedPosts.length > 0 && (
              <div className={styles.tableFooter}>
                <p className={styles.tableFooterText}>
                  Showing <span className={styles.tableFooterCount}>{typedPosts.length}</span> of{' '}
                  <span className={styles.tableFooterCount}>{count ?? typedPosts.length}</span> posts
                </p>
              </div>
            )}
          </div>

          {/* Mobile cards */}
          <div className={styles.blogCardGrid}>
            {typedPosts.map((post) => (
              <div key={post.id} className={styles.blogCard}>
                <div className={styles.blogCardTop}>
                  <div className={styles.blogCardThumb}>
                    {post.cover_image_url ? (
                      <img src={post.cover_image_url} alt={post.title} className={styles.blogCardThumbImg} />
                    ) : (
                      <div className={`${styles.blogThumbPlaceholder} bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface)]`} />
                    )}
                  </div>
                  <div className={styles.blogCardInfo}>
                    <h3 className={styles.blogCardTitle}>{post.title}</h3>
                    {post.excerpt && <p className={styles.blogCardExcerpt}>{post.excerpt}</p>}
                  </div>
                </div>
                <div className={styles.blogCardMeta}>
                  <span className={styles.categoryBadge}>
                    {CATEGORY_LABELS[post.category] ?? post.category}
                  </span>
                  {post.status === 'published' ? (
                    <span className={styles.statusActive}>
                      <span className={styles.statusActiveDot} />
                      Published
                    </span>
                  ) : (
                    <span className={styles.statusDraft}>
                      <span className={styles.statusDraftDot} />
                      Draft
                    </span>
                  )}
                  <span className="text-[var(--color-text-muted)] text-xs font-medium">
                    {new Date(post.published_at ?? post.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className={styles.blogCardFooter}>
                  <span className="text-[var(--color-text-muted)] text-xs">
                    {count ? `${typedPosts.length} of ${count} posts` : ''}
                  </span>
                  <div className={styles.blogCardActions}>
                    <Link
                      href={post.status === 'published' ? `/blog/${post.slug}` : `/admin/blog/${post.id}/preview`}
                      className={styles.blogActionBtn}
                      title={post.status === 'published' ? 'View' : 'Preview'}
                      target={post.status === 'published' ? '_blank' : undefined}
                    >
                      <svg className={styles.blogActionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    <Link href={`/admin/blog/${post.id}/edit`} className={styles.blogActionBtn} title="Edit">
                      <svg className={styles.blogActionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <DeletePostButton postId={post.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
