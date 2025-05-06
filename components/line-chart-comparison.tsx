"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"
import { useIsMobile } from "@/hooks/use-mobile"
import { themeColors } from "@/lib/theme-colors"
import { memo } from "react"

interface DataPoint {
  month: string
  courseA: number
  courseB: number
}

interface LineChartComparisonProps {
  title: string
  data: DataPoint[]
  selectedCourses: string[]
  onToggleCourse: (course: string) => void
}

// Usar memo para evitar re-renderizados innecesarios
export const LineChartComparison = memo(function LineChartComparison({
  title,
  data,
  selectedCourses,
  onToggleCourse,
}: LineChartComparisonProps) {
  const isMobile = useIsMobile()

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
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
        </ResponsiveContainer>
      </div>
    </div>
  )
})
