'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BlogPost, BlogCategory } from '@/lib/types'
import styles from '@/styles/blog-editor.module.css'

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
  const [status, setStatus] = useState<'draft' | 'published'>(initialData?.status ?? (postId ? 'draft' : 'published'))
  const [content, setContent] = useState(initialData?.content ?? '')
  const [preview, setPreview] = useState('')
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')
  const [slugManual, setSlugManual] = useState(!!initialData?.slug)

  useEffect(() => {
    if (!slugManual && title) setSlug(generateSlug(title))
  }, [title, slugManual])

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

  const insertMarkdown = (template: string) => {
    setContent(c => c + template)
  }

  return (
    <div className={styles.page}>
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs}>
        <Link href="/admin" className={styles.breadcrumbLink}>Dashboard</Link>
        <span>/</span>
        <Link href="/admin/blog" className={styles.breadcrumbLink}>Blog</Link>
        <span>/</span>
        <span className={styles.breadcrumbCurrent}>{postId ? 'Edit Post' : 'New Post'}</span>
      </nav>

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>{postId ? 'Edit Post' : 'New Blog Post'}</h1>
        <p className={styles.headerSubtitle}>
          {postId ? 'Update your article content and settings.' : 'Create a new article for the StrongTower Holdings blog.'}
        </p>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <svg className={styles.errorIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.layout}>
          {/* ─── Main Column ─────────────────────────────── */}
          <div className={styles.mainColumn}>
            {/* Title */}
            <div className={styles.card}>
              <div className={styles.field}>
                <label className={styles.label}>Title</label>
                <input
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className={styles.input}
                  placeholder="Enter a compelling title…"
                />
              </div>
            </div>

            {/* Slug */}
            <div className={styles.card}>
              <div className={styles.field}>
                <label className={styles.label}>URL Slug</label>
                <div className={styles.slugWrap}>
                  <span className={styles.slugPrefix}>/blog/</span>
                  <input
                    value={slug}
                    onChange={e => { setSlugManual(true); setSlug(e.target.value) }}
                    className={styles.slugInput}
                    placeholder="auto-generated-from-title"
                  />
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div className={styles.card}>
              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>Excerpt</label>
                  <span className={excerpt.length > 200 ? styles.charCountWarn : styles.charCount}>
                    {excerpt.length}/200
                  </span>
                </div>
                <textarea
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  rows={3}
                  maxLength={200}
                  className={styles.textarea}
                  placeholder="Brief description shown in listing pages…"
                />
              </div>
            </div>

            {/* Cover Image */}
            <div className={styles.card}>
              <div className={styles.field}>
                <label className={styles.label}>Cover Image URL</label>
                <input
                  value={coverUrl}
                  onChange={e => setCoverUrl(e.target.value)}
                  className={styles.input}
                  placeholder="https://…"
                  type="url"
                />
                {coverUrl && (
                  <div className={styles.coverPreview}>
                    <img src={coverUrl} alt="Cover preview" />
                  </div>
                )}
              </div>
            </div>

            {/* Content Editor */}
            <div className={styles.editorCard}>
              <div className={styles.editorHeader}>
                <div className={styles.editorTabs}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    className={activeTab === 'write' ? styles.editorTabActive : styles.editorTab}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={activeTab === 'preview' ? styles.editorTabActive : styles.editorTab}
                  >
                    Preview
                  </button>
                </div>
              </div>

              {activeTab === 'write' && (
                <>
                  <div className={styles.editorToolbar}>
                    {[
                      { label: 'B', action: () => insertMarkdown('**bold**') },
                      { label: 'I', action: () => insertMarkdown('_italic_') },
                      { label: 'H2', action: () => insertMarkdown('\n## Heading\n') },
                      { label: 'H3', action: () => insertMarkdown('\n### Heading\n') },
                      { label: 'Link', action: () => insertMarkdown('[text](url)') },
                      { label: 'Quote', action: () => insertMarkdown('\n> blockquote\n') },
                      { label: 'UL', action: () => insertMarkdown('\n- item\n- item\n') },
                      { label: 'OL', action: () => insertMarkdown('\n1. item\n2. item\n') },
                    ].map(({ label, action }) => (
                      <button key={label} type="button" onClick={action} className={styles.toolbarBtn}>
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className={styles.editorBody}>
                    <textarea
                      required
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      className={styles.editorTextarea}
                      placeholder="Write your article in Markdown…"
                    />
                  </div>
                </>
              )}

              {activeTab === 'preview' && (
                <div
                  className={styles.previewPane}
                  dangerouslySetInnerHTML={{
                    __html: preview || '<p class="editorEmpty">Nothing to preview yet.</p>'
                  }}
                />
              )}
            </div>
          </div>

          {/* ─── Sidebar Column ─────────────────────────── */}
          <div className={styles.sidebarColumn}>
            {/* Post Settings */}
            <div className={styles.settingsCard}>
              <span className={styles.cardTitle}>Post Settings</span>

              <div className={styles.settingsSection}>
                <div className={styles.field}>
                  <label className={styles.label}>Status</label>
                  <div className={styles.statusToggle}>
                    <button
                      type="button"
                      onClick={() => setStatus('draft')}
                      className={status === 'draft' ? styles.statusDraftActive : styles.statusDraft}
                    >
                      Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('published')}
                      className={status === 'published' ? styles.statusPublishedActive : styles.statusPublished}
                    >
                      Published
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.settingsSection}>
                <div className={styles.field}>
                  <label className={styles.label}>Category</label>
                  <select
                    required
                    value={category}
                    onChange={e => setCategory(e.target.value as BlogCategory)}
                    className={styles.select}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.settingsSection}>
                <div className={styles.field}>
                  <label className={styles.label}>Tags</label>
                  <input
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    className={styles.input}
                    placeholder="e.g. Lagos, investment, land"
                  />
                  {tags && (
                    <div className={styles.tagsPreview}>
                      {tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                        <span key={tag} className={styles.tagPill}>#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actionsCard}>
              <button
                type="submit"
                disabled={saving}
                className={styles.actionPrimary}
              >
                {saving ? (
                  <>Saving…</>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {postId ? 'Update Post' : 'Create Post'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/blog')}
                className={styles.actionSecondary}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
