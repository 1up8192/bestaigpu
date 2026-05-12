import { createColumnHelper, type RowData, type SortingFn } from '@tanstack/react-table'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { formatInteger, formatPrice, formatScore, formatTps, formatValueScore } from '#/lib/format'
import type { ScoredGPU } from '#/lib/scoring'
import { ConfidenceDot, FitBadge, SoftwareBadge, VerdictBadge } from './badges'

const columnHelper = createColumnHelper<ScoredGPU>()

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    hideOnMobile?: boolean
  }
}

const qwenFitRank: Record<ScoredGPU['qwen_fit'], number> = {
  no: 0,
  barely: 1,
  tight: 2,
  good: 3,
  excellent: 4,
}

const softwareRank: Record<ScoredGPU['software_support'], number> = {
  painful: 0,
  improving: 1,
  okay: 2,
  good: 3,
  excellent: 4,
}

const noiseRank: Record<ScoredGPU['noise_level'], number> = {
  server_jet: 0,
  loud: 1,
  unknown: 2,
  normal: 3,
  quiet: 4,
}

const beginnerPainRank: Record<ScoredGPU['beginner_pain'], number> = {
  trap: 0,
  high: 1,
  medium: 2,
  low: 3,
}

const numericSort: SortingFn<ScoredGPU> = (rowA, rowB, columnId) => {
  const a = rowA.getValue<number | null>(columnId)
  const b = rowB.getValue<number | null>(columnId)

  return (a ?? Number.NEGATIVE_INFINITY) - (b ?? Number.NEGATIVE_INFINITY)
}

function label(value: string) {
  return value.replaceAll('_', ' ')
}

export const gpuColumns = [
  columnHelper.accessor('name', {
    id: 'name',
    header: 'GPU',
    cell: (info) => (
      <button
        type="button"
        className="inline-flex items-center gap-2 whitespace-nowrap text-left font-semibold text-[var(--color-text-bright)] hover:text-[var(--color-link)]"
        onClick={info.row.getToggleExpandedHandler()}
      >
        {info.row.getIsExpanded() ? (
          <ChevronDown aria-hidden="true" className="shrink-0" size={16} />
        ) : (
          <ChevronRight aria-hidden="true" className="shrink-0" size={16} />
        )}
        {info.getValue()}
      </button>
    ),
  }),
  columnHelper.accessor('vram_gb', {
    header: 'VRAM',
    cell: (info) => `${info.getValue()}GB`,
    sortingFn: numericSort,
  }),
  columnHelper.accessor('new_price_usd', {
    header: 'New price',
    cell: (info) => formatPrice(info.getValue()),
    sortingFn: numericSort,
  }),
  columnHelper.accessor('used_price_usd', {
    header: 'Used price',
    cell: (info) => formatPrice(info.getValue()),
    sortingFn: numericSort,
  }),
  columnHelper.accessor('tokens_per_second', {
    header: 'Tokens/s',
    cell: (info) => (
      <span className="inline-flex items-center gap-2">
        <ConfidenceDot value={info.row.original.tokens_confidence} />
        {formatTps(info.getValue())}
      </span>
    ),
    sortingFn: numericSort,
  }),
  columnHelper.accessor('tokens_per_second_per_100_usd', {
    header: 'Tokens/s per $100',
    cell: (info) => formatScore(info.getValue()),
    meta: {
      hideOnMobile: true,
    },
    sortingFn: numericSort,
  }),
  columnHelper.accessor('practical_value_score', {
    header: 'Value score',
    cell: (info) => (
      <span className="font-semibold text-[var(--color-yellow)]">
        {formatValueScore(info.getValue())}
      </span>
    ),
    sortingFn: numericSort,
  }),
  columnHelper.accessor('qwen_fit', {
    header: 'Model fit',
    cell: (info) => <FitBadge value={info.getValue()} />,
    meta: {
      hideOnMobile: true,
    },
    sortingFn: (rowA, rowB, columnId) =>
      qwenFitRank[rowA.getValue<ScoredGPU['qwen_fit']>(columnId)] -
      qwenFitRank[rowB.getValue<ScoredGPU['qwen_fit']>(columnId)],
  }),
  columnHelper.accessor('power_w', {
    header: 'Power',
    cell: (info) => `${formatInteger(info.getValue())}W`,
    meta: {
      hideOnMobile: true,
    },
    sortingFn: numericSort,
  }),
  columnHelper.accessor('memory_bandwidth_gbps', {
    header: 'Mem bandwidth',
    cell: (info) => `${formatInteger(info.getValue())} GB/s`,
    meta: {
      hideOnMobile: true,
    },
    sortingFn: numericSort,
  }),
  columnHelper.accessor('software_support', {
    header: 'Software',
    cell: (info) => <SoftwareBadge value={info.getValue()} />,
    meta: {
      hideOnMobile: true,
    },
    sortingFn: (rowA, rowB, columnId) =>
      softwareRank[rowA.getValue<ScoredGPU['software_support']>(columnId)] -
      softwareRank[rowB.getValue<ScoredGPU['software_support']>(columnId)],
  }),
  columnHelper.accessor('noise_level', {
    header: 'Noise',
    cell: (info) => <span className="capitalize">{label(info.getValue())}</span>,
    meta: {
      hideOnMobile: true,
    },
    sortingFn: (rowA, rowB, columnId) =>
      noiseRank[rowA.getValue<ScoredGPU['noise_level']>(columnId)] -
      noiseRank[rowB.getValue<ScoredGPU['noise_level']>(columnId)],
  }),
  columnHelper.accessor('beginner_pain', {
    header: 'Beginner pain',
    cell: (info) => <VerdictBadge value={info.getValue()} />,
    meta: {
      hideOnMobile: true,
    },
    sortingFn: (rowA, rowB, columnId) =>
      beginnerPainRank[rowA.getValue<ScoredGPU['beginner_pain']>(columnId)] -
      beginnerPainRank[rowB.getValue<ScoredGPU['beginner_pain']>(columnId)],
  }),
  columnHelper.accessor('verdict', {
    header: 'Verdict',
    cell: (info) => <span className="text-[var(--color-text)]">{info.getValue()}</span>,
    enableSorting: false,
  }),
]
