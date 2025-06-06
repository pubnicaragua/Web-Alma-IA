"use client"

import { Badge } from "@/components/ui/badge"
import { useIsMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import { themeColors } from "@/lib/theme-colors"
import { fetchTotalAlertsHistoricoChartLine } from "@/services/alerts-service"
import { memo, useEffect, useState } from "react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export interface DataPoint {
  month: string
  vencidas: number
  atendidas: number
}

interface LineChartHistoryProps {
  title: string
  data?: DataPoint[]
  selectedCourses: string[]
  onToggleCourse: (course: string) => void
}

// Datos para el gráfico de líneas

const alertsData = [
  { month: "Ene", vencidas: 1200, atendidas: 1500 },
  { month: "Feb", vencidas: 900, atendidas: 1200 },
  { month: "Mar", vencidas: 1500, atendidas: 1000 },
  { month: "Abr", vencidas: 2000, atendidas: 1800 },
  { month: "May", vencidas: 3000, atendidas: 2500 },
  { month: "Jun", vencidas: 2500, atendidas: 2800 },
  { month: "Jul", vencidas: 2800, atendidas: 3200 },
]

// Usar memo para evitar re-renderizados innecesarios
export const LineChartHistory = memo(function LineChartComparison({
  title,
  selectedCourses,
  onToggleCourse,
}: LineChartHistoryProps) {
  const isMobile = useIsMobile()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [apiData, setApiData] = useState<DataPoint[]>([])
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const alertsData = await fetchTotalAlertsHistoricoChartLine()
      setApiData(alertsData)
    } catch (err) {
      setError("No se pudieron cargar los datos de alertas. Intente nuevamente.")

      // Mostrar notificación de error
      toast({
        title: "Error al cargar datos",
        description: "No se pudieron cargar los datos de las alertas. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-green-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <div className="flex gap-2">
          <Badge
            variant={selectedCourses.includes("vencidas") ? "default" : "outline"}
            className={`cursor-pointer ${
              selectedCourses.includes("vencidas")
                ? "bg-red-500"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            }`}
            onClick={() => onToggleCourse("vencidas")}
            style={{
              backgroundColor: selectedCourses.includes("vencidas") ? themeColors.chart.red : "",
            }}
          >
            Vencidas
          </Badge>
          <Badge
            variant={selectedCourses.includes("atendidas") ? "default" : "outline"}
            className={`cursor-pointer ${
              selectedCourses.includes("atendidas")
                ? "bg-green-500"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            }`}
            onClick={() => onToggleCourse("atendidas")}
            style={{
              backgroundColor: selectedCourses.includes("atendidas") ? themeColors.chart.green : "",
            }}
          >
            Atendidas
          </Badge>
        </div>
      </div>

      <div className="h-64 w-full">
        {/* Eliminar el ancho fijo para móviles y usar un enfoque más adaptable */}
        {apiData.length ? <ResponsiveContainer width="100%" height="100%">
          <LineChart data={apiData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [value, name === "vencidas" ? "Vencidas" : "Atendidas"]}
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
            />
            {selectedCourses.includes("vencidas") && (
              <Line
                type="monotone"
                dataKey="vencidas"
                stroke={themeColors.chart.red}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
            {selectedCourses.includes("atendidas") && (
              <Line
                type="monotone"
                dataKey="atendidas"
                stroke={themeColors.chart.green}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                strokeDasharray="5 5"
              />
            )}
          </LineChart>
        </ResponsiveContainer> : <div className="bg-green-500 rounded-md p-2">
          <h1 className="font-medium text-white">{error}</h1>
        </div>}
      </div>
    </div>
  )
})
