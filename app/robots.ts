import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/properties', '/blog', '/about', '/contact', '/faq', '/terms', '/privacy'],
        disallow: ['/dashboard', '/admin', '/login', '/register', '/forgot-password', '/auth'],
      },
    ],
    sitemap: 'https://strongtowerholdings.com.ng/sitemap.xml',
  }
}
