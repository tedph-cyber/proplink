import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BlogPost } from '@/lib/types'
import { DeletePostButton } from '@/components/blog/delete-post-button'

const CATEGORY_LABELS: Record<string, string> = {
  'market-insights': 'Market Insights',
  'buyers-guide': "Buyer's Guide",
  'sellers-tips': 'Sellers Tips',
  'investment': 'Investment',
  'legal-finance': 'Legal & Finance',
  'neighborhood': 'Neighborhood',
}

export default async function AdminBlogPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const { data: posts, count } = await supabase
    .from('blog_posts')
    .select('*, author:profiles(company_name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(20)

  const typedPosts = (posts ?? []) as BlogPost[]

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-text)] mb-1">Blog Posts</h1>
          <p className="text-[var(--color-text-muted)]">Curate and manage your market insights and guides.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-[var(--color-accent)] px-8 py-4 rounded-full text-white font-bold text-base shadow-xl shadow-[var(--color-accent)]/25 hover:scale-[1.03] transition-all flex items-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </Link>
      </div>

      {/* Table */}
      <div className="bg-[var(--color-surface)] rounded-3xl overflow-hidden shadow-[var(--shadow-card)] border border-[var(--color-border)]/5">
        {typedPosts.length === 0 ? (
          <div className="px-8 py-20 text-center">
            <p className="text-[var(--color-text-muted)] mb-4">No blog posts yet.</p>
            <Link href="/admin/blog/new" className="text-[var(--color-accent)] font-semibold hover:underline">Create your first post →</Link>
          </div>
        ) : (
          <>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-2)]/50">
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Post Details</th>
                  <th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Category</th>
                  <th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Status</th>
                  <th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Date</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-surface-2)]">
                {typedPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-[var(--color-surface-2)]/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--color-surface-2)]">
                          {post.cover_image_url ? (
                            <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface)]" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-[var(--color-text)] text-base group-hover:text-[var(--color-accent)] transition-colors leading-snug">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-[var(--color-text-muted)] text-xs mt-1 line-clamp-1 max-w-sm">{post.excerpt}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="px-3 py-1.5 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-text)] text-xs font-bold tracking-tight">
                        {CATEGORY_LABELS[post.category] ?? post.category}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${post.status === 'published' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <span className={`text-sm font-semibold ${post.status === 'published' ? 'text-emerald-700' : 'text-slate-600'}`}>
                          {post.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-[var(--color-text-muted)] text-sm font-medium">
                        {new Date(post.published_at ?? post.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end items-center gap-1">
                        {post.status === 'published' && (
                          <Link
                            href={`/blog/${post.slug}`}
                            className="p-2.5 rounded-xl hover:bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-all"
                            title="View"
                            target="_blank"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                        )}
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="p-2.5 rounded-xl hover:bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-all"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="px-8 py-5 bg-[var(--color-surface-2)]/20 flex items-center justify-between border-t border-[var(--color-border)]/10">
              <p className="text-sm text-[var(--color-text-muted)] font-medium">
                Showing <span className="text-[var(--color-text)] font-bold">{typedPosts.length}</span> of{' '}
                <span className="text-[var(--color-text)] font-bold">{count ?? typedPosts.length}</span> posts
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
