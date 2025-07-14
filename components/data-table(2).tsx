"use client";

import type React from "react";
import { cn } from "@/lib/utils";

interface Column {
  key: string;
  title: string;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column[];
  data: T[];
  renderCell: (item: T, column: Column, index?: number) => React.ReactNode;
  className?: string;
  alternateRows?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  renderCell,
  className,
  alternateRows = true,
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-auto", className)}>
      <table className="w-full">
        <thead>
          <tr className="bg-blue-300">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  "px-4 py-3 text-left font-medium text-white",
                  column.className
                )}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={cn(
                "border-b-2 border-gray-200 hover:bg-gray-50",
                alternateRows && index % 2 === 1 ? "bg-gray-50" : ""
              )}
            >
              {columns.map((column) => (
                <td
                  key={`${index}-${column.key}`}
                  className={cn("px-4 py-4 text-sm", column.className)}
                >
                  {renderCell(item, column, index)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
