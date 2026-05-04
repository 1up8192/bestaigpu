import type { DisplayPriceLabel } from './scoring'

export function formatPrice(n: number | null): string {
  if (n === null) {
    return '-'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatPriceWithLabel(n: number | null, label: DisplayPriceLabel): string {
  const price = formatPrice(n)

  if (price === '-' || label === 'unknown') {
    return price
  }

  return `${price} ${label}`
}

export function formatTps(n: number | null): string {
  if (n === null) {
    return '-'
  }

  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(n)} t/s`
}

export function formatScore(n: number | null): string {
  if (n === null) {
    return '-'
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

export function formatInteger(n: number | null): string {
  if (n === null) {
    return '-'
  }

  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)
}
