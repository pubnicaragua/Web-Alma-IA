"use client"

import { useEffect, useState } from "react"
import { fetchTotalAlerts, type TotalAlert } from "@/services/home-service"

interface DonutChartProps {
  initialData?: TotalAlert[]
}

export function DonutChart({ initialData }: DonutChartProps) {
  const [data, setData] = useState<TotalAlert[]>(initialData || [])
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!initialData) {
      loadData()
    }
  }, [initialData])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const alertsData = await fetchTotalAlerts()
      setData(alertsData)
    } catch (err) {
      console.error("Error al cargar datos de alertas totales:", err)
      setError("No se pudieron cargar los datos de alertas totales")
    } finally {
      setIsLoading(false)
    }
  }

  // Renderizar esqueleto durante la carga
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-blue-200 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>

        <div className="flex items-center justify-center mb-6">
          <div className="relative w-40 h-40 rounded-full bg-gray-200"></div>
        </div>

        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-200 mr-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-10"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Renderizar mensaje de error
  if (error) {
    return (
      <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-red-200">
        <h3 className="font-medium text-gray-800 mb-2">Alertas totales</h3>
        <div className="text-red-500 text-center py-4">{error}</div>
        <button
          onClick={loadData}
          className="mt-2 w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  // Renderizar mensaje si no hay datos
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-blue-200">
        <h3 className="font-medium text-gray-800 mb-2">Alertas totales</h3>
        <div className="text-gray-500 text-center py-8">No hay alertas para mostrar</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-blue-200">
      <h3 className="font-medium text-gray-800 mb-6">Alertas totales</h3>

      <div className="flex items-center justify-center mb-6">
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {data.map((segment, i) => {
              // Calculate the segment positions
              const total = data.reduce((sum, item) => sum + Number.parseFloat(item.percentage), 0)
              let startAngle = 0

              for (let j = 0; j < i; j++) {
                startAngle += (Number.parseFloat(data[j].percentage) / total) * 360
              }

              const endAngle = startAngle + (Number.parseFloat(segment.percentage) / total) * 360

              // Convert to radians
              const startRad = ((startAngle - 90) * Math.PI) / 180
              const endRad = ((endAngle - 90) * Math.PI) / 180

              // Calculate the path
              const x1 = 50 + 40 * Math.cos(startRad)
              const y1 = 50 + 40 * Math.sin(startRad)
              const x2 = 50 + 40 * Math.cos(endRad)
              const y2 = 50 + 40 * Math.sin(endRad)

              // Determine if the arc should be drawn the long way around
              const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

              // Create the path
              const d = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

              return <path key={i} d={d} fill={segment.color} />
            })}
            <circle cx="50" cy="50" r="25" fill="white" />
          </svg>
        </div>
      </div>

      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-700">{item.label}</span>
            </div>
            <span className="text-sm font-medium">{item.percentage}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
