"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AddQuestionModal } from "@/components/question/add-question-modal"
import { Download } from "lucide-react"
import * as XLSX from "xlsx"

interface Question {
  id: string
  diagnostic: string
  question: string
  responseType: string
  responses: string
  priority: number
  time: string
  course: string // Nueva propiedad para la columna Curso
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
      course: "1° Básico",
    },
    {
      id: "2",
      diagnostic: "Salud Mental",
      question: "¿Sientes energía para tus actividades escolares?",
      responseType: "Selección",
      responses: "Sí - No",
      priority: 2,
      time: "AM",
      course: "2° Básico",
    },
    {
      id: "3",
      diagnostic: "Salud Mental",
      question: "¿Sientes energía para tus actividades escolares?",
      responseType: "Selección",
      responses: "Sí - No",
      priority: 2,
      time: "AM",
      course: "3° Básico",
    },
    {
      id: "4",
      diagnostic: "Salud Mental",
      question: "¿Sientes energía para tus actividades escolares?",
      responseType: "Selección",
      responses: "Sí - No",
      priority: 2,
      time: "AM",
      course: "4° Básico",
    },
    {
      id: "5",
      diagnostic: "Salud Mental",
      question: "¿Sientes energía para tus actividades escolares?",
      responseType: "Selección",
      responses: "Sí - No",
      priority: 2,
      time: "AM",
      course: "5° Básico",
    },
    {
      id: "6",
      diagnostic: "Bienestar Emocional",
      question: "¿Te sientes apoyado por tus compañeros?",
      responseType: "Selección",
      responses: "Siempre - A veces - Nunca",
      priority: 3,
      time: "PM",
      course: "6° Básico",
    },
    {
      id: "7",
      diagnostic: "Bienestar Emocional",
      question: "¿Has tenido dificultades para dormir?",
      responseType: "Selección",
      responses: "Sí - No - A veces",
      priority: 2,
      time: "PM",
      course: "7° Básico",
    },
    {
      id: "8",
      diagnostic: "Rendimiento Académico",
      question: "¿Entiendes las explicaciones de tus profesores?",
      responseType: "Selección",
      responses: "Siempre - A veces - Nunca",
      priority: 1,
      time: "AM",
      course: "8° Básico",
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
      course: "General", // Valor por defecto para nuevas preguntas
    }

    // Agregar la nueva pregunta a la lista
    setQuestionsData([...questionsData, newQuestion])
  }

  // Función para manejar el clic en una pregunta
  const handleQuestionClick = (question: Question) => {
    router.push(`/configuracion/preguntas/${question.id}`)
  }

  // Función para exportar datos a Excel
  const exportToExcel = () => {
    // Preparar los datos para Excel
    const dataForExcel = questionsData.map((q) => ({
      ID: q.id,
      Diagnóstico: q.diagnostic,
      Pregunta: q.question,
      "Tipo de respuesta": q.responseType,
      Respuestas: q.responses,
      Prioridad: q.priority,
      Horario: q.time,
      Curso: q.course,
    }))

    // Crear una hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel)

    // Crear un libro de trabajo
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Preguntas")

    // Generar el archivo Excel
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

    // Crear un Blob y descargar
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `Preguntas_${new Date().toISOString().split("T")[0]}.xlsx`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Columnas para la tabla
  const columns = [
    { key: "diagnostic", title: "Diagnóstico" },
    { key: "question", title: "Pregunta" },
    { key: "responseType", title: "Tipo de respuesta" },
    { key: "responses", title: "Respuestas" },
    { key: "priority", title: "Prioridad de preguntas" },
    { key: "time", title: "Horario" },
    { key: "course", title: "Curso" }, // Nueva columna
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
    <AppLayout>
      <div className="container mx-auto px-3 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Historial de preguntas cargadas</h2>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" className="flex items-center gap-2" onClick={exportToExcel}>
              <Download size={16} />
              Exportar Excel
            </Button>
            <AddQuestionModal onAddQuestion={handleAddQuestion} isMobile={true} />
          </div>
        </div>

        {/* Tabla de preguntas */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <DataTable columns={columns} data={questionsData} renderCell={renderCell} />
        </div>
      </div>
    </AppLayout>
  )
}
