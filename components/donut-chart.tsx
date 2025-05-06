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
        <div className="relative w-56 h-56">
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

            {/* Texto central */}
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xl font-bold fill-gray-800"
            >
              {enhancedData.reduce((sum, item) => sum + item.value, 0)}
            </text>
            <text x="50" y="60" textAnchor="middle" dominantBaseline="middle" className="text-xs fill-gray-500">
              Total
            </text>

            {/* Textos en cada segmento */}
            {enhancedData.map((segment, i) => {
              // Calculate position for text
              const total = enhancedData.reduce((sum, item) => sum + Number.parseFloat(item.percentage), 0)
              const segmentAngle = (Number.parseFloat(segment.percentage) / total) * 360
              const midAngle =
                (((i > 0
                  ? (enhancedData.slice(0, i).reduce((sum, item) => sum + Number.parseFloat(item.percentage), 0) /
                      total) *
                    360
                  : 0) +
                  segmentAngle / 2 -
                  90) *
                  Math.PI) /
                180

              // Position text in the middle of each segment
              const textRadius = 32.5 // Halfway between inner and outer radius
              const textX = 50 + textRadius * Math.cos(midAngle)
              const textY = 50 + textRadius * Math.sin(midAngle)

              // Only show percentage for segments large enough to fit text
              if (segmentAngle < 30) return null

              return (
                <text
                  key={`text-${i}`}
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-medium fill-white"
                  style={{ textShadow: "0px 0px 2px rgba(0,0,0,0.5)" }}
                >
                  {segment.percentage}
                </text>
              )
            })}
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {enhancedData.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-gray-700 truncate">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
