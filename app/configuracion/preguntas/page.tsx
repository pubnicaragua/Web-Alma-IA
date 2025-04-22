"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { AddQuestionModal } from "@/components/question/add-question-modal"

interface Question {
  id: string
  diagnostic: string
  question: string
  responseType: string
  responses: string
  priority: number
  time: string
}

export default function QuestionsPage() {
  const router = useRouter()

  // Datos de ejemplo para las preguntas
  const [questionsData, setQuestionsData] = useState<Question[]>([
    {
      id: "1",
      diagnostic: "Salud Mental",
      question: "¿Cómo te sientes hoy?",
      responseType: "Selección",
      responses: "Muy bien - Bien - Mal - Muy mal",
      priority: 1,
      time: "AM",
    },
    {
      id: "2",
      diagnostic: "Salud Mental",
      question: "¿Sientes energía para tus actividades escolares?",
      responseType: "Selección",
      responses: "Sí - No",
      priority: 2,
      time: "AM",
    },
    {
      id: "3",
      diagnostic: "Salud Mental",
      question: "¿Sientes energía para tus actividades escolares?",
      responseType: "Selección",
      responses: "Sí - No",
      priority: 2,
      time: "AM",
    },
    {
      id: "4",
      diagnostic: "Salud Mental",
      question: "¿Sientes energía para tus actividades escolares?",
      responseType: "Selección",
      responses: "Sí - No",
      priority: 2,
      time: "AM",
    },
    {
      id: "5",
      diagnostic: "Salud Mental",
      question: "¿Sientes energía para tus actividades escolares?",
      responseType: "Selección",
      responses: "Sí - No",
      priority: 2,
      time: "AM",
    },
    {
      id: "6",
      diagnostic: "Bienestar Emocional",
      question: "¿Te sientes apoyado por tus compañeros?",
      responseType: "Selección",
      responses: "Siempre - A veces - Nunca",
      priority: 3,
      time: "PM",
    },
    {
      id: "7",
      diagnostic: "Bienestar Emocional",
      question: "¿Has tenido dificultades para dormir?",
      responseType: "Selección",
      responses: "Sí - No - A veces",
      priority: 2,
      time: "PM",
    },
    {
      id: "8",
      diagnostic: "Rendimiento Académico",
      question: "¿Entiendes las explicaciones de tus profesores?",
      responseType: "Selección",
      responses: "Siempre - A veces - Nunca",
      priority: 1,
      time: "AM",
    },
  ])

  // Función para agregar una nueva pregunta
  const handleAddQuestion = (questionData: {
    pregunta: string
    tipoRespuesta: string
    opciones: string[]
    tipoDiagnostico: string
    prioridad: string
    sintomas: string
    palabrasClave: string
  }) => {
    // Crear una nueva pregunta con los datos del formulario
    const newQuestion: Question = {
      id: (questionsData.length + 1).toString(),
      diagnostic: questionData.tipoDiagnostico,
      question: questionData.pregunta,
      responseType: questionData.tipoRespuesta === "opcion_multiple" ? "Selección" : "Texto",
      responses: questionData.opciones.join(" - "),
      priority: Number.parseInt(questionData.prioridad) || 2,
      time: "AM",
    }

    // Agregar la nueva pregunta a la lista
    setQuestionsData([...questionsData, newQuestion])
  }

  // Función para manejar el clic en una pregunta
  const handleQuestionClick = (question: Question) => {
    router.push(`/configuracion/preguntas/${question.id}`)
  }

  // Columnas para la tabla
  const columns = [
    { key: "diagnostic", title: "Diagnóstico" },
    { key: "question", title: "Pregunta" },
    { key: "responseType", title: "Tipo de respuesta" },
    { key: "responses", title: "Respuestas" },
    { key: "priority", title: "Prioridad de preguntas" },
    { key: "time", title: "Horario" },
  ]

  // Renderizar celdas de la tabla
  const renderCell = (question: Question, column: { key: string; title: string }) => {
    switch (column.key) {
      case "question":
        return (
          <span className="cursor-pointer hover:text-blue-500" onClick={() => handleQuestionClick(question)}>
            {question.question}
          </span>
        )
      case "priority":
        return (
          <Badge
            variant="outline"
            className={
              question.priority === 1
                ? "border-red-500 text-red-500"
                : question.priority === 2
                  ? "border-yellow-500 text-yellow-500"
                  : "border-green-500 text-green-500"
            }
          >
            {question.priority}
          </Badge>
        )
      default:
        return question[column.key as keyof Question]
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => {}} />
        <main className="flex-1 overflow-y-auto pb-10">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Historial de preguntas cargadas</h2>
              <AddQuestionModal onAddQuestion={handleAddQuestion} />
            </div>

            {/* Tabla de preguntas */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <DataTable columns={columns} data={questionsData} renderCell={renderCell} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
