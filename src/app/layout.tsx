import '../styles/global.css'

import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { Footer } from '#/components/layout/Footer'

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
  title: {
    default: 'bestaigpu.com',
    template: '%s | bestaigpu.com',
  },
  description: 'Best value GPU comparison site for local LLM inference.',
  openGraph: {
    title: 'bestaigpu.com',
    description: 'Best value GPU comparison site for local LLM inference.',
    url: '/',
    siteName: 'bestaigpu.com',
    images: [
      {
        url: '/favicon.svg',
        width: 64,
        height: 64,
        alt: 'bestaigpu.com GPU chip icon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'bestaigpu.com',
    description: 'Best value GPU comparison site for local LLM inference.',
    images: ['/favicon.svg'],
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
