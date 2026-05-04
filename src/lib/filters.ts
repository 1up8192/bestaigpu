import type { PriceBasis, ScoredGPU } from './scoring'

export type BeginnerMode = 'all' | 'beginner_safe' | 'tinker'
export type PriceBracket =
  | 'all'
  | 'under_300'
  | 'under_500'
  | 'under_800'
  | 'under_1200'
  | 'premium'
export type VramFilter = 'all' | '12' | '16' | '24' | '24_plus' | '32' | '40_plus' | '48_plus'

export interface FilterState {
  beginnerMode: BeginnerMode
  priceBasis: PriceBasis
  priceBracket: PriceBracket
  vram: VramFilter
}

export const defaultFilterState: FilterState = {
  beginnerMode: 'all',
  priceBasis: 'lowest',
  priceBracket: 'all',
  vram: '24_plus',
}

export function applyFilters(gpus: ScoredGPU[], filters: FilterState): ScoredGPU[] {
  return gpus.filter((gpu) => {
    if (filters.beginnerMode === 'beginner_safe' && !isBeginnerSafe(gpu)) {
      return false
    }

    if (filters.beginnerMode === 'tinker' && !isTinkerCard(gpu)) {
      return false
    }

    if (filters.priceBasis === 'new' && gpu.new_price_usd === null) {
      return false
    }

    if (!matchesPriceBracket(gpu, filters.priceBracket)) {
      return false
    }

    if (!matchesVram(gpu, filters.vram)) {
      return false
    }

    return true
  })
}

export function countActiveFilters(filters: FilterState): number {
  return Object.entries(filters).filter(
    ([key, value]) => defaultFilterState[key as keyof FilterState] !== value
  ).length
}

export function isBeginnerSafe(gpu: ScoredGPU): boolean {
  return gpu.beginner_pain === 'low' && gpu.hardware_pain !== 'server_mods'
}

export function isTinkerCard(gpu: ScoredGPU): boolean {
  return (
    gpu.category === 'server' ||
    gpu.category === 'experimental' ||
    gpu.category === 'trap' ||
    gpu.beginner_pain === 'high' ||
    gpu.beginner_pain === 'trap' ||
    gpu.hardware_pain === 'tinkerer' ||
    gpu.hardware_pain === 'janky' ||
    gpu.hardware_pain === 'server_mods'
  )
}

function matchesPriceBracket(gpu: ScoredGPU, bracket: PriceBracket): boolean {
  const price = gpu.display_price_usd

  if (bracket === 'all') {
    return true
  }

  if (price === null) {
    return false
  }

  if (bracket === 'under_300') {
    return price < 300
  }

  if (bracket === 'under_500') {
    return price < 500
  }

  if (bracket === 'under_800') {
    return price < 800
  }

  if (bracket === 'under_1200') {
    return price < 1200
  }

  return price >= 1200
}

function matchesVram(gpu: ScoredGPU, filter: VramFilter): boolean {
  if (filter === 'all') {
    return true
  }

  if (filter === '40_plus') {
    return gpu.vram_gb >= 40
  }

  if (filter === '48_plus') {
    return gpu.vram_gb >= 48
  }

  if (filter === '24_plus') {
    return gpu.vram_gb >= 24
  }

  return gpu.vram_gb === Number(filter)
}
