import type { MetadataRoute } from 'next'
import { siteDescription } from '#/lib/seo'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    lang: 'en',
    dir: 'ltr',
    name: 'Best AI GPU Value Index',
    short_name: 'bestaigpu',
    description: siteDescription,
    theme_color: '#18181b',
    background_color: '#fafafa',
    start_url: '/',
    icons: [
      {
        src: '/favicon.png',
        sizes: '64x64',
        type: 'image/png',
      },
      {
        src: '/logo64.png',
        sizes: '64x64',
        type: 'image/png',
      },
      {
        src: '/logo192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    display: 'standalone',
    orientation: 'natural',
  }
}
