import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { parse } from 'csv-parse/sync'
import { type GPU, GpuSchema } from '../src/lib/data-schema'

await loadLocalEnv()

const SHEET_CSV_URL = process.env.SHEET_CSV_URL
const OUTPUT_PATH = process.env.GPU_IMPORT_OUTPUT_PATH || 'src/data/gpus.json'

type CsvRow = Record<string, string | undefined>

const numberFields = new Set<keyof GPU>([
  'vram_gb',
  'memory_bandwidth_gbps',
  'power_w',
  'new_price_usd',
  'used_price_usd',
  'tokens_per_second',
  'release_year',
  'gaming_score',
])

const booleanFields = new Set<keyof GPU>([
  'cuda_support',
  'rocm_support',
  'intel_support',
  'ai_only',
  'gaming_too',
])

const arrayFields = new Set<keyof GPU>(['strengths', 'software_headaches', 'hardware_headaches'])

const enumFields = new Set<keyof GPU>([
  'vendor',
  'category',
  'price_mode',
  'tokens_confidence',
  'qwen_fit',
  'software_support',
  'noise_level',
  'beginner_pain',
  'hardware_pain',
])

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
  const rows = parse(csv, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[]

  const warnings: string[] = []
  const gpus = rows.map((row, index) => normalizeAndValidateRow(row, index, warnings))
  const outputPath = path.resolve(process.cwd(), OUTPUT_PATH)

  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(gpus, null, 2)}\n`)

  console.info(`Imported ${gpus.length} GPU rows into ${OUTPUT_PATH}`)

  if (warnings.length > 0) {
    console.warn(`Warnings (${warnings.length}):`)
    for (const warning of warnings) {
      console.warn(`- ${warning}`)
    }
  }
}

async function fetchCsv(url: string): Promise<string> {
  if (url.startsWith('file://')) {
    return readFile(new URL(url), 'utf8')
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`)
  }

  return response.text()
}

function normalizeAndValidateRow(row: CsvRow, index: number, warnings: string[]): GPU {
  const rowNumber = index + 2
  const normalized: Record<string, unknown> = {}

  for (const [rawKey, rawValue] of Object.entries(row)) {
    const key = rawKey.trim()
    const value = rawValue?.trim() ?? ''

    if (!key) {
      continue
    }

    normalized[key] = normalizeValue(key as keyof GPU, value)
  }

  for (const field of ['strengths', 'software_headaches', 'hardware_headaches'] satisfies Array<
    keyof GPU
  >) {
    if (!Array.isArray(normalized[field])) {
      normalized[field] = []
      warnings.push(`row ${rowNumber}: optional list field ${field} is empty`)
    }
  }

  const parsed = GpuSchema.safeParse(normalized)

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || 'row'}: ${issue.message}`)
      .join('; ')

    throw new Error(`Invalid GPU row ${rowNumber}: ${details}`)
  }

  return parsed.data
}

function normalizeValue(key: keyof GPU, value: string): unknown {
  if (numberFields.has(key)) {
    return value === '' ? null : Number(value.replaceAll(',', ''))
  }

  if (booleanFields.has(key)) {
    if (value === '') {
      return undefined
    }

    return ['1', 'true', 'yes', 'y'].includes(value.toLowerCase())
  }

  if (arrayFields.has(key)) {
    return value
      .split(';')
      .map((item) => item.trim())
      .filter(Boolean)
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
