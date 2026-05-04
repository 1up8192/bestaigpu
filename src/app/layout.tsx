import '../styles/global.css'

import type { Metadata } from 'next'
import { JetBrains_Mono, Mona_Sans } from 'next/font/google'
import { Footer } from '#/components/layout/Footer'

const fontSans = Mona_Sans({ variable: '--font-sans', subsets: ['latin'] })
const fontMono = JetBrains_Mono({ variable: '--font-mono', subsets: ['latin'] })

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
    <html lang="en">
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans`}>
        {children}
        <Footer />
      </body>
    </html>
  )
}
