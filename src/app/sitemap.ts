import type { MetadataRoute } from 'next'
import { gpus } from '#/lib/gpu-data'
import { getBaseUrl, gpuPath } from '#/lib/seo'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()
  const lastModified = new Date()

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
    ...gpus.map((gpu) => ({
      url: `${baseUrl}${gpuPath(gpu)}`,
      lastModified: new Date(gpu.price_last_checked),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
