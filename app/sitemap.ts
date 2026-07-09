import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const [properties, posts] = await Promise.all([
    supabase.from('properties').select('id, updated_at').eq('status', 'active'),
    supabase.from('blog_posts').select('slug, updated_at').eq('status', 'published'),
  ])

  const site = 'https://strongtowerholdings.com.ng'

  const staticPages = [
    { url: site, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${site}/properties`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${site}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${site}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${site}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${site}/faq`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${site}/terms`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.2 },
    { url: `${site}/privacy`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.2 },
  ]

  const propertyPages = (properties.data || []).map((p) => ({
    url: `${site}/properties/${p.id}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const blogPages = (posts.data || []).map((p) => ({
    url: `${site}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...propertyPages, ...blogPages]
}
