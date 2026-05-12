import { z } from 'zod'

export const VendorSchema = z.enum(['nvidia', 'amd', 'intel', 'apple', 'other'])
export const CategorySchema = z.enum(['consumer', 'workstation', 'server', 'experimental', 'trap'])
export const PriceModeSchema = z.enum(['new', 'used', 'new_or_used'])
export const TokensConfidenceSchema = z.enum([
  'measured',
  'community_sourced',
  'estimated',
  'spec_derived',
  'needs_verification',
])
export const QwenFitSchema = z.enum(['excellent', 'good', 'tight', 'barely', 'no'])
export const SoftwareSupportSchema = z.enum(['excellent', 'good', 'okay', 'improving', 'painful'])
export const NoiseLevelSchema = z.enum(['quiet', 'normal', 'loud', 'server_jet', 'unknown'])
export const BeginnerPainSchema = z.enum(['low', 'medium', 'high', 'trap'])
export const HardwarePainSchema = z.enum([
  'normal',
  'needs_care',
  'tinkerer',
  'janky',
  'server_mods',
])

const NullableNumberSchema = z.number().finite().nonnegative().nullable()

export const GpuSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  vendor: VendorSchema,
  category: CategorySchema,
  vram_gb: z.number().int().positive(),
  memory_bandwidth_gbps: NullableNumberSchema,
  power_w: NullableNumberSchema,
  new_price_usd: NullableNumberSchema,
  used_price_usd: NullableNumberSchema,
  price_mode: PriceModeSchema,
  price_source_url: z.string(),
  price_last_checked: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tokens_per_second: NullableNumberSchema,
  tokens_source_url: z.string(),
  tokens_confidence: TokensConfidenceSchema,
  qwen_fit: QwenFitSchema,
  software_support: SoftwareSupportSchema,
  noise_level: NoiseLevelSchema,
  beginner_pain: BeginnerPainSchema,
  hardware_pain: HardwarePainSchema,
  verdict: z.string().min(1),
  release_year: z.number().int().nullable().optional(),
  generation: z.string().optional(),
  cuda_support: z.boolean().optional(),
  rocm_support: z.boolean().optional(),
  intel_support: z.boolean().optional(),
  gaming_score: NullableNumberSchema.optional(),
  ai_only: z.boolean().optional(),
  gaming_too: z.boolean().optional(),
  affiliate_new_url: z.string().optional(),
  affiliate_used_url: z.string().optional(),
  image_url: z.string().optional(),
  strengths: z.array(z.string()).optional(),
  software_headaches: z.array(z.string()).optional(),
  hardware_headaches: z.array(z.string()).optional(),
  notes: z.string().optional(),
})

export const GpusSchema = z.array(GpuSchema)

export const GpuMetricsSchema = GpuSchema.pick({
  slug: true,
  new_price_usd: true,
  used_price_usd: true,
  price_mode: true,
  price_source_url: true,
  price_last_checked: true,
  tokens_per_second: true,
  tokens_source_url: true,
  tokens_confidence: true,
})

export const GpuStaticSchema = GpuSchema.omit({
  new_price_usd: true,
  used_price_usd: true,
  price_mode: true,
  price_source_url: true,
  price_last_checked: true,
  tokens_per_second: true,
  tokens_source_url: true,
  tokens_confidence: true,
})

export const GpuMetricsListSchema = z.array(GpuMetricsSchema)
export const GpuStaticListSchema = z.array(GpuStaticSchema)

export type Vendor = z.infer<typeof VendorSchema>
export type Category = z.infer<typeof CategorySchema>
export type PriceMode = z.infer<typeof PriceModeSchema>
export type TokensConfidence = z.infer<typeof TokensConfidenceSchema>
export type QwenFit = z.infer<typeof QwenFitSchema>
export type SoftwareSupport = z.infer<typeof SoftwareSupportSchema>
export type NoiseLevel = z.infer<typeof NoiseLevelSchema>
export type BeginnerPain = z.infer<typeof BeginnerPainSchema>
export type HardwarePain = z.infer<typeof HardwarePainSchema>
export type GPU = z.infer<typeof GpuSchema>
export type GpuMetrics = z.infer<typeof GpuMetricsSchema>
export type GpuStatic = z.infer<typeof GpuStaticSchema>
