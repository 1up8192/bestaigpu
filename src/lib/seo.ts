import type { Metadata } from 'next'
import type { GPU } from './data-schema'
import type { ScoredGPU } from './scoring'

export const siteName = 'bestaigpu.com'
export const siteDescription =
  'Compare 2026 GPU value for local AI and LLM inference by VRAM, price, tokens/sec, software support, power, noise, and beginner risk.'
export const socialImage = {
  url: '/social-share-1200x630.jpg',
  width: 1200,
  height: 630,
  alt: 'Best AI GPU value index share card',
}

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://bestaigpu.com'
}

export function absoluteUrl(path = '/') {
  const baseUrl = getBaseUrl().replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${baseUrl}${normalizedPath}`
}

export function gpuPath(gpu: Pick<GPU, 'slug'>) {
  return `/gpus/${gpu.slug}`
}

export function gpuTitle(gpu: Pick<GPU, 'name'>) {
  return `${gpu.name} for Local LLMs`
}

export function gpuDescription(gpu: GPU) {
  const availablePrices = [gpu.used_price_usd, gpu.new_price_usd].filter((n) => n !== null)
  const priceText =
    availablePrices.length === 0
      ? 'current price unknown'
      : `from $${new Intl.NumberFormat('en-US').format(Math.min(...availablePrices))}`

  return `${gpu.name} local AI GPU notes: ${gpu.vram_gb}GB VRAM, ${priceText}, ${gpu.software_support} software support, ${gpu.beginner_pain} beginner pain. ${gpu.verdict}`
}

export function createOpenGraphMetadata({
  title,
  description = siteDescription,
  path = '/',
}: {
  title: string
  description?: string
  path?: string
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName,
      type: 'website',
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage.url],
    },
  }
}

export function createJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: absoluteUrl(),
    description: siteDescription,
  }
}

export function gpuDatasetJsonLd(gpus: ScoredGPU[]) {
  const latestDate = gpus.map((gpu) => gpu.price_last_checked).sort((a, b) => b.localeCompare(a))[0]

  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'AI GPU Value Index',
    description: siteDescription,
    url: absoluteUrl(),
    dateModified: latestDate,
    creator: {
      '@type': 'Organization',
      name: siteName,
      url: absoluteUrl(),
    },
    variableMeasured: [
      'VRAM',
      'new price',
      'used price',
      'tokens per second',
      'tokens per second per 100 USD',
      'local LLM model fit',
      'software support',
      'power draw',
      'noise',
      'beginner pain',
      'practical value score',
    ],
  }
}

export function gpuItemListJsonLd(gpus: ScoredGPU[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best GPUs for local LLMs in 2026',
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: gpus.length,
    itemListElement: gpus.map((gpu, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: absoluteUrl(gpuPath(gpu)),
      name: gpu.name,
    })),
  }
}

export function gpuProductJsonLd(gpu: ScoredGPU) {
  const offers = [gpu.used_price_usd, gpu.new_price_usd]
    .filter((price) => price !== null)
    .map((price) => ({
      '@type': 'Offer',
      price,
      priceCurrency: 'USD',
      url: absoluteUrl(gpuPath(gpu)),
    }))

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: gpu.name,
    description: gpuDescription(gpu),
    brand: {
      '@type': 'Brand',
      name: gpu.vendor.toUpperCase(),
    },
    category: 'GPU for local AI inference',
    url: absoluteUrl(gpuPath(gpu)),
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'VRAM', value: `${gpu.vram_gb}GB` },
      { '@type': 'PropertyValue', name: 'Software support', value: gpu.software_support },
      { '@type': 'PropertyValue', name: 'Beginner pain', value: gpu.beginner_pain },
      { '@type': 'PropertyValue', name: 'Local LLM verdict', value: gpu.verdict },
    ],
    offers: offers.length > 0 ? offers : undefined,
  }
}
