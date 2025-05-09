"use client"

import { useEffect, useState } from "react"
import { type ImportantDate, fetchImportantDates } from "@/services/home-service"

interface ImportantDatesProps {
  initialDates?: ImportantDate[]
}

export function ImportantDates({ initialDates }: ImportantDatesProps) {
  const [dates, setDates] = useState<ImportantDate[]>(initialDates || [])
  const [isLoading, setIsLoading] = useState(!initialDates)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Si ya tenemos datos iniciales, no necesitamos cargar
    if (initialDates) {
      return
    }

    const loadDates = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchImportantDates()
        setDates(data)
      } catch (err) {
        console.error("Error cargando fechas importantes:", err)
        setError("No se pudieron cargar las fechas importantes")
      } finally {
        setIsLoading(false)
      }
    }

    loadDates()
  }, [initialDates])

  return (
    <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-blue-200">
      <h3 className="font-medium text-gray-800 mb-4">Fechas Importantes</h3>

      {isLoading ? (
        // Estado de carga
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        // Estado de error
        <div className="py-4 text-center text-gray-500">
          <p>{error}</p>
          <button
            onClick={() =>
              fetchImportantDates()
                .then(setDates)
                .catch(() => {})
            }
            className="mt-2 text-sm text-blue-500 hover:underline"
          >
            Intentar nuevamente
          </button>
        </div>
      ) : dates.length === 0 ? (
        // Estado vacío
        <div className="py-4 text-center text-gray-500">
          <p>No hay fechas importantes para mostrar</p>
        </div>
      ) : (
        // Datos cargados
        <div className="space-y-3">
          {dates.map((date, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-700">{date.event}</span>
              <span className="text-sm text-gray-500">{date.dateRange}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
