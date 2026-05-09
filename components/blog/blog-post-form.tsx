'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { BlogPost, BlogCategory } from '@/lib/types'

const CATEGORIES: { value: BlogCategory; label: string }[] = [
  { value: 'market-insights', label: 'Market Insights' },
  { value: 'buyers-guide', label: "Buyer's Guide" },
  { value: 'sellers-tips', label: 'Sellers Tips' },
  { value: 'investment', label: 'Investment' },
  { value: 'legal-finance', label: 'Legal & Finance' },
  { value: 'neighborhood', label: 'Neighborhood' },
]

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

interface Props {
  postId?: string
  initialData?: Partial<BlogPost>
}

export function BlogPostForm({ postId, initialData }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState(initialData?.title ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [category, setCategory] = useState<BlogCategory>(initialData?.category ?? 'market-insights')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '')
  const [coverUrl, setCoverUrl] = useState(initialData?.cover_image_url ?? '')
  const [tags, setTags] = useState((initialData?.tags ?? []).join(', '))
  const [status, setStatus] = useState<'draft' | 'published'>(initialData?.status ?? 'draft')
  const [content, setContent] = useState(initialData?.content ?? '')
  const [preview, setPreview] = useState('')
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')
  const [slugManual, setSlugManual] = useState(!!initialData?.slug)

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManual && title) setSlug(generateSlug(title))
  }, [title, slugManual])

  // Debounced markdown preview
  const updatePreview = useCallback(async (md: string) => {
    try {
      const { marked } = await import('marked')
      setPreview(await marked(md) as string)
    } catch {
      setPreview(`<p>${md.replace(/\n/g, '</p><p>')}</p>`)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => updatePreview(content), 300)
    return () => clearTimeout(t)
  }, [content, updatePreview])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const body = {
      title,
      slug,
      category,
      excerpt: excerpt || null,
      cover_image_url: coverUrl || null,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      status,
      content,
    }

    try {
      const url = postId ? `/api/blog/${postId}` : '/api/blog'
      const method = postId ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error ?? 'Something went wrong')
        setSaving(false)
        return
      }
      router.push('/admin/blog')
    } catch {
      setError('Network error')
      setSaving(false)
    }
  }

  const inputCls = 'w-full bg-[var(--color-surface-2)] border-none rounded-xl px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all text-sm'
  const labelCls = 'block text-[11px] font-bold uppercase tracking-[0.05em] text-[var(--color-text-muted)] mb-2'

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label className={labelCls}>Title *</label>
            <input
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className={inputCls}
              placeholder="Enter post title..."
            />
          </div>

          {/* Slug */}
          <div>
            <label className={labelCls}>Slug</label>
            <div className="flex items-center bg-[var(--color-surface-2)] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[var(--color-accent)]/20">
              <span className="pl-4 pr-1 text-sm text-[var(--color-text-muted)] font-mono">/blog/</span>
              <input
                value={slug}
                onChange={e => { setSlugManual(true); setSlug(e.target.value) }}
                className="flex-1 bg-transparent border-none py-3 pr-4 text-[var(--color-text)] focus:outline-none text-sm font-mono"
                placeholder="auto-generated-from-title"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className={labelCls}>
              Excerpt
              <span className={`ml-2 ${excerpt.length > 200 ? 'text-red-500' : 'text-[var(--color-text-muted)]'}`}>
                {excerpt.length}/200
              </span>
            </label>
            <textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              rows={3}
              maxLength={200}
              className={inputCls + ' resize-none'}
              placeholder="Brief description shown in listing pages..."
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className={labelCls}>Cover Image URL</label>
            <input
              value={coverUrl}
              onChange={e => setCoverUrl(e.target.value)}
              className={inputCls}
              placeholder="https://..."
              type="url"
            />
            {coverUrl && (
              <div className="mt-3 rounded-xl overflow-hidden h-40">
                <img src={coverUrl} alt="Cover preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Content Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelCls + ' mb-0'}>Content * (Markdown)</label>
              <div className="flex gap-1 bg-[var(--color-surface-2)] p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'write' ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm' : 'text-[var(--color-text-muted)]'}`}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'preview' ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm' : 'text-[var(--color-text-muted)]'}`}
                >
                  Preview
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex gap-1 mb-2 flex-wrap">
              {[
                { label: 'B', action: () => setContent(c => c + '**bold**') },
                { label: 'I', action: () => setContent(c => c + '_italic_') },
                { label: 'H2', action: () => setContent(c => c + '\n## Heading\n') },
                { label: 'H3', action: () => setContent(c => c + '\n### Heading\n') },
                { label: 'Link', action: () => setContent(c => c + '[text](url)') },
                { label: 'Quote', action: () => setContent(c => c + '\n> blockquote\n') },
              ].map(({ label, action }) => (
                <button
                  key={label}
                  type="button"
                  onClick={action}
                  className="px-3 py-1 bg-[var(--color-surface-2)] hover:bg-[var(--color-border)] rounded-lg text-xs font-bold text-[var(--color-text-muted)] transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>

            {activeTab === 'write' ? (
              <textarea
                required
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={18}
                className={inputCls + ' resize-none font-mono text-sm leading-relaxed'}
                placeholder="Write your article in Markdown..."
              />
            ) : (
              <div
                className="prose min-h-[400px] bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]"
                dangerouslySetInnerHTML={{ __html: preview || '<p class="text-[var(--color-text-muted)] italic">Nothing to preview yet.</p>' }}
              />
            )}
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-[var(--shadow-card)] space-y-6">
            <h3 className="font-bold text-sm text-[var(--color-text)] uppercase tracking-wider">Post Settings</h3>

            {/* Status */}
            <div>
              <label className={labelCls}>Status</label>
              <div className="flex gap-2">
                {(['draft', 'published'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                      status === s
                        ? s === 'published' ? 'bg-emerald-500 text-white' : 'bg-[var(--color-surface-2)] text-[var(--color-text)]'
                        : 'bg-[var(--color-surface-2)]/50 text-[var(--color-text-muted)]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className={labelCls}>Category *</label>
              <select
                required
                value={category}
                onChange={e => setCategory(e.target.value as BlogCategory)}
                className={inputCls + ' cursor-pointer'}
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className={labelCls}>Tags (comma-separated)</label>
              <input
                value={tags}
                onChange={e => setTags(e.target.value)}
                className={inputCls}
                placeholder="Lagos, investment, land"
              />
              {tags && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                    <span key={tag} className="px-3 py-1 bg-[var(--color-surface-2)] rounded-full text-xs font-medium text-[var(--color-text-muted)]">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 rounded-xl bg-[var(--color-accent)] text-white font-bold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : postId ? 'Update Post' : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/blog')}
              className="w-full py-3 rounded-xl bg-[var(--color-surface-2)] text-[var(--color-text)] font-semibold text-sm hover:bg-[var(--color-border)] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
