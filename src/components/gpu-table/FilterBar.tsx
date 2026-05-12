'use client'

import { ChevronDown, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
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

export function FilterBar({
  filters,
  activeFilterCount,
  resultCount,
  totalCount,
  onChange,
}: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-3 py-3">
        <p className="text-[var(--color-text-dim)] text-sm">
          <span className="text-[var(--color-green)]">&gt;</span> Showing{' '}
          <span className="font-medium text-[var(--color-text-bright)]">{resultCount}</span> of{' '}
          {totalCount} GPUs
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className={cn(
              'inline-flex items-center gap-1.5 border px-2.5 py-1.5 font-medium text-sm transition-colors',
              isOpen
                ? 'border-[var(--color-green)] bg-transparent text-[var(--color-text-bright)]'
                : 'border-[var(--color-line)] bg-transparent text-[var(--color-text)] hover:border-[var(--color-text-dim)] hover:text-[var(--color-text-bright)]'
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            <SlidersHorizontal aria-hidden="true" size={13} />
            Filters
            <ChevronDown
              aria-hidden="true"
              size={13}
              className={cn('transition-transform', isOpen && 'rotate-180')}
            />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-3 border-[var(--color-line)] border-t py-3">
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

          <div className="border-[var(--color-line)] border-t pt-3">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 border border-[var(--color-line)] px-2.5 py-1.5 text-[var(--color-text)] text-sm hover:border-[var(--color-text-dim)] hover:text-[var(--color-text-bright)] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={activeFilterCount === 0}
              onClick={() => onChange(defaultFilterState)}
            >
              <RotateCcw aria-hidden="true" size={13} />
              Clear filters
              {activeFilterCount > 0 ? (
                <span className="px-1 py-0.5 font-medium text-[var(--color-green)] text-xs">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <p className="w-28 shrink-0 text-[var(--color-accent)] text-sm uppercase tracking-[2px]">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
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
        'border px-2.5 py-1 text-sm transition-colors',
        active
          ? 'border-[var(--color-green)] bg-transparent font-medium text-[var(--color-green)]'
          : 'border-[var(--color-line)] bg-transparent text-[var(--color-text)] hover:border-[var(--color-text-dim)] hover:text-[var(--color-text-bright)]'
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
