import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BlogPost } from '@/lib/types'
import styles from '@/styles/admin.module.css'

const CATEGORY_LABELS: Record<string, string> = {
  'market-insights': 'Market Insights',
  'buyers-guide': "Buyer's Guide",
  'sellers-tips': 'Sellers Tips',
  'investment': 'Investment',
  'legal-finance': 'Legal & Finance',
  'neighborhood': 'Neighborhood',
}

async function renderMarkdown(content: string) {
  try {
    const { marked } = await import('marked')
    return marked(content) as string
  } catch {
    return `<p>${content.replace(/\n/g, '</p><p>')}</p>`
  }
}

function readTime(content: string) {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export default async function PreviewBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*, author:profiles(id, company_name)')
    .eq('id', id)
    .single()

  if (!post) notFound()

  const typedPost = post as BlogPost
  const html = await renderMarkdown(typedPost.content)
  const minutes = readTime(typedPost.content)
  const pubDate = typedPost.published_at ?? typedPost.created_at
  const isDraft = typedPost.status === 'draft'

  return (
    <div className={styles.pageNarrow}>
      {/* Admin Preview Banner */}
      <div className="mb-8 rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)] text-white text-xs font-bold">
            {isDraft ? 'DR' : 'PV'}
          </span>
          <div>
            <p className="text-sm font-bold text-[var(--color-text)]">
              {isDraft ? 'Draft Preview' : 'Post Preview'}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              This is how the post will look on the public site.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/blog/${typedPost.id}/edit`}
            className="rounded-lg bg-[var(--color-surface-2)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
          >
            Edit Post
          </Link>
          <Link
            href="/admin/blog"
            className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Content */}
      <main className="px-6 lg:px-10 py-10 max-w-4xl mx-auto bg-[var(--color-surface)] rounded-2xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-8">
          <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[var(--color-accent)] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-[var(--color-text)] font-medium truncate max-w-[200px]">{typedPost.title}</span>
        </nav>

        {/* Cover */}
        {typedPost.cover_image_url && (
          <div className="relative rounded-[2rem] overflow-hidden aspect-[16/8] mb-10">
            <img
              src={typedPost.cover_image_url}
              alt={typedPost.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 flex-wrap mb-6 text-sm text-[var(--color-text-muted)]">
          {isDraft && (
            <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--color-warning-muted)] text-[var(--color-warning)]">
              Draft
            </span>
          )}
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--color-accent-muted)] text-[var(--color-accent)]`}>
            {CATEGORY_LABELS[typedPost.category] ?? typedPost.category}
          </span>
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

        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {typedPost.tags && typedPost.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-10 border-t border-[var(--color-border)]/20">
            {typedPost.tags.map((tag) => (
              <span key={tag} className="px-4 py-1.5 rounded-full bg-[var(--color-surface-2)] text-sm font-medium text-[var(--color-text-muted)]">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
