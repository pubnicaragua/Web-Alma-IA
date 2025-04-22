"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface Column {
  key: string
  title: string
  className?: string
}

interface DataTableProps<T> {
  columns: Column[]
  data: T[]
  renderCell: (item: T, column: Column) => React.ReactNode
  className?: string
}

export function DataTable<T>({ columns, data, renderCell, className }: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-auto", className)}>
      <table className="w-full">
        <thead>
          <tr className="bg-blue-300">
            {columns.map((column) => (
              <th key={column.key} className={cn("px-4 py-3 text-left font-medium text-white", column.className)}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
              {columns.map((column) => (
                <td key={`${index}-${column.key}`} className={cn("px-4 py-3 text-sm", column.className)}>
                  {renderCell(item, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
