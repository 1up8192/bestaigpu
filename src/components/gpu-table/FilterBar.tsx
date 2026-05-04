import { RotateCcw } from 'lucide-react'
import { cn } from '#/lib/cn'
import {
  defaultFilterState,
  type FilterState,
  type PriceBracket,
  type VramFilter,
} from '#/lib/filters'

interface FilterBarProps {
  filters: FilterState
  activeFilterCount: number
  resultCount: number
  totalCount: number
  onChange: (filters: FilterState) => void
}

const beginnerOptions = [
  { value: 'all', label: 'All' },
  { value: 'beginner_safe', label: 'Beginner-safe' },
  { value: 'tinker', label: 'Tinker cards' },
] as const

const priceBasisOptions = [
  { value: 'lowest', label: 'Lowest price' },
  { value: 'new', label: 'New price only' },
] as const

const priceOptions = [
  { value: 'all', label: 'All prices' },
  { value: 'under_300', label: 'Under $300' },
  { value: 'under_500', label: 'Under $500' },
  { value: 'under_800', label: 'Under $800' },
  { value: 'under_1200', label: 'Under $1200' },
  { value: 'premium', label: 'Premium' },
] as const satisfies ReadonlyArray<{ value: PriceBracket; label: string }>

const vramOptions = [
  { value: '24_plus', label: '24GB+' },
  { value: 'all', label: 'All VRAM' },
  { value: '24', label: '24GB only' },
  { value: '32', label: '32GB' },
  { value: '40_plus', label: '40GB+' },
  { value: '48_plus', label: '48GB+' },
  { value: '16', label: '16GB' },
  { value: '12', label: '12GB' },
] as const satisfies ReadonlyArray<{ value: VramFilter; label: string }>

export function FilterBar({ filters, activeFilterCount, resultCount, totalCount, onChange }: FilterBarProps) {
  return (
    <div className="mb-5 space-y-4 rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-sm text-zinc-950">
            Showing {resultCount} of {totalCount} GPUs
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Default view is 24GB+ for the Qwen3.6-27B scoring target.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex w-fit items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 font-medium text-sm text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={activeFilterCount === 0}
          onClick={() => onChange(defaultFilterState)}
        >
          <RotateCcw aria-hidden="true" size={15} />
          Clear filters
          {activeFilterCount > 0 ? (
            <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">{activeFilterCount}</span>
          ) : null}
        </button>
      </div>

      <FilterGroup label="Beginner fit">
        {beginnerOptions.map((option) => (
          <FilterButton
            key={option.value}
            active={filters.beginnerMode === option.value}
            onClick={() => onChange({ ...filters, beginnerMode: option.value })}
          >
            {option.label}
          </FilterButton>
        ))}
      </FilterGroup>

      <FilterGroup label="Price basis">
        {priceBasisOptions.map((option) => (
          <FilterButton
            key={option.value}
            active={filters.priceBasis === option.value}
            onClick={() => onChange({ ...filters, priceBasis: option.value })}
          >
            {option.label}
          </FilterButton>
        ))}
      </FilterGroup>

      <FilterGroup label="Price">
        {priceOptions.map((option) => (
          <FilterButton
            key={option.value}
            active={filters.priceBracket === option.value}
            onClick={() => onChange({ ...filters, priceBracket: option.value })}
          >
            {option.label}
          </FilterButton>
        ))}
      </FilterGroup>

      <FilterGroup label="VRAM">
        {vramOptions.map((option) => (
          <FilterButton
            key={option.value}
            active={filters.vram === option.value}
            onClick={() => onChange({ ...filters, vram: option.value })}
          >
            {option.label}
          </FilterButton>
        ))}
      </FilterGroup>
    </div>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <p className="w-28 shrink-0 font-medium text-sm text-zinc-600">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={cn(
        'rounded-md border px-3 py-1.5 font-medium text-sm transition-colors',
        active
          ? 'border-emerald-700 bg-emerald-100 text-emerald-950'
          : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
