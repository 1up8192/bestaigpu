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
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
    display: 'standalone',
    orientation: 'natural',
  }
}
