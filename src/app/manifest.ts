import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    lang: 'en',
    dir: 'ltr',
    name: 'bestaigpu.com',
    short_name: 'bestaigpu',
    description: 'Best value GPU comparison site for local LLM inference.',
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
