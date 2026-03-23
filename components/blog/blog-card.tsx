import Link from 'next/link'
import { BlogPost, BLOG_CATEGORIES } from '@/lib/types'
import { estimateReadTime } from '@/lib/utils'

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

const CATEGORY_COLORS: Record<string, string> = {
  'market-insights': 'bg-blue-100 text-blue-700',
  'buyers-guide': 'bg-green-100 text-green-700',
  'sellers-tips': 'bg-orange-100 text-orange-700',
  'investment': 'bg-purple-100 text-purple-700',
  'legal-finance': 'bg-red-100 text-red-700',
  'neighborhood': 'bg-teal-100 text-teal-700',
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const category = BLOG_CATEGORIES.find(c => c.value === post.category)
  const readTime = estimateReadTime(post.content)
  const colorClass = CATEGORY_COLORS[post.category] || 'bg-zinc-100 text-zinc-700'

  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-zinc-100 aspect-[16/7]">
          {post.cover_image_url ? (
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#0568fd]/20 to-[#c379df]/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold mb-3 ${colorClass}`}>
              {category?.label}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight group-hover:text-white/90 transition-colors line-clamp-2">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-white/70 text-sm md:text-base line-clamp-2 mb-3">
                {post.excerpt}
              </p>
            )}
            <p className="text-white/50 text-xs">
              {date} &middot; {readTime} min read
            </p>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        <div className="relative aspect-video bg-zinc-100 overflow-hidden">
          {post.cover_image_url ? (
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#0568fd]/10 to-[#c379df]/10 flex items-center justify-center">
              <svg className="h-10 w-10 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <span className={`self-start rounded-full px-2.5 py-1 text-xs font-semibold mb-3 ${colorClass}`}>
            {category?.label}
          </span>

          <h3 className="font-bold text-zinc-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-[#0568fd] transition-colors">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-sm text-zinc-500 line-clamp-2 mb-4 flex-1">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-auto pt-3 border-t border-zinc-100">
            <span>{date}</span>
            <span>&middot;</span>
            <span>{readTime} min read</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
