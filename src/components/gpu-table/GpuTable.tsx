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
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
        <thead className="bg-zinc-100 text-zinc-600">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={cn(
                    'whitespace-nowrap px-4 py-3 font-medium',
                    header.column.columnDef.meta?.hideOnMobile && 'hidden md:table-cell'
                  )}
                >
                  {header.isPlaceholder ? null : (
                    <button
                      type="button"
                      className={cn(
                        'flex items-center gap-1.5 text-left',
                        header.column.getCanSort() && 'cursor-pointer hover:text-zinc-950'
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
        <tbody className="divide-y divide-zinc-200">
          {table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              <tr className="hover:bg-zinc-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn(
                      'px-4 py-4 align-top',
                      cell.column.columnDef.meta?.hideOnMobile && 'hidden md:table-cell'
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              {row.getIsExpanded() ? (
                <tr>
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
  )
}

function SortIcon({ direction }: { direction: false | 'asc' | 'desc' }) {
  if (direction === 'asc') {
    return <ArrowUp aria-hidden="true" size={14} />
  }

  if (direction === 'desc') {
    return <ArrowDown aria-hidden="true" size={14} />
  }

  return <ChevronsUpDown aria-hidden="true" className="text-zinc-400" size={14} />
}
