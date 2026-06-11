import Link from 'next/link'
import { BlogPost, BLOG_CATEGORIES } from '@/lib/types'
import { estimateReadTime } from '@/lib/utils'
import styles from '@/styles/story-card.module.css'

interface StoryCardProps {
  post: BlogPost
}

export function StoryCard({ post }: StoryCardProps) {
  const category = BLOG_CATEGORIES.find(c => c.value === post.category)
  const readTime = estimateReadTime(post.content)
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <Link href={`/blog/${post.slug}`} className={styles.card}>
      <div className={styles.mediaWrap}>
        {post.cover_image_url ? (
          <img src={post.cover_image_url} alt={post.title} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'var(--color-surface-2)', position: 'absolute', inset: 0 }} />
        )}
      </div>
      <span className={styles.eyebrow}>{category?.label ?? post.category}</span>
      <h3 className={styles.title}>{post.title}</h3>
      {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
      <div className={styles.foot}>
        <span>{date}</span>
        <span>·</span>
        <span>{readTime} min read</span>
      </div>
    </Link>
  )
}
