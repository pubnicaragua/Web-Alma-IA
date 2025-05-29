"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { AlertCircle, RefreshCw } from "lucide-react"
import { fetchTotalAlerts, type TotalAlert } from "@/services/home-service"
import { useToast } from "@/hooks/use-toast"
import { DonutChartSkeleton } from "./donut-chart-skeleton"

interface DonutChartProps {
  title?: string
  initialData?: TotalAlert[]
}

export function DonutChart({ title = "Distribución de alertas", initialData }: DonutChartProps) {
  const [data, setData] = useState<TotalAlert[]>(initialData || [])
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

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
      console.error("Error al cargar las alertas totales:", err)
      setError("No se pudieron cargar los datos de alertas. Intente nuevamente.")

      // Mostrar notificación de error
      toast({
        title: "Error al cargar datos",
        description: "No se pudieron cargar los datos de alertas. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Renderizar esqueleto durante la carga
  if (isLoading) {
    return <DonutChartSkeleton />
  }

  // Renderizar mensaje de error
  if (error) {
    return (
      <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-red-200">
        <div className="flex items-center mb-4">
          <AlertCircle className="mr-2 text-red-500" />
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={loadData}
          className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Reintentar
        </button>
      </div>
    )
  }

  // Renderizar mensaje si no hay datos
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-blue-200">
        <div className="flex items-center mb-4">
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
        <div className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-100 text-lg font-medium text-center py-6 px-4 rounded-md">
          No hay datos de alertas disponibles.
        </div>
      </div>
    )
  }

  // Preparar datos para el gráfico
  const chartData = data.map((item) => ({
    name: item.label,
    value: item.value,
    color: item.color,
    percentage: item.percentage,
  }))

  // Renderizar el gráfico
  return (
    <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-blue-200">
      <h3 className="font-medium text-gray-800 mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={false} // Eliminar las etiquetas alrededor del gráfico
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              formatter={(value, entry, index) => {
                const item = chartData[index]
                return (
                  <span className="text-sm">
                    {item.name} ({item.percentage})
                  </span>
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
