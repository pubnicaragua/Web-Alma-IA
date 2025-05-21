/**
 * @file DataTable.tsx
 * @description Componente de tabla de datos reutilizable que permite renderizar datos tabulares
 * con columnas personalizables y renderizado de celdas flexible.
 */

"use client"

import type React from "react"
import { cn } from "@/lib/utils"

/**
 * Interfaz que define la estructura de una columna en la tabla
 * @property {string} key - Identificador único de la columna, usado para acceder a los datos
 * @property {string} title - Título que se mostrará en el encabezado de la columna
 * @property {string} [className] - Clases CSS opcionales para personalizar el estilo de la columna
 */
export interface Column {
  key: string
  title: string
  className?: string
}

/**
 * Interfaz que define las propiedades del componente DataTable
 * @template T - Tipo genérico que representa la estructura de los datos
 * @property {Column[]} columns - Array de definiciones de columnas
 * @property {T[]} data - Array de datos a mostrar en la tabla
 * @property {Function} renderCell - Función que define cómo renderizar cada celda
 * @property {string} [className] - Clases CSS opcionales para personalizar el estilo de la tabla
 * @property {boolean} [alternateRows=true] - Si es true, alterna el color de fondo de las filas
 * @property {string} [emptyMessage="No hay datos disponibles"] - Mensaje a mostrar cuando no hay datos
 */
export interface DataTableProps<T> {
  columns: Column[]
  data: T[]
  renderCell: (item: T, column: Column, index?: number) => React.ReactNode
  className?: string
  alternateRows?: boolean
  emptyMessage?: string
}

/**
 * Componente DataTable que renderiza una tabla de datos con columnas personalizables
 * @template T - Tipo genérico que representa la estructura de los datos
 * @param {DataTableProps<T>} props - Propiedades del componente
 * @returns {JSX.Element} - Tabla de datos renderizada
 */
export function DataTable<T>({
  columns,
  data,
  renderCell,
  className,
  alternateRows = true,
  emptyMessage = "No hay datos disponibles",
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-auto", className)}>
      <table className="w-full">
        {/* Encabezado de la tabla */}
        <thead>
          <tr className="bg-blue-300">
            {columns.map((column) => (
              <th key={column.key} className={cn("px-4 py-3 text-left font-medium text-white", column.className)}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        {/* Cuerpo de la tabla */}
        <tbody>
          {data.length > 0 ? (
            // Renderiza las filas si hay datos
            data.map((item, index) => (
              <tr
                key={index}
                className={cn(
                  "border-b-2 border-gray-200 hover:bg-gray-50",
                  alternateRows && index % 2 === 1 ? "bg-gray-50" : "",
                )}
              >
                {columns.map((column) => (
                  <td key={`${index}-${column.key}`} className={cn("px-4 py-4 text-sm", column.className)}>
                    {renderCell(item, column, index)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            // Muestra un mensaje si no hay datos
            <tr>
              <td colSpan={columns.length} className="px-4 py-4 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
