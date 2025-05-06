"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { themeColors } from "@/lib/theme-colors"

interface EmotionData {
  name: string
  value: number
  color: string
}

interface StudentEmotionsProps {
  emotionData: EmotionData[]
  radarData: {
    alumno: number[]
    promedio: number[]
  }
}

export function StudentEmotions({ emotionData, radarData }: StudentEmotionsProps) {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(emotionData.map((e) => e.name))
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; type: string; value: number } | null>(null)

  // Valores fijos para las barras, diferentes para cada emoción con colores más vivos
  const chartData = [
    { name: "Tristeza", value: 5, color: themeColors.chart.blue },
    { name: "Felicidad", value: 18, color: themeColors.chart.yellow },
    { name: "Estrés", value: 10, color: themeColors.chart.gray },
    { name: "Ansiedad", value: 20, color: themeColors.chart.orange },
    { name: "Enojo", value: 5, color: themeColors.chart.red },
    { name: "Otros", value: 15, color: themeColors.chart.purple },
  ]

  const toggleEmotion = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter((e) => e !== emotion))
    } else {
      setSelectedEmotions([...selectedEmotions, emotion])
    }
  }

  // Datos para el gráfico de radar
  const radarLabels = ["Feliz", "Triste", "Estresada", "Enojada", "Ansiosa"]
  const maxValue = 5 // Valor máximo en la escala

  // Calcular los puntos del polígono para el alumno y el promedio
  const calculatePolygonPoints = (values: number[], maxValue = 5) => {
    const centerX = 100
    const centerY = 100
    const radius = 80

    return values
      .map((value, index) => {
        const normalizedValue = value / maxValue
        const angle = (Math.PI * 2 * index) / values.length - Math.PI / 2
        const x = centerX + radius * normalizedValue * Math.cos(angle)
        const y = centerY + radius * normalizedValue * Math.sin(angle)
        return `${x},${y}`
      })
      .join(" ")
  }

  // Calcular los puntos para las líneas de la telaraña
  const calculateWebLines = (numLevels = 5) => {
    const lines = []
    const centerX = 100
    const centerY = 100

    for (let level = 1; level <= numLevels; level++) {
      const radius = (80 * level) / numLevels
      const points = []

      for (let i = 0; i <= radarLabels.length; i++) {
        const angle = (Math.PI * 2 * i) / radarLabels.length - Math.PI / 2
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)
        points.push(`${x},${y}`)
      }

      lines.push({ points: points.join(" "), level })
    }

    return lines
  }

  // Calcular los puntos para las líneas radiales
  const calculateRadialLines = () => {
    const lines = []
    const centerX = 100
    const centerY = 100
    const radius = 80

    for (let i = 0; i < radarLabels.length; i++) {
      const angle = (Math.PI * 2 * i) / radarLabels.length - Math.PI / 2
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      lines.push(`${centerX},${centerY} ${x},${y}`)
    }

    return lines
  }

  // Calcular las posiciones de las etiquetas
  const calculateLabelPositions = () => {
    const positions = []
    const centerX = 100
    const centerY = 100
    const radius = 95

    for (let i = 0; i < radarLabels.length; i++) {
      const angle = (Math.PI * 2 * i) / radarLabels.length - Math.PI / 2
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      // Ajustar la alineación del texto según la posición
      let textAnchor = "middle"
      if (x < centerX - 10) textAnchor = "end"
      else if (x > centerX + 10) textAnchor = "start"

      positions.push({ x, y, textAnchor })
    }

    return positions
  }

  // Calcular las posiciones de los puntos de datos
  const calculateDataPoints = (values: number[], maxValue = 5) => {
    const centerX = 100
    const centerY = 100
    const radius = 80

    return values.map((value, index) => {
      const normalizedValue = value / maxValue
      const angle = (Math.PI * 2 * index) / values.length - Math.PI / 2
      const x = centerX + radius * normalizedValue * Math.cos(angle)
      const y = centerY + radius * normalizedValue * Math.sin(angle)
      return { x, y, value }
    })
  }

  // Calcular las posiciones para las etiquetas de escala
  const calculateScaleLabels = (numLevels = 5) => {
    const labels = []
    const centerX = 100
    const centerY = 100

    for (let level = 1; level <= numLevels; level++) {
      const value = (maxValue * level) / numLevels
      const radius = (80 * level) / numLevels
      // Posicionamos la etiqueta en el eje superior (ángulo -90 grados)
      const x = centerX
      const y = centerY - radius - 5 // Un poco por encima de la línea

      labels.push({ x, y, value })
    }

    return labels
  }

  const webLines = calculateWebLines()
  const radialLines = calculateRadialLines()
  const labelPositions = calculateLabelPositions()
  const alumnoPoints = calculatePolygonPoints(radarData.alumno)
  const promedioPoints = calculatePolygonPoints(radarData.promedio)
  const alumnoDataPoints = calculateDataPoints(radarData.alumno)
  const promedioDataPoints = calculateDataPoints(radarData.promedio)
  const scaleLabels = calculateScaleLabels()

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Registro emocional del alumno</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border border-blue-200">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">😊</span>
            <h4 className="text-lg font-medium">Emociones</h4>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {chartData.map((emotion, index) => (
              <Badge
                key={index}
                variant={selectedEmotions.includes(emotion.name) ? "default" : "outline"}
                className={`cursor-pointer ${selectedEmotions.includes(emotion.name) ? "" : "bg-gray-100"}`}
                style={{
                  backgroundColor: selectedEmotions.includes(emotion.name) ? emotion.color : "",
                  color: selectedEmotions.includes(emotion.name) ? "#fff" : "",
                }}
                onClick={() => toggleEmotion(emotion.name)}
              >
                {emotion.name}
              </Badge>
            ))}
          </div>

          <div className="h-64 border border-gray-100 rounded-lg p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData.filter((emotion) => selectedEmotions.includes(emotion.name))}
                margin={{ top: 5, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis hide={true} />
                <Tooltip formatter={(value) => [`${value}`, "Valor"]} labelFormatter={(name) => `${name}`} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData
                    .filter((emotion) => selectedEmotions.includes(emotion.name))
                    .map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium">Comparativa</h4>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: themeColors.chart.blue }}></div>
                <span>Alumno</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-400 mr-1"></div>
                <span>Promedio</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col h-full">
            {/* Gráfico de radar mejorado con sistema de puntuación */}
            <div className="h-64 flex justify-center items-center border border-gray-100 rounded-lg p-2">
              <svg viewBox="0 0 200 200" width="100%" height="100%">
                {/* Líneas de la telaraña con etiquetas de escala */}
                {webLines.map((line, index) => (
                  <polygon key={`web-${index}`} points={line.points} fill="none" stroke="#e5e5e5" strokeWidth="1" />
                ))}

                {/* Etiquetas de escala */}
                {scaleLabels.map((label, index) => (
                  <text
                    key={`scale-${index}`}
                    x={label.x}
                    y={label.y}
                    textAnchor="middle"
                    fontSize="8"
                    fill="#666"
                    className="select-none"
                  >
                    {label.value.toFixed(1)}
                  </text>
                ))}

                {/* Líneas radiales */}
                {radialLines.map((line, index) => (
                  <polyline key={`radial-${index}`} points={line} fill="none" stroke="#e5e5e5" strokeWidth="1" />
                ))}

                {/* Polígono del promedio (gris) */}
                <polygon points={promedioPoints} fill="rgba(128, 128, 128, 0.3)" stroke="#888888" strokeWidth="1.5" />

                {/* Polígono del alumno (azul) */}
                <polygon
                  points={alumnoPoints}
                  fill={`${themeColors.chart.blue}40`}
                  stroke={themeColors.chart.blue}
                  strokeWidth="2"
                />

                {/* Puntos de datos del promedio */}
                {promedioDataPoints.map((point, index) => (
                  <g key={`promedio-point-${index}`}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="3"
                      fill="white"
                      stroke="#888888"
                      strokeWidth="1.5"
                      onMouseEnter={() => setHoveredPoint({ index, type: "promedio", value: point.value })}
                      onMouseLeave={() => setHoveredPoint(null)}
                      style={{ cursor: "pointer" }}
                    />
                    {hoveredPoint && hoveredPoint.index === index && hoveredPoint.type === "promedio" && (
                      <g>
                        <rect
                          x={point.x + 5}
                          y={point.y - 15}
                          width="30"
                          height="20"
                          rx="4"
                          fill="white"
                          stroke="#888888"
                          strokeWidth="1"
                        />
                        <text
                          x={point.x + 20}
                          y={point.y - 2}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="bold"
                          fill="#333"
                        >
                          {point.value.toFixed(1)}
                        </text>
                      </g>
                    )}
                  </g>
                ))}

                {/* Puntos de datos del alumno */}
                {alumnoDataPoints.map((point, index) => (
                  <g key={`alumno-point-${index}`}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="3"
                      fill="white"
                      stroke={themeColors.chart.blue}
                      strokeWidth="2"
                      onMouseEnter={() => setHoveredPoint({ index, type: "alumno", value: point.value })}
                      onMouseLeave={() => setHoveredPoint(null)}
                      style={{ cursor: "pointer" }}
                    />
                    {hoveredPoint && hoveredPoint.index === index && hoveredPoint.type === "alumno" && (
                      <g>
                        <rect
                          x={point.x + 5}
                          y={point.y - 15}
                          width="30"
                          height="20"
                          rx="4"
                          fill="white"
                          stroke={themeColors.chart.blue}
                          strokeWidth="1"
                        />
                        <text
                          x={point.x + 20}
                          y={point.y - 2}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="bold"
                          fill="#333"
                        >
                          {point.value.toFixed(1)}
                        </text>
                      </g>
                    )}
                  </g>
                ))}

                {/* Etiquetas de emociones */}
                {radarLabels.map((label, index) => (
                  <text
                    key={`label-${index}`}
                    x={labelPositions[index].x}
                    y={labelPositions[index].y}
                    textAnchor={labelPositions[index].textAnchor}
                    dominantBaseline="middle"
                    fontSize="12"
                    fontWeight="500"
                    fill="#333"
                  >
                    {label}
                  </text>
                ))}
              </svg>
            </div>

            {/* Tabla de puntuaciones más compacta */}
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left px-1 py-1">Emoción</th>
                    <th className="text-center px-1 py-1">Alumno</th>
                    <th className="text-center px-1 py-1">Promedio</th>
                    <th className="text-center px-1 py-1">Dif.</th>
                  </tr>
                </thead>
                <tbody>
                  {radarLabels.map((label, index) => {
                    const alumnoValue = radarData.alumno[index]
                    const promedioValue = radarData.promedio[index]
                    const diff = alumnoValue - promedioValue
                    const diffColor = diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-gray-600"

                    return (
                      <tr key={`score-${index}`} className="border-t border-gray-100">
                        <td className="px-1 py-0.5">{label}</td>
                        <td className="text-center px-1 py-0.5 font-medium" style={{ color: themeColors.chart.blue }}>
                          {alumnoValue.toFixed(1)}
                        </td>
                        <td className="text-center px-1 py-0.5 text-gray-600">{promedioValue.toFixed(1)}</td>
                        <td className={`text-center px-1 py-0.5 font-medium ${diffColor}`}>
                          {diff > 0 ? "+" : ""}
                          {diff.toFixed(1)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
