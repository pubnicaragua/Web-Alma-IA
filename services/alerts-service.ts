import { fetchWithAuth } from "@/lib/api-config"
import { Alert as AlertPage } from '@/app/alertas/[id]/page'
import { DataPoint } from "@/components/line-chart-comparison"

// Interfaces para los datos de la API según la estructura real
export interface ApiAlertCourse {
  curso_id: number
  nombre: string
  profesor_jefe: string
}

export interface ApiAlertPerson {
  apellidos: string
  nombres: string
  persona_id: number
  email: string
}

export interface ApiAlertStudent {
  alumno_id: number
  personas: ApiAlertPerson
  curso_actual?: ApiAlertCourse
}

export interface ApiAlertPriority {
  nivel: string
  color: string
}

export interface ApiAlertEvidence {
  tipo: string
  url: string
  fecha: string
}

export interface ApiAlert {
  alumno_alerta_id: number
  alumno_id: number
  tipo_alerta: string
  fecha_generada: string
  fecha_resolucion: string | null
  estado: string
  responsable: string
  curso_alumno: string
  alumnos: ApiAlertStudent
  prioridad: ApiAlertPriority
  evidencias?: ApiAlertEvidence[]
}

// Interfaces para la UI
export interface Alert {
  id: string
  title: string
  description: string
  date: string
  status: string
  priority: string
  type: string
  student?: {
    id: string
    name: string
    avatar?: string
  }
}

// Datos de ejemplo para cuando la API no está disponible
export const FALLBACK_ALERTS: Alert[] = [
  {
    id: "1",
    title: "SOS Alma",
    description: "Alerta generada por bajo rendimiento académico",
    date: "08/04/2025",
    status: "Pendiente",
    priority: "Alta",
    type: "SOS Alma",
    student: {
      id: "101",
      name: "Carolina Espina",
      avatar: "/smiling-woman-garden.png",
    },
  },
  {
    id: "2",
    title: "Amarilla",
    description: "Alerta generada por inasistencias",
    date: "08/04/2025",
    status: "En curso",
    priority: "Media",
    type: "Amarilla",
    student: {
      id: "102",
      name: "Jorge Mendez",
      avatar: "/young-man-city.png",
    },
  },
  {
    id: "3",
    title: "Denuncia",
    description: "Alerta generada por comportamiento",
    date: "07/04/2025",
    status: "Resuelta",
    priority: "Alta",
    type: "Denuncia",
    student: {
      id: "103",
      name: "Bruno Garay",
      avatar: "/young-man-city.png",
    },
  },
]

// Función para convertir el formato de la API al formato de la UI
function mapApiAlertsToAlerts(apiAlerts: ApiAlert[]): Alert[] {
  return apiAlerts.map((apiAlert) => {
    try {
      // Verificar que los objetos necesarios existan
      if (!apiAlert) {
        console.error("Alert object is undefined")
        throw new Error("Alert object is undefined")
      }

      // Verificar que el objeto alumno exista
      if (!apiAlert.alumnos) {
        console.error("Student object is undefined for alert:", apiAlert.alumno_alerta_id)
        throw new Error("Student object is undefined")
      }

      // Extraer la hora y fecha de fecha_generada con manejo seguro
      let formattedDate = "01/01/2023"
      let formattedTime = "00:00"

      try {
        if (apiAlert.fecha_generada) {
          const generatedDate = new Date(apiAlert.fecha_generada)
          formattedDate = generatedDate.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          formattedTime = generatedDate.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })
        }
      } catch (dateError) {
        console.error("Error parsing date:", dateError)
      }

      // Acceso seguro a propiedades con valores por defecto
      const studentName = apiAlert.alumnos.personas.nombres || "Estudiante sin nombre"
      const studentLastName = apiAlert.alumnos.personas.apellidos || "Estudiante sin apellidos"
      const studentEmail = apiAlert.alumnos.personas.email || "sin-email@ejemplo.com"
      const studentId = apiAlert.alumno_id.toString() || "0"

      // Mapear tipo de alerta
      let alertType = apiAlert.tipo_alerta || "General"
      // Convertir primera letra a mayúscula
      alertType = alertType.charAt(0).toUpperCase() + alertType.slice(1)

      // Mapear prioridad
      let priority = "Media"
      let priorityColor = "#FFA500"

      if (apiAlert.prioridad) {
        if (apiAlert.prioridad.nivel) {
          const nivel = apiAlert.prioridad.nivel.toLowerCase()
          if (nivel === "alta") priority = "Alta"
          else if (nivel === "media") priority = "Media"
          else if (nivel === "baja") priority = "Baja"
        }

        priorityColor = apiAlert.prioridad.color || priorityColor
      }

      // Usar el aula del alumno si está disponible
      const classroom =
        apiAlert.curso_alumno || (apiAlert.alumnos.curso_actual ? apiAlert.alumnos.curso_actual.nombre : "N/A")

      // Usar el responsable si está disponible
      const responsible = apiAlert.responsable || "Sin asignar"

      // Mapear el estado
      let status = apiAlert.estado || "Pendiente"
      // Asegurarse de que la primera letra sea mayúscula
      status = status.charAt(0).toUpperCase() + status.slice(1)

      // Crear la imagen del estudiante (aleatoria)
      const studentImages = ["/smiling-woman-garden.png", "/young-man-city.png", "/confident-businessman.png"]
      const studentImage = studentImages[Math.floor(Math.random() * studentImages.length)]

      // Mapear evidencias si existen
      const evidence = apiAlert.evidencias
        ? apiAlert.evidencias.map((e) => ({
          type: e.tipo,
          url: e.url,
          date: new Date(e.fecha).toLocaleDateString("es-ES"),
        }))
        : undefined

      return {
        id: apiAlert.alumno_alerta_id.toString(),
        title: alertType,
        description: apiAlert.tipo_alerta, // Using tipo_alerta as description
        date: formattedDate,
        status: status,
        priority: priority,
        type: alertType,
        student: {
          id: studentId,
          name: studentName,
          lastName: studentLastName,
          email: studentEmail,
          avatar: studentImage,
        },
      }
    } catch (error) {
      console.error("Error mapping alert:", error)
      // Devolver un objeto de alerta por defecto en caso de error
      return {
        id: (apiAlert?.alumno_alerta_id || Math.floor(Math.random() * 1000)).toString(),
        title: "Error",
        description: "Error en datos",
        date: new Date().toLocaleDateString("es-ES"),
        status: "Error",
        priority: "Media",
        type: "Error",
        student: {
          id: "0",
          name: "Error en datos",
          avatar: "/placeholder.svg",
        },
      }
    }
  })
}

// Función para obtener todas las alertas
export async function fetchAlerts(): Promise<Alert[]> {
  try {
    console.log("Obteniendo alertas...")

    // Intentar obtener datos reales de la API
    console.log("Intentando obtener datos reales de alertas...")
    const response = await fetchWithAuth("/alumnos/alertas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      // Intentar leer el mensaje de error
      const errorText = await response.text()
      console.error(`Error en respuesta API (alumnos/alertas): ${response.status} - ${errorText}`)

      // Si es un 404, usar datos de ejemplo
      if (response.status === 404) {
        console.log("API no encontrada, usando datos de ejemplo")
        return FALLBACK_ALERTS
      }

      throw new Error(`Error al obtener alertas: ${response.status} - ${errorText}`)
    }

    // Intentar parsear la respuesta como JSON
    const apiAlerts: ApiAlert[] = await response.json()
    console.log("Datos reales de alertas obtenidos:", apiAlerts)

    // Verificar que apiAlerts sea un array
    if (!Array.isArray(apiAlerts)) {
      console.error("La respuesta de la API no es un array:", apiAlerts)
      return FALLBACK_ALERTS
    }

    // Convertir los datos de la API al formato de la UI
    const alerts = mapApiAlertsToAlerts(apiAlerts)
    return alerts
  } catch (error) {
    console.error("Error al obtener alertas:", error)
    // Usar datos de ejemplo en caso de error
    console.log("Usando datos de ejemplo debido a un error")
    return FALLBACK_ALERTS
  }
}

// Función para obtener una alerta por ID
export async function fetchAlertById(id: string): Promise<AlertPage | null> {
  try {
    console.log(`Obteniendo alerta con ID ${id}...`)

    // Intentar obtener todas las alertas
    const response = await fetchWithAuth(`/alumnos/alertas/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok)
      throw new Error("error en la petición")
    const alert = await response.json()

    if (!alert) {
      console.error(`No se encontró ninguna alerta con ID ${id}`)
      throw new Error(`No se encontró ninguna alerta con ID ${id}`)
    }
    if (Array.isArray(alert)) return alert[0]
    return alert
  } catch (error) {
    console.error(`Error al obtener alerta con ID ${id}:`, error)
    throw error
  }
}

export async function fetchRecentAlerts(): Promise<Alert[]> {
  try {
    console.log("Fetching recent alerts from API...")
    const response = await fetchWithAuth("/alertas/recientes", {
      method: "GET",
    })

    if (!response.ok) {
      throw new Error(`Error fetching recent alerts: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Recent alerts data:", data)
    return data
  } catch (error) {
    console.error("Error in fetchRecentAlerts:", error)
    throw error
  }
}

//funcion para la data del chartLine de comparativo
export async function fetchTotalAlertsChartLine(): Promise<DataPoint[]> {
  try {
    console.log("Obteniendo Alertas...")
    const response = await fetchWithAuth("/comparativa/alerts/totales", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error al obtener alertas: ${response.status} - ${errorText}`)
      throw new Error(`Error al obtener alertas: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("Alertas totales obtenodas:", data)
    return data
  } catch (error) {
    console.error("Error al obtener emociones:", error)
    throw error
  }
}
