"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
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
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center mb-4">
        <Smile className="mr-2 text-gray-700" />
        <h3 className="font-medium text-gray-800">{title}</h3>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {data.map((emotion) => (
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

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.filter((emotion) => selectedEmotions.includes(emotion.name))}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value}`, "Cantidad"]}
              labelFormatter={(name) => `${name}`}
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
            />
            <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
              {data
                .filter((emotion) => selectedEmotions.includes(emotion.name))
                .map((entry, index) => (
                  <Bar key={`bar-${index}`} dataKey="value" fill={entry.color} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
