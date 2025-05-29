import { fetchWithAuth } from "@/lib/api-config"

// Interfaces para la API
export interface ApiQuestion {
  pregunta_id: number
  tipo_pregunta_id: number
  nivel_educativo_id: number
  diagnostico: string
  sintomas: string
  grupo_preguntas: string
  palabra_clave: string
  horario: string
  texto_pregunta: string
  creado_por: number
  actualizado_por: number
  fecha_creacion: string
  activo: boolean
  fecha_actualizacion: string
  template_code: string
  tipos_preguntas: {
    nombre: string
    tipo_pregunta_id: number
  }
  niveles_educativos: {
    nombre: string
    nivel_educativo_id: number
  }
}

// Interfaces para la UI
export interface Question {
  id: string
  questionType: string
  educationLevel: string
  diagnostic: string
  symptoms: string
  questionGroup: string
  keyword: string
  time: string
  questionText: string
  priority: number // Generado basado en el diagnóstico
}

// Función para convertir el formato de la API al formato de la UI
function mapApiQuestionsToQuestions(apiQuestions: ApiQuestion[]): Question[] {
  return apiQuestions.map((apiQuestion) => {
    // Determinar la prioridad basada en el diagnóstico (lógica de ejemplo)
    let priority = 2 // Prioridad media por defecto
    const diagLower = apiQuestion.diagnostico.toLowerCase()
    if (diagLower.includes("urgente") || diagLower.includes("crítico") || diagLower.includes("grave")) {
      priority = 1 // Alta prioridad
    } else if (diagLower.includes("leve") || diagLower.includes("seguimiento") || diagLower.includes("rutina")) {
      priority = 3 // Baja prioridad
    }

    return {
      id: apiQuestion.pregunta_id.toString(),
      questionType: apiQuestion.tipos_preguntas.nombre,
      educationLevel: apiQuestion.niveles_educativos.nombre,
      diagnostic: apiQuestion.diagnostico,
      symptoms: apiQuestion.sintomas,
      questionGroup: apiQuestion.grupo_preguntas,
      keyword: apiQuestion.palabra_clave,
      time: apiQuestion.horario.toUpperCase(),
      questionText: apiQuestion.texto_pregunta,
      priority,
    }
  })
}

// Datos de ejemplo para cuando la API no está disponible
const sampleQuestions: Question[] = [
  {
    id: "1",
    questionType: "Opción múltiple",
    educationLevel: "Secundaria",
    diagnostic: "Problemas de atención",
    symptoms: "Falta de concentración, hiperactividad",
    questionGroup: "Evaluación inicial",
    keyword: "atención",
    time: "AM",
    questionText: "¿Con qué frecuencia tiene dificultad para concentrarse en sus tareas?",
    priority: 2,
  },
  {
    id: "2",
    questionType: "Escala",
    educationLevel: "Primaria",
    diagnostic: "Ansiedad",
    symptoms: "Nerviosismo, preocupación excesiva",
    questionGroup: "Evaluación emocional",
    keyword: "ansiedad",
    time: "PM",
    questionText: "Del 1 al 5, ¿qué tan nervioso te sientes antes de un examen?",
    priority: 2,
  },
  {
    id: "3",
    questionType: "Sí/No",
    educationLevel: "Preescolar",
    diagnostic: "Desarrollo social",
    symptoms: "Dificultad para interactuar con otros niños",
    questionGroup: "Evaluación social",
    keyword: "socialización",
    time: "AM",
    questionText: "¿Te gusta jugar con otros niños?",
    priority: 3,
  },
  {
    id: "4",
    questionType: "Respuesta abierta",
    educationLevel: "Secundaria",
    diagnostic: "Depresión",
    symptoms: "Tristeza persistente, pérdida de interés",
    questionGroup: "Evaluación urgente",
    keyword: "depresión",
    time: "PM",
    questionText: "¿Cómo te has sentido emocionalmente durante la última semana?",
    priority: 1,
  },
  {
    id: "5",
    questionType: "Opción múltiple",
    educationLevel: "Primaria",
    diagnostic: "Problemas de aprendizaje",
    symptoms: "Dificultad para leer, escribir",
    questionGroup: "Evaluación académica",
    keyword: "aprendizaje",
    time: "AM",
    questionText: "¿Qué actividad te resulta más difícil en clase?",
    priority: 2,
  },
]

// Función para obtener las preguntas
export async function fetchQuestions(): Promise<Question[]> {
  try {
    // Usar el proxy local en lugar de la URL directa
    const response = await fetchWithAuth("/preguntas", {
      method: "GET",
    })

    if (!response.ok) {
      // Si la respuesta no es exitosa, lanzar un error
      const errorText = await response.text()
      console.error("Error en respuesta API (preguntas):", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })
      throw new Error(`Error al obtener preguntas: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('preguntas.....',data)
    return mapApiQuestionsToQuestions(data)
  } catch (error) {
    console.error("Error al obtener preguntas:", error)
    // En caso de error, devolver datos de ejemplo
    // console.log("Usando datos de ejemplo para preguntas")
    throw error
  }
}

// Función para obtener una pregunta específica por ID
export async function fetchQuestionById(id: string): Promise<Question | null> {
  try {
    // Intentar obtener todas las preguntas
    const questions = await fetchQuestions()
    // Buscar la pregunta con el ID especificado
    const question = questions.find((q) => q.id === id)
    return question || null
  } catch (error) {
    console.error(`Error al obtener pregunta con ID ${id}:`, error)
    // En caso de error, buscar en los datos de ejemplo
    const sampleQuestion = sampleQuestions.find((q) => q.id === id)
    return sampleQuestion || null
  }
}
