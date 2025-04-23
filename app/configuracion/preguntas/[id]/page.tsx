"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"

interface QuestionDetail {
  id: string
  question: string
  options: string[]
  responseType: string
  diagnostic: string
  priority: string
  timeOfDay: string
  symptoms: string
  keywords: string
}

export default function QuestionDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [question, setQuestion] = useState<QuestionDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulación de carga de datos de la pregunta
    const fetchQuestion = async () => {
      // En un caso real, aquí se haría una petición a la API
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Datos de ejemplo basados en la imagen proporcionada
      const mockQuestion: QuestionDetail = {
        id: id as string,
        question: "¿Cómo te sientes hoy?",
        options: ["Muy bien", "Bien", "Normal", "Mal", "Muy mal"],
        responseType: "Opción múltiple",
        diagnostic: "Salud Mental",
        priority: "1",
        timeOfDay: "AM",
        symptoms:
          "Cambios en el estado de ánimo, ansiedad excesiva, tristeza o apatía prolongada, pensamientos inusuales, rumiación constante, ambivalencia, confusión de identidad, desorientación frecuente, pensamiento suicida o violento, dificultad para identificar y gestionar emociones, sufrimiento emocional persistente, aplanamiento o volatilidad emocional.",
        keywords:
          "Salud mental, ansiedad, baja autoestima, preocupación, nerviosismo, insomnio, tristeza, frustración, agotamiento extremo, episodios de llanto, desesperación, angustia, soledad, aislamiento, desinterés, bajo rendimiento, mala comunicación, misoginia, misandria, trastornos alimenticios, peso, dietas, excesos.",
      }

      setQuestion(mockQuestion)
      setIsLoading(false)
    }

    fetchQuestion()
  }, [id])

  const handleGoBack = () => {
    router.push("/configuracion/preguntas")
  }

  const handleEditQuestion = () => {
    // En un caso real, aquí se abriría un modal de edición o se navegaría a una página de edición
    alert("Funcionalidad para editar la pregunta")
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-500">Cargando información de la pregunta...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!question) {
    return (
      <AppLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-500">No se encontró información de la pregunta</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-blue-500 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span className="text-xl font-semibold">{question.question}</span>
          </button>
          <Button onClick={handleEditQuestion} className="bg-blue-500 hover:bg-blue-600">
            Editar pregunta
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex justify-end mb-4">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 mr-2"></div>
              <span className="text-gray-700">{question.responseType}</span>
            </div>
          </div>

          {/* Opciones de respuesta */}
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center">
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 mr-2"></div>
                <span className="text-gray-800">{option}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Diagnóstico */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Diagnóstico</h3>
            <p className="text-gray-700">{question.diagnostic}</p>
          </div>

          {/* Prioridad de preguntas y horario */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Prioridad de preguntas y horario</h3>
            <p className="text-gray-700">
              {question.priority} - {question.timeOfDay}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Síntomas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Síntomas</h3>
            <p className="text-gray-700">{question.symptoms}</p>
          </div>

          {/* Palabras clave */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Palabras clave</h3>
            <p className="text-gray-700">{question.keywords}</p>
          </div>
        </div>

        {/* Navegación entre preguntas */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
