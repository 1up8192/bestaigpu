'use client'

import { useMemo, useState } from 'react'
import { applyFilters, countActiveFilters, defaultFilterState, type FilterState } from '#/lib/filters'
import { type ScoredGPU, scoreGpus } from '#/lib/scoring'
import { FilterBar } from './FilterBar'
import { GpuTable } from './GpuTable'

interface GpuExplorerProps {
  data: ScoredGPU[]
}

export function GpuExplorer({ data }: GpuExplorerProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilterState)
  const pricedData = useMemo(() => scoreGpus(data, filters.priceBasis), [data, filters.priceBasis])
  const filteredData = useMemo(() => applyFilters(pricedData, filters), [pricedData, filters])
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters])

  return (
    <>
      <FilterBar
        filters={filters}
        activeFilterCount={activeFilterCount}
        resultCount={filteredData.length}
        totalCount={data.length}
        onChange={setFilters}
      />
      <GpuTable data={filteredData} />
    </>
  )
}
