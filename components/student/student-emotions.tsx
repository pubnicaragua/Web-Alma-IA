"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"

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

  // Valores fijos para las barras, diferentes para cada emoción
  const chartData = [
    { name: "Tristeza", value: 5, color: "#78b6ff" },
    { name: "Felicidad", value: 18, color: "#ffd166" },
    { name: "Estrés", value: 10, color: "#6c757d" },
    { name: "Ansiedad", value: 20, color: "#f4a261" },
    { name: "Enojo", value: 5, color: "#e63946" },
    { name: "Otros", value: 15, color: "#6c757d" },
  ]

  const toggleEmotion = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter((e) => e !== emotion))
    } else {
      setSelectedEmotions([...selectedEmotions, emotion])
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Registro emocional del alumno</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
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

          <div className="h-64 relative">
            {/* Escala vertical */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
              <span>20</span>
              <span>10</span>
              <span>05</span>
              <span>01</span>
            </div>

            {/* Gráfico de barras */}
            <div className="flex items-end h-full pl-8 gap-2 overflow-hidden">
              {chartData
                .filter((emotion) => selectedEmotions.includes(emotion.name))
                .map((emotion, index) => {
                  // Calcular la altura como porcentaje del valor máximo, con un mínimo de 5%
                  const heightPercentage = Math.max((emotion.value / 20) * 100, 5)

                  return (
                    <div key={index} className="flex flex-col items-center flex-1 min-w-0">
                      <div
                        className="w-full rounded-t-md"
                        style={{
                          backgroundColor: emotion.color,
                          height: `${heightPercentage}%`,
                          minHeight: "20px",
                        }}
                      />
                      <span className="text-xs text-gray-500 mt-2 truncate w-full text-center">{emotion.name}</span>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium">Comparativa</h4>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                <span>Alumno</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-400 mr-1"></div>
                <span>Promedio</span>
              </div>
            </div>
          </div>

          {/* Gráfico de radar */}
          <div className="h-64 flex justify-center items-center">
            <svg viewBox="0 0 200 200" width="100%" height="100%">
              {/* Pentágono exterior */}
              <polygon points="100,10 190,75 160,180 40,180 10,75" fill="none" stroke="#e5e5e5" strokeWidth="1" />
              {/* Pentágonos interiores (escala) */}
              <polygon points="100,28 172,80 148,160 52,160 28,80" fill="none" stroke="#e5e5e5" strokeWidth="1" />
              <polygon points="100,46 154,85 136,140 64,140 46,85" fill="none" stroke="#e5e5e5" strokeWidth="1" />
              <polygon points="100,64 136,90 124,120 76,120 64,90" fill="none" stroke="#e5e5e5" strokeWidth="1" />

              {/* Datos del alumno */}
              <polygon
                points="100,20 170,75 150,150 50,150 30,75"
                fill="rgba(66, 153, 255, 0.5)"
                stroke="#4299ff"
                strokeWidth="2"
              />

              {/* Datos del promedio */}
              <polygon
                points="100,40 150,85 135,130 65,130 50,85"
                fill="rgba(128, 128, 128, 0.3)"
                stroke="#888888"
                strokeWidth="2"
                strokeDasharray="5,3"
              />

              {/* Etiquetas */}
              <text x="100" y="5" textAnchor="middle" fontSize="10" fill="#333">
                Feliz
              </text>
              <text x="195" y="75" textAnchor="start" fontSize="10" fill="#333">
                Triste
              </text>
              <text x="165" y="185" textAnchor="middle" fontSize="10" fill="#333">
                Estresada
              </text>
              <text x="35" y="185" textAnchor="middle" fontSize="10" fill="#333">
                Enojada
              </text>
              <text x="5" y="75" textAnchor="end" fontSize="10" fill="#333">
                Ansiosa
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
