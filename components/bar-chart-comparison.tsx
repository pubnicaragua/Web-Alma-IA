"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Smile } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface EmotionData {
  name: string
  value: number
  color: string
}

interface BarChartComparisonProps {
  title: string
  data: EmotionData[]
  selectedEmotions: string[]
  onToggleEmotion: (emotion: string) => void
}

export function BarChartComparison({ title, data, selectedEmotions, onToggleEmotion }: BarChartComparisonProps) {
  // Valores fijos para las barras, diferentes para cada emoción
  const chartData = [
    { name: "Tristeza", value: 1500, color: "#78b6ff" },
    { name: "Felicidad", value: 3000, color: "#ffd166" },
    { name: "Estrés", value: 1000, color: "#6c757d" },
    { name: "Ansiedad", value: 2500, color: "#f4a261" },
    { name: "Enojo", value: 800, color: "#e63946" },
    { name: "Otros", value: 2000, color: "#6c757d" },
  ]

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center mb-4">
        <Smile className="mr-2 text-gray-700" />
        <h3 className="font-medium text-gray-800">{title}</h3>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {chartData.map((emotion) => (
          <Badge
            key={emotion.name}
            variant={selectedEmotions.includes(emotion.name) ? "default" : "outline"}
            className={`cursor-pointer ${
              selectedEmotions.includes(emotion.name)
                ? ""
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            }`}
            style={{
              backgroundColor: selectedEmotions.includes(emotion.name) ? emotion.color : "",
              borderColor: emotion.color,
              color: selectedEmotions.includes(emotion.name) ? "white" : "",
            }}
            onClick={() => onToggleEmotion(emotion.name)}
          >
            {emotion.name}
          </Badge>
        ))}
      </div>

      <div className="h-64 w-full overflow-x-auto">
        <ResponsiveContainer width="100%" height="100%" minWidth={320}>
          <BarChart
            data={chartData.filter((emotion) => selectedEmotions.includes(emotion.name))}
            margin={{ top: 5, right: 5, left: 0, bottom: 20 }}
            maxBarSize={50}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => (value.length > 6 ? `${value.substring(0, 6)}...` : value)}
            />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value}`, "Cantidad"]}
              labelFormatter={(name) => `${name}`}
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData
                .filter((emotion) => selectedEmotions.includes(emotion.name))
                .map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
