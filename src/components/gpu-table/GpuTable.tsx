'use client'

import {
  type ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { Fragment, useState } from 'react'
import { cn } from '#/lib/cn'
import type { ScoredGPU } from '#/lib/scoring'
import { gpuColumns } from './columns'
import { GpuRowDetails } from './GpuRowDetails'

interface GpuTableProps {
  data: ScoredGPU[]
}

export function GpuTable({ data }: GpuTableProps) {
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'practical_value_score',
      desc: true,
    },
  ])

  const table = useReactTable({
    data,
    columns: gpuColumns,
    state: {
      expanded,
      sorting,
    },
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="mt-8 space-y-1 xl:mx-6">
      <p
        aria-hidden="true"
        className="overflow-hidden whitespace-nowrap text-[var(--color-line)] text-sm"
      >
        {'+-'}
        {'-'.repeat(154)}
        {'-+'}
      </p>
      <div className="overflow-x-auto border border-[var(--color-line)] bg-[var(--color-canvas)]">
        <table className="w-full min-w-[1380px] border-collapse text-left text-sm">
          <thead className="bg-[var(--color-panel)] text-[var(--color-accent)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className="border-[var(--color-line)] border-b" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      'whitespace-nowrap border-[var(--color-line)] border-r px-3 py-3 font-semibold uppercase tracking-[1px] last:border-r-0',
                      header.column.columnDef.meta?.hideOnMobile && 'hidden md:table-cell'
                    )}
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        className={cn(
                          'flex items-center gap-1.5 text-left',
                          header.column.getCanSort() &&
                            'cursor-pointer hover:text-[var(--color-text-bright)]'
                        )}
                        disabled={!header.column.getCanSort()}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() ? (
                          <SortIcon direction={header.column.getIsSorted()} />
                        ) : null}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <tr className="border-[var(--color-line)] border-b hover:bg-[var(--color-panel)]">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        'border-[var(--color-line)] border-r px-3 py-2.5 align-middle last:border-r-0',
                        cell.column.columnDef.meta?.hideOnMobile && 'hidden md:table-cell'
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
                {row.getIsExpanded() ? (
                  <tr className="border-[var(--color-line)] border-b">
                    <td className="p-0" colSpan={row.getVisibleCells().length}>
                      <GpuRowDetails gpu={row.original} />
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <p
        aria-hidden="true"
        className="overflow-hidden whitespace-nowrap text-[var(--color-line)] text-sm"
      >
        {'+-'}
        {'-'.repeat(154)}
        {'-+'}
      </p>
    </div>
  )
}

function SortIcon({ direction }: { direction: false | 'asc' | 'desc' }) {
  if (direction === 'asc') {
    return <ArrowUp aria-hidden="true" size={14} />
  }

  if (direction === 'desc') {
    return <ArrowDown aria-hidden="true" size={14} />
  }

  return <ChevronsUpDown aria-hidden="true" className="text-[var(--color-text-dim)]" size={14} />
}
