'use client'

import { ReactNode } from 'react'

interface TableColumn<T> {
  key: keyof T
  label: string
  width?: string
  render?: (value: any, row: T) => ReactNode
  sortable?: boolean
  mobileLabel?: string
}

interface ResponsiveTableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  keyExtractor: (item: T, idx: number) => string | number
  onRowClick?: (item: T) => void
  striped?: boolean
  hoverable?: boolean
  loading?: boolean
  emptyMessage?: string
}

export function ResponsiveTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  striped = true,
  hoverable = true,
  loading = false,
  emptyMessage = 'No data available',
}: ResponsiveTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500 text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto custom-scroll">
      {/* Desktop view */}
      <table className="w-full hidden md:table">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map(col => (
              <th
                key={String(col.key)}
                className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider"
                style={{ width: col.width }}
              >
                {col.label}
                {col.sortable && <span className="ml-1 text-gray-400">↕</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, idx) => (
            <tr
              key={keyExtractor(item, idx)}
              onClick={() => onRowClick?.(item)}
              className={`
                transition-colors
                ${hoverable && onRowClick ? 'cursor-pointer hover:bg-gold/5' : ''}
                ${striped && idx % 2 === 1 ? 'bg-gray-50' : ''}
              `}
            >
              {columns.map(col => (
                <td key={String(col.key)} className="px-4 py-3 text-sm text-gray-700">
                  {col.render ? col.render(item[col.key], item) : String(item[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile view */}
      <div className="md:hidden space-y-3">
        {data.map((item, idx) => (
          <div
            key={keyExtractor(item, idx)}
            onClick={() => onRowClick?.(item)}
            className={`
              card !p-3
              ${hoverable && onRowClick ? 'cursor-pointer' : ''}
            `}
          >
            {columns.map(col => (
              <div key={String(col.key)} className="flex justify-between items-start gap-2 py-1">
                <span className="text-xs font-semibold text-gray-600">
                  {col.mobileLabel || col.label}
                </span>
                <span className="text-sm text-gray-900 font-medium text-right">
                  {col.render ? col.render(item[col.key], item) : String(item[col.key])}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
