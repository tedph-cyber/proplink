'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BlogPost, BlogCategory, BLOG_CATEGORIES } from '@/lib/types'
import { BlogCard } from './blog-card'

interface BlogGridProps {
  posts: BlogPost[]
}

export function BlogGrid({ posts }: BlogGridProps) {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | 'all'>('all')

  const filtered = activeCategory === 'all'
    ? posts
    : posts.filter(p => p.category === activeCategory)

  // Only show categories that have at least one post
  const usedCategories = BLOG_CATEGORIES.filter(c =>
    posts.some(p => p.category === c.value)
  )

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div>
      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory('all')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-[#0568fd] text-white'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          All
        </button>
        {usedCategories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat.value
                ? 'bg-[#0568fd] text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 text-zinc-500"
        >
          No posts in this category yet.
        </motion.p>
      ) : (
        <>
          {/* Featured post */}
          <AnimatePresence mode="wait">
            {featured && (
              <motion.div
                key={featured.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <BlogCard post={featured} featured />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Post grid */}
          {rest.length > 0 && (
            <motion.div
              layout
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence>
                {rest.map((post, i) => (
                  <motion.div
                    key={post.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                  >
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
