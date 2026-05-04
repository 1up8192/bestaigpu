import type {
  BeginnerPain,
  GPU,
  HardwarePain,
  NoiseLevel,
  QwenFit,
  SoftwareSupport,
} from './data-schema'

export const qwenFitMultipliers = {
  excellent: 1.18,
  good: 1,
  tight: 0.35,
  barely: 0.08,
  no: 0,
} satisfies Record<QwenFit, number>

export const softwareSupportMultipliers = {
  excellent: 1.15,
  good: 1,
  okay: 0.82,
  improving: 0.72,
  painful: 0.45,
} satisfies Record<SoftwareSupport, number>

export const noiseMultipliers = {
  quiet: 1.08,
  normal: 1,
  loud: 0.82,
  server_jet: 0.42,
  unknown: 0.75,
} satisfies Record<NoiseLevel, number>

export const hardwarePainMultipliers = {
  normal: 1,
  needs_care: 0.86,
  tinkerer: 0.68,
  janky: 0.5,
  server_mods: 0.32,
} satisfies Record<HardwarePain, number>

export const beginnerPainMultipliers = {
  low: 1.08,
  medium: 0.9,
  high: 0.62,
  trap: 0.28,
} satisfies Record<BeginnerPain, number>

export type DisplayPriceLabel = 'new' | 'used' | 'new/used' | 'unknown'
export type PriceBasis = 'new' | 'lowest'

export type ScoredGPU = GPU & {
  display_price_usd: number | null
  display_price_label: DisplayPriceLabel
  raw_value_score: number | null
  tokens_per_second_per_100_usd: number | null
  practical_value_score: number | null
}

export function getDisplayPrice(gpu: GPU): number | null {
  return getPriceForBasis(gpu, 'lowest')
}

export function getPriceForBasis(gpu: GPU, basis: PriceBasis): number | null {
  if (basis === 'new') {
    return gpu.new_price_usd
  }

  if (gpu.new_price_usd === null) {
    return gpu.used_price_usd
  }

  if (gpu.used_price_usd === null) {
    return gpu.new_price_usd
  }

  return Math.min(gpu.new_price_usd, gpu.used_price_usd)
}

export function getDisplayPriceLabel(gpu: GPU, basis: PriceBasis = 'lowest'): DisplayPriceLabel {
  const price = getPriceForBasis(gpu, basis)

  if (price === null) {
    return 'unknown'
  }

  if (basis === 'new') {
    return 'new'
  }

  if (gpu.used_price_usd !== null && gpu.used_price_usd === price) {
    return 'used'
  }

  if (gpu.new_price_usd !== null && gpu.new_price_usd === price) {
    return 'new'
  }

  return 'unknown'
}

export function computeRawValue(tps: number | null, price: number | null): number | null {
  if (tps === null || price === null || price <= 0) {
    return null
  }

  return tps / price
}

export function computePracticalValue(gpu: GPU, basis: PriceBasis = 'lowest'): number | null {
  const rawValue = computeRawValue(gpu.tokens_per_second, getPriceForBasis(gpu, basis))

  if (rawValue === null) {
    return null
  }

  return (
    rawValue *
    qwenFitMultipliers[gpu.qwen_fit] *
    softwareSupportMultipliers[gpu.software_support] *
    noiseMultipliers[gpu.noise_level] *
    hardwarePainMultipliers[gpu.hardware_pain] *
    beginnerPainMultipliers[gpu.beginner_pain]
  )
}

export function scoreGpus(gpus: GPU[], basis: PriceBasis = 'lowest'): ScoredGPU[] {
  return gpus.map((gpu) => {
    const displayPrice = getPriceForBasis(gpu, basis)
    const rawValue = computeRawValue(gpu.tokens_per_second, displayPrice)

    return {
      ...gpu,
      display_price_usd: displayPrice,
      display_price_label: getDisplayPriceLabel(gpu, basis),
      raw_value_score: rawValue,
      tokens_per_second_per_100_usd: rawValue === null ? null : rawValue * 100,
      practical_value_score: computePracticalValue(gpu, basis),
    }
  })
}
