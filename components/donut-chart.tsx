"use client"

import { themeColors } from "@/lib/theme-colors"

interface DonutChartProps {
  data: {
    label: string
    value: number
    percentage: string
    color: string
  }[]
}

export function DonutChart({ data }: DonutChartProps) {
  // Usar colores más vivos del sistema global
  const enhancedData = [
    { label: data[0].label, value: data[0].value, percentage: data[0].percentage, color: themeColors.chart.yellow },
    { label: data[1].label, value: data[1].value, percentage: data[1].percentage, color: themeColors.chart.green },
    { label: data[2].label, value: data[2].value, percentage: data[2].percentage, color: themeColors.primary.main },
    { label: data[3].label, value: data[3].value, percentage: data[3].percentage, color: themeColors.chart.purple },
  ]

  return (
    <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-blue-200">
      <h3 className="font-medium text-gray-800 mb-6">Alertas totales</h3>

      <div className="flex items-center justify-center mb-6">
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {enhancedData.map((segment, i) => {
              // Calculate the segment positions
              const total = enhancedData.reduce((sum, item) => sum + Number.parseFloat(item.percentage), 0)
              let startAngle = 0

              for (let j = 0; j < i; j++) {
                startAngle += (Number.parseFloat(enhancedData[j].percentage) / total) * 360
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
        {enhancedData.map((item, index) => (
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
