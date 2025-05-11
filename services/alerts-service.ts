import { fetchWithAuth } from "@/lib/api-config"

// Interfaces para los datos de la API según la estructura real
export interface ApiAlertCourse {
  curso_id: number
  nombre: string
  profesor_jefe: string
}

export interface ApiAlertStudent {
  alumno_id: number
  nombre: string
  email: string
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
  alumno: ApiAlertStudent
  prioridad: ApiAlertPriority
  evidencias?: ApiAlertEvidence[]
}

// Interfaces para la UI
export interface Alert {
  id: string
  student: {
    id: string
    name: string
    image?: string
    email?: string
  }
  type: string
  priority: string
  priorityColor: string
  classroom: string
  status: string
  responsible: string
  date: string
  time: string
  severity?: string
  severityIcon?: string
  description?: string
  actionTaken?: string
  isRead: boolean
  evidence?: {
    type: string
    url: string
    date: string
  }[]
}

// Datos de ejemplo para cuando la API no está disponible
export const FALLBACK_ALERTS: Alert[] = [
  {
    id: "1",
    student: {
      id: "101",
      name: "Carolina Espina",
      image: "/smiling-woman-garden.png",
      email: "carolina.espina@colegio.com",
    },
    type: "SOS Alma",
    priority: "Alta",
    priorityColor: "#FF0000",
    classroom: "3°C",
    status: "Pendiente",
    responsible: "Enc. Convivencia",
    date: "08/04/2025",
    time: "8:02 AM",
    severity: "Media",
    severityIcon: "warning",
    description: "Alerta generada por bajo rendimiento académico",
    isRead: false,
  },
  {
    id: "2",
    student: {
      id: "102",
      name: "Jorge Mendez",
      image: "/young-man-city.png",
      email: "jorge.mendez@colegio.com",
    },
    type: "Amarilla",
    priority: "Media",
    priorityColor: "#FFA500",
    classroom: "7°A",
    status: "En curso",
    responsible: "Psic. Escolar",
    date: "08/04/2025",
    time: "8:10 AM",
    severity: "Baja",
    severityIcon: "info",
    description: "Alerta generada por inasistencias",
    isRead: true,
  },
  {
    id: "3",
    student: {
      id: "103",
      name: "Bruno Garay",
      image: "/young-man-city.png",
      email: "bruno.garay@colegio.com",
    },
    type: "Denuncia",
    priority: "Alta",
    priorityColor: "#FF0000",
    classroom: "5°C",
    status: "Resuelta",
    responsible: "Dir. Académico",
    date: "07/04/2025",
    time: "9:15 AM",
    severity: "Alta",
    severityIcon: "alert-triangle",
    description: "Alerta generada por comportamiento",
    actionTaken: "Se contactó al apoderado",
    isRead: true,
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
      if (!apiAlert.alumno) {
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
      const studentName = apiAlert.alumno.nombre || "Estudiante sin nombre"
      const studentEmail = apiAlert.alumno.email || "sin-email@ejemplo.com"
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
        apiAlert.curso_alumno || (apiAlert.alumno.curso_actual ? apiAlert.alumno.curso_actual.nombre : "N/A")

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
        student: {
          id: studentId,
          name: studentName,
          image: studentImage,
          email: studentEmail,
        },
        type: alertType,
        priority,
        priorityColor,
        classroom,
        status,
        responsible,
        date: formattedDate,
        time: formattedTime,
        isRead: true, // Asumimos que todas las alertas están leídas por defecto
        evidence,
      }
    } catch (error) {
      console.error("Error mapping alert:", error)
      // Devolver un objeto de alerta por defecto en caso de error
      return {
        id: (apiAlert?.alumno_alerta_id || Math.floor(Math.random() * 1000)).toString(),
        student: {
          id: "0",
          name: "Error en datos",
          image: "/placeholder.svg",
          email: "error@ejemplo.com",
        },
        type: "Error",
        priority: "Media",
        priorityColor: "#FFA500",
        classroom: "N/A",
        status: "Error",
        responsible: "Sistema",
        date: new Date().toLocaleDateString("es-ES"),
        time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        isRead: true,
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
export async function fetchAlertById(id: string): Promise<Alert | null> {
  try {
    console.log(`Obteniendo alerta con ID ${id}...`)

    // Intentar obtener todas las alertas
    const alerts = await fetchAlerts()

    // Buscar la alerta con el ID especificado
    const alert = alerts.find((alert) => alert.id === id)

    if (!alert) {
      console.error(`No se encontró ninguna alerta con ID ${id}`)
      return null
    }

    return alert
  } catch (error) {
    console.error(`Error al obtener alerta con ID ${id}:`, error)
    return null
  }
}
