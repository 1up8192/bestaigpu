import '../styles/global.css'

import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { Footer } from '#/components/layout/Footer'
import { siteDescription, siteName, socialImage } from '#/lib/seo'

const fontMono = JetBrains_Mono({ variable: '--font-mono', subsets: ['latin'] })
const themeScript = `(() => {
  try {
    const theme = localStorage.getItem('theme');
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.dataset.theme = theme;
    }
  } catch {}
})();`

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://bestaigpu.com'),
  applicationName: siteName,
  title: {
    default: 'Best GPUs for Local LLMs in 2026 | AI GPU Value Index',
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    'best GPU for local AI',
    'best GPU for local LLM',
    'AI GPU benchmark',
    'local LLM GPU',
    'used GPU for AI',
    'RTX 3090 local LLM',
    'RTX 4090 local AI',
  ],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '64x64', type: 'image/png' },
      { url: '/logo64.png', sizes: '64x64', type: 'image/png' },
      { url: '/logo192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/logo192.png', sizes: '192x192', type: 'image/png' },
      { url: '/logo512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Best GPUs for Local LLMs in 2026',
    description: siteDescription,
    url: '/',
    siteName,
    images: [
      socialImage,
      {
        url: '/logo512.png',
        width: 512,
        height: 512,
        alt: 'bestaigpu.com logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best GPUs for Local LLMs in 2026',
    description: siteDescription,
    images: [socialImage.url],
  },
}

export default function RootLayout({ children }: Readonly<React.PropsWithChildren>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontMono.variable} font-mono`}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
        <Footer />
      </body>
    </html>
  )
}
