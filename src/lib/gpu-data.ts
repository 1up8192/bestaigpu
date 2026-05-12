import gpuMetricsJson from '../../data/gpu-metrics.json'
import gpuStaticJson from '../../data/gpu-static.json'
import {
  type GPU,
  type GpuMetrics,
  GpuMetricsListSchema,
  type GpuStatic,
  GpuStaticListSchema,
  GpusSchema,
} from './data-schema'

const staticGpus = GpuStaticListSchema.parse(gpuStaticJson)
const gpuMetrics = GpuMetricsListSchema.parse(gpuMetricsJson)

export const gpus = composeGpus(staticGpus, gpuMetrics)

export function composeGpus(staticRows: GpuStatic[], metricRows: GpuMetrics[]): GPU[] {
  const staticBySlug = new Map<string, GpuStatic>()
  const metricsBySlug = new Map<string, GpuMetrics>()

  for (const row of staticRows) {
    if (staticBySlug.has(row.slug)) {
      throw new Error(`Duplicate static GPU slug: ${row.slug}`)
    }

    staticBySlug.set(row.slug, row)
  }

  for (const row of metricRows) {
    if (metricsBySlug.has(row.slug)) {
      throw new Error(`Duplicate GPU metrics slug: ${row.slug}`)
    }

    metricsBySlug.set(row.slug, row)
  }

  const missingMetrics = staticRows
    .filter((row) => !metricsBySlug.has(row.slug))
    .map((row) => row.slug)

  if (missingMetrics.length > 0) {
    throw new Error(`Missing GPU metrics for: ${missingMetrics.join(', ')}`)
  }

  const unusedMetrics = metricRows
    .filter((row) => !staticBySlug.has(row.slug))
    .map((row) => row.slug)

  if (unusedMetrics.length > 0) {
    throw new Error(`Metrics rows without static GPU data: ${unusedMetrics.join(', ')}`)
  }

  return GpusSchema.parse(staticRows.map((row) => ({ ...row, ...metricsBySlug.get(row.slug)! })))
}
