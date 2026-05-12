import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { CsvError, parse } from 'csv-parse/sync'
import { type GpuMetrics, GpuMetricsSchema } from '../src/lib/data-schema'

await loadLocalEnv()

const SHEET_CSV_URL = process.env.SHEET_CSV_URL
const OUTPUT_PATH = process.env.GPU_IMPORT_OUTPUT_PATH || 'data/gpu-metrics.json'

type CsvRow = Record<string, string | undefined>

const numberFields = new Set<keyof GpuMetrics>([
  'new_price_usd',
  'used_price_usd',
  'tokens_per_second',
])

const enumFields = new Set<keyof GpuMetrics>(['price_mode', 'tokens_confidence'])

async function loadLocalEnv() {
  for (const filename of ['.env.local', '.env']) {
    const envPath = path.resolve(process.cwd(), filename)

    try {
      const contents = await readFile(envPath, 'utf8')
      loadEnvContents(contents)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error
      }
    }
  }
}

function loadEnvContents(contents: string) {
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    const match = /^([\w.-]+)\s*=\s*(.*)$/.exec(trimmed)

    if (!match) {
      continue
    }

    const [, key, rawValue] = match

    if (process.env[key] !== undefined) {
      continue
    }

    process.env[key] = stripEnvQuotes(rawValue)
  }
}

function stripEnvQuotes(value: string) {
  const trimmed = value.trim()
  const quote = trimmed[0]

  if ((quote === '"' || quote === "'") && trimmed.endsWith(quote)) {
    return trimmed.slice(1, -1)
  }

  return trimmed
}

async function main() {
  if (!SHEET_CSV_URL) {
    throw new Error('SHEET_CSV_URL is required')
  }

  const csv = await fetchCsv(SHEET_CSV_URL)
  const rows = parseMetricsCsv(csv)

  const metrics = rows.map((row, index) => normalizeAndValidateRow(row, index))
  const outputPath = path.resolve(process.cwd(), OUTPUT_PATH)

  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(metrics, null, 4)}\n`)

  console.info(`Imported ${metrics.length} GPU metric rows into ${OUTPUT_PATH}`)
}

async function fetchCsv(url: string): Promise<string> {
  if (url.startsWith('file://')) {
    return readFile(new URL(url), 'utf8')
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`)
  }

  const text = await response.text()
  assertCsvResponse(text, response.headers.get('content-type'))

  return text
}

function assertCsvResponse(text: string, contentType: string | null) {
  const trimmed = text.trimStart()

  if (trimmed.startsWith('<!DOCTYPE html') || trimmed.startsWith('<html')) {
    throw new Error(
      [
        'SHEET_CSV_URL returned HTML, not CSV.',
        'Use a Google Sheets published CSV URL or export URL, not the normal /edit sheet URL.',
        'Expected format: https://docs.google.com/spreadsheets/d/<sheet-id>/export?format=csv&gid=<tab-gid>',
      ].join(' ')
    )
  }

  if (contentType?.includes('text/html')) {
    throw new Error(`SHEET_CSV_URL returned content-type ${contentType}, not CSV.`)
  }
}

function parseMetricsCsv(csv: string): CsvRow[] {
  try {
    return parse(csv, {
      bom: true,
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as CsvRow[]
  } catch (error) {
    if (error instanceof CsvError) {
      throw new Error(`Failed to parse SHEET_CSV_URL as CSV: ${error.message}`)
    }

    throw error
  }
}

function normalizeAndValidateRow(row: CsvRow, index: number): GpuMetrics {
  const rowNumber = index + 2
  const normalized: Record<string, unknown> = {}

  for (const [rawKey, rawValue] of Object.entries(row)) {
    const key = rawKey.trim()
    const value = rawValue?.trim() ?? ''

    if (!key) {
      continue
    }

    normalized[key] = normalizeValue(key as keyof GpuMetrics, value)
  }

  const parsed = GpuMetricsSchema.safeParse(normalized)

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || 'row'}: ${issue.message}`)
      .join('; ')

    throw new Error(`Invalid GPU row ${rowNumber}: ${details}`)
  }

  return parsed.data
}

function normalizeValue(key: keyof GpuMetrics, value: string): unknown {
  if (numberFields.has(key)) {
    return value === '' ? null : Number(value.replaceAll(',', ''))
  }

  if (enumFields.has(key)) {
    return value.toLowerCase().replaceAll('-', '_').replaceAll(' ', '_')
  }

  return value
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
