import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://hooksy.ru'

  return [
    { url: `${base}/ru`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/en`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/ru/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/en/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]
}
