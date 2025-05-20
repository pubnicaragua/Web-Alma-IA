"use client"

import { Badge } from "@/components/ui/badge"
import { useIsMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import { themeColors } from "@/lib/theme-colors"
import { fetchTotalAlertsChartLine } from "@/services/alerts-service"
import { memo, useEffect, useState } from "react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export interface DataPoint {
  month: string
  courseA: number
  courseB: number
}

interface LineChartComparisonProps {
  title: string
  data?: DataPoint[]
  selectedCourses: string[]
  onToggleCourse: (course: string) => void
}

// Datos para el gráfico de líneas

const alertsData = [
  { month: "Ene", courseA: 1200, courseB: 1500 },
  { month: "Feb", courseA: 900, courseB: 1200 },
  { month: "Mar", courseA: 1500, courseB: 1000 },
  { month: "Abr", courseA: 2000, courseB: 1800 },
  { month: "May", courseA: 3000, courseB: 2500 },
  { month: "Jun", courseA: 2500, courseB: 2800 },
  { month: "Jul", courseA: 2800, courseB: 3200 },
]

// Usar memo para evitar re-renderizados innecesarios
export const LineChartComparison = memo(function LineChartComparison({
  title,
  selectedCourses,
  onToggleCourse,
}: LineChartComparisonProps) {
  const isMobile = useIsMobile()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [apiData, setApiData] = useState<DataPoint[]>([])
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const alertsData = await fetchTotalAlertsChartLine()
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
    <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <div className="flex gap-2">
          <Badge
            variant={selectedCourses.includes("courseA") ? "default" : "outline"}
            className={`cursor-pointer ${
              selectedCourses.includes("courseA")
                ? "bg-green-500"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            }`}
            onClick={() => onToggleCourse("courseA")}
            style={{
              backgroundColor: selectedCourses.includes("courseA") ? themeColors.chart.green : "",
            }}
          >
            Curso A
          </Badge>
          <Badge
            variant={selectedCourses.includes("courseB") ? "default" : "outline"}
            className={`cursor-pointer ${
              selectedCourses.includes("courseB")
                ? "bg-blue-500"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            }`}
            onClick={() => onToggleCourse("courseB")}
            style={{
              backgroundColor: selectedCourses.includes("courseB") ? themeColors.chart.blue : "",
            }}
          >
            Curso B
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
              formatter={(value, name) => [value, name === "courseA" ? "Curso A" : "Curso B"]}
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
            />
            {selectedCourses.includes("courseA") && (
              <Line
                type="monotone"
                dataKey="courseA"
                stroke={themeColors.chart.green}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
            {selectedCourses.includes("courseB") && (
              <Line
                type="monotone"
                dataKey="courseB"
                stroke={themeColors.chart.blue}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                strokeDasharray="5 5"
              />
            )}
          </LineChart>
        </ResponsiveContainer> : <div className="bg-blue-500 rounded-md p-2">
          <h1 className="font-medium text-white">{error}</h1>
        </div>}
      </div>
    </div>
  )
})
