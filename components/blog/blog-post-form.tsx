'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BlogPost, BlogCategory, BLOG_CATEGORIES } from '@/lib/types'
import { generateSlug } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BlogEditor } from './blog-editor'

interface BlogPostFormProps {
  postId?: string
  initialData?: BlogPost
}

export function BlogPostForm({ postId, initialData }: BlogPostFormProps) {
  const router = useRouter()
  const isEditing = !!postId

  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [slugTouched, setSlugTouched] = useState(isEditing)
  const [category, setCategory] = useState<BlogCategory>(initialData?.category || 'market-insights')
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '')
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.cover_image_url || '')
  const [status, setStatus] = useState<'draft' | 'published'>(initialData?.status || 'draft')
  const [content, setContent] = useState(initialData?.content || '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  // Auto-generate slug from title (unless the user has manually edited it)
  useEffect(() => {
    if (!slugTouched && title) {
      setSlug(generateSlug(title))
    }
  }, [title, slugTouched])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) { setError('Title is required'); return }
    if (!slug.trim()) { setError('Slug is required'); return }
    if (!content.trim()) { setError('Content is required'); return }

    setSaving(true)

    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        category,
        tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
        excerpt: excerpt.trim() || null,
        cover_image_url: coverImageUrl.trim() || null,
        status,
        content,
      }

      const url = isEditing ? `/api/blog/${postId}` : '/api/blog'
      const method = isEditing ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save post')
      }

      router.push('/admin/blog')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <Input
            label="Title"
            type="text"
            placeholder="e.g. Why Lagos Real Estate is Booming in 2025"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            Slug <span className="text-zinc-400 font-normal">(URL path)</span>
          </label>
          <div className="flex items-center rounded-xl border border-zinc-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#0568fd]/30 focus-within:border-[#0568fd]">
            <span className="px-3 py-2.5 text-sm text-zinc-400 bg-zinc-50 border-r border-zinc-200 shrink-0">
              /blog/
            </span>
            <input
              type="text"
              value={slug}
              onChange={e => { setSlug(e.target.value); setSlugTouched(true) }}
              className="flex-1 px-3 py-2.5 text-sm text-zinc-800 bg-white focus:outline-none"
              placeholder="post-url-here"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value as BlogCategory)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#0568fd]/30 focus:border-[#0568fd]"
          >
            {BLOG_CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <Input
            label="Tags (comma-separated)"
            type="text"
            placeholder="e.g. Lagos, investment, first-time buyer"
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
          />
        </div>

        {/* Cover Image URL */}
        <div>
          <Input
            label="Cover Image URL"
            type="url"
            placeholder="https://..."
            value={coverImageUrl}
            onChange={e => setCoverImageUrl(e.target.value)}
          />
        </div>

        {/* Cover image preview */}
        {coverImageUrl && (
          <div className="md:col-span-2">
            <p className="text-xs text-zinc-500 mb-2">Cover image preview:</p>
            <img
              src={coverImageUrl}
              alt="Cover preview"
              className="h-48 w-full object-cover rounded-xl border border-zinc-200"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>
        )}

        {/* Excerpt */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            Excerpt
            <span className="ml-2 text-xs font-normal text-zinc-400">
              {excerpt.length}/200 chars
            </span>
          </label>
          <textarea
            value={excerpt}
            onChange={e => setExcerpt(e.target.value.slice(0, 200))}
            placeholder="A short description shown on listing cards and in search results…"
            rows={3}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#0568fd]/30 focus:border-[#0568fd]"
          />
        </div>

        {/* Status */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-zinc-700 mb-2">Status</label>
          <div className="flex gap-4">
            {(['draft', 'published'] as const).map(s => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={s}
                  checked={status === s}
                  onChange={() => setStatus(s)}
                  className="h-4 w-4 accent-[#0568fd]"
                />
                <span className="text-sm text-zinc-700 capitalize">{s}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Content <span className="text-red-500">*</span>
        </label>
        <BlogEditor
          value={content}
          onChange={setContent}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : isEditing ? 'Update Post' : 'Create Post'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/blog')}
          disabled={saving}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
