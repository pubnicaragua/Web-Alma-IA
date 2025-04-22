"use client"

import { useState } from "react"
import { ChevronDown, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmotionChartProps {
  title: string
  data: {
    label: string
    value: number
    color: string
  }[]
  maxValue: number
}

export function EmotionChart({ title, data, maxValue }: EmotionChartProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {title === "Media emocional General" ? <Smile className="text-gray-700" /> : null}
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
        <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setIsOpen(!isOpen)}>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </div>

      {title === "Media emocional General" && (
        <div className="flex gap-2 mb-6">
          {["A", "B", "C", "D", "E", "F"].map((letter) => (
            <div
              key={letter}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs
                ${
                  letter === "E"
                    ? "bg-red-100 text-red-500"
                    : letter === "F"
                      ? "bg-gray-100 text-gray-500"
                      : "bg-gray-100 text-gray-500"
                }`}
            >
              {letter}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {title === "Media emocional General" ? (
          <>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Muy bien</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Bien</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Normal</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Mal</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Muy mal</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between text-sm text-gray-500">
              <span>5K</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>2.5K</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>1K</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>0K</span>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 flex items-end h-64 gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="w-full rounded-md"
              style={{
                backgroundColor: item.color,
                height: `${(item.value / maxValue) * 100}%`,
                minHeight: "20px",
              }}
            />
            <span className="text-xs text-gray-500 mt-2">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
