import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/ru/profile', '/en/profile', '/ru/oferta', '/en/oferta', '/api/'],
    },
    sitemap: 'https://hooksy.ru/sitemap.xml',
  }
}
