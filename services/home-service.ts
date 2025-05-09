import { fetchWithAuth } from "@/lib/api-config"

export interface Student {
  name: string
  image: string
}

export interface RecentAlert {
  student: Student
  alertType: string
  date: string
}

export interface ImportantDate {
  event: string
  dateRange: string
}

export interface TotalAlert {
  label: string
  value: number
  percentage: string
  color: string
}

export interface Emotion {
  name: string
  value: number
  color: string
}

// Datos de ejemplo para usar en caso de error
const fallbackAlerts: RecentAlert[] = [
  {
    student: {
      name: "Carolina Espina",
      image: "/smiling-woman-garden.png",
    },
    alertType: "SOS Alma",
    date: "Abr 02 - 2024",
  },
  {
    student: {
      name: "Jaime Brito",
      image: "/young-man-city.png",
    },
    alertType: "Denuncias",
    date: "Mar 29 - 2024",
  },
  {
    student: {
      name: "Teresa Ulloa",
      image: "/smiling-woman-garden.png",
    },
    alertType: "IA",
    date: "Mar 27 - 2024",
  },
  {
    student: {
      name: "Carlos Araneda",
      image: "/young-man-city.png",
    },
    alertType: "SOS Alma",
    date: "Mar 26 - 2024",
  },
]

// Datos de ejemplo para fechas importantes
const fallbackImportantDates: ImportantDate[] = [
  { event: "Pruebas Parciales", dateRange: "Abr 02 - Abr 07" },
  { event: "Reunión de Apoderados", dateRange: "Abr 10 - Abr 12" },
  { event: "Matrícula 2025", dateRange: "Abr 15 - Abr 20" },
  { event: "Semana santa", dateRange: "Abr 21 - Abr 28" },
  { event: "Exámenes Finales", dateRange: "May 02 - May 10" },
  { event: "Vacaciones de Invierno", dateRange: "Jul 15 - Jul 30" },
  { event: "Fiestas Patrias", dateRange: "Sep 15 - Sep 20" },
]

// Datos de ejemplo para alertas totales
const fallbackTotalAlerts: TotalAlert[] = [
  { label: "10 Pendientes", value: 10, percentage: "22.8%", color: "#facc15" },
  { label: "07 Nuevos", value: 7, percentage: "13.9%", color: "#22c55e" },
  { label: "39 Atendidos", value: 39, percentage: "52.1%", color: "#3b82f6" },
  { label: "05 Aplazados", value: 5, percentage: "11.2%", color: "#a855f7" },
]

// Datos de ejemplo para emociones
const fallbackEmotions: Emotion[] = [
  { name: "Tristeza", value: 2000, color: "#3b82f6" },
  { name: "Felicidad", value: 4000, color: "#facc15" },
  { name: "Estrés", value: 1800, color: "#6b7280" },
  { name: "Ansiedad", value: 3200, color: "#fb923c" },
  { name: "Enojo", value: 1200, color: "#ef4444" },
  { name: "Otros", value: 2800, color: "#a855f7" },
]

export async function fetchRecentAlerts(): Promise<RecentAlert[]> {
  try {
    console.log("Obteniendo alertas recientes...")

    // Verificar si hay un token disponible
    const token = localStorage.getItem("auth_token")
    if (!token) {
      console.warn("No hay token de autenticación disponible para obtener alertas recientes")
      // En desarrollo, podemos devolver datos de ejemplo
      if (process.env.NODE_ENV === "development") {
        console.log("Usando datos de ejemplo para alertas recientes (no hay token)")
        return fallbackAlerts
      }
    }

    const response = await fetchWithAuth("/home/alertas/recientes")

    if (!response.ok) {
      // Intentar leer el mensaje de error
      const errorText = await response.text()
      console.error(`Error al obtener alertas recientes: ${response.status} - ${errorText}`)

      // En desarrollo, podemos devolver datos de ejemplo
      if (process.env.NODE_ENV === "development") {
        console.log("Usando datos de ejemplo para alertas recientes (error en respuesta)")
        return fallbackAlerts
      }

      throw new Error(`Error al obtener alertas recientes: ${response.status} - ${errorText}`)
    }

    // Intentar parsear la respuesta como JSON
    try {
      return await response.json()
    } catch (error) {
      console.error("Error al parsear la respuesta JSON:", error)

      // En desarrollo, podemos devolver datos de ejemplo
      if (process.env.NODE_ENV === "development") {
        console.log("Usando datos de ejemplo para alertas recientes (error al parsear JSON)")
        return fallbackAlerts
      }

      throw error
    }
  } catch (error) {
    console.error("Error al obtener alertas recientes:", error)

    // En desarrollo, podemos devolver datos de ejemplo
    if (process.env.NODE_ENV === "development") {
      console.log("Usando datos de ejemplo para alertas recientes (error en try/catch)")
      return fallbackAlerts
    }

    // Devolver un array vacío en caso de error para evitar que la UI se rompa
    return []
  }
}

export async function fetchImportantDates(): Promise<ImportantDate[]> {
  try {
    console.log("Obteniendo fechas importantes...")

    // Verificar si hay un token disponible
    const token = localStorage.getItem("auth_token")
    if (!token) {
      console.warn("No hay token de autenticación disponible para obtener fechas importantes")
      // En desarrollo, podemos devolver datos de ejemplo
      if (process.env.NODE_ENV === "development") {
        console.log("Usando datos de ejemplo para fechas importantes (no hay token)")
        return fallbackImportantDates
      }
    }

    const response = await fetchWithAuth("/home/fechas-importantes")

    if (!response.ok) {
      // Intentar leer el mensaje de error
      const errorText = await response.text()
      console.error(`Error al obtener fechas importantes: ${response.status} - ${errorText}`)

      // En desarrollo, podemos devolver datos de ejemplo
      if (process.env.NODE_ENV === "development") {
        console.log("Usando datos de ejemplo para fechas importantes (error en respuesta)")
        return fallbackImportantDates
      }

      throw new Error(`Error al obtener fechas importantes: ${response.status} - ${errorText}`)
    }

    // Intentar parsear la respuesta como JSON
    try {
      return await response.json()
    } catch (error) {
      console.error("Error al parsear la respuesta JSON:", error)

      // En desarrollo, podemos devolver datos de ejemplo
      if (process.env.NODE_ENV === "development") {
        console.log("Usando datos de ejemplo para fechas importantes (error al parsear JSON)")
        return fallbackImportantDates
      }

      throw error
    }
  } catch (error) {
    console.error("Error al obtener fechas importantes:", error)

    // En desarrollo, podemos devolver datos de ejemplo
    if (process.env.NODE_ENV === "development") {
      console.log("Usando datos de ejemplo para fechas importantes (error en try/catch)")
      return fallbackImportantDates
    }

    // Devolver un array vacío en caso de error para evitar que la UI se rompa
    return []
  }
}

export async function fetchTotalAlerts(): Promise<TotalAlert[]> {
  try {
    console.log("Obteniendo alertas totales...")

    // Verificar si hay un token disponible
    const token = localStorage.getItem("auth_token")
    if (!token) {
      console.warn("No hay token de autenticación disponible para obtener alertas totales")
      // En desarrollo, podemos devolver datos de ejemplo
      if (process.env.NODE_ENV === "development") {
        console.log("Usando datos de ejemplo para alertas totales (no hay token)")
        return fallbackTotalAlerts
      }
    }

    const response = await fetchWithAuth("/home/alertas/totales")

    if (!response.ok) {
      // Intentar leer el mensaje de error
      const errorText = await response.text()
      console.error(`Error al obtener alertas totales: ${response.status} - ${errorText}`)

      // En desarrollo, podemos devolver datos de ejemplo
      if (process.env.NODE_ENV === "development") {
        console.log("Usando datos de ejemplo para alertas totales (error en respuesta)")
        return fallbackTotalAlerts
      }

      throw new Error(`Error al obtener alertas totales: ${response.status} - ${errorText}`)
    }

    // Intentar parsear la respuesta como JSON
    try {
      return await response.json()
    } catch (error) {
      console.error("Error al parsear la respuesta JSON:", error)

      // En desarrollo, podemos devolver datos de ejemplo
      if (process.env.NODE_ENV === "development") {
        console.log("Usando datos de ejemplo para alertas totales (error al parsear JSON)")
        return fallbackTotalAlerts
      }

      throw error
    }
  } catch (error) {
    console.error("Error al obtener alertas totales:", error)

    // En desarrollo, podemos devolver datos de ejemplo
    if (process.env.NODE_ENV === "development") {
      console.log("Usando datos de ejemplo para alertas totales (error en try/catch)")
      return fallbackTotalAlerts
    }

    // Devolver un array vacío en caso de error para evitar que la UI se rompa
    return []
  }
}

export async function fetchEmotions(): Promise<Emotion[]> {
  try {
    console.log("Obteniendo emociones...")

    // Verificar si hay un token disponible
    const token = localStorage.getItem("auth_token")
    if (!token) {
      console.warn("No hay token de autenticación disponible para obtener emociones")
      // En desarrollo, podemos devolver datos de ejemplo
      if (process.env.NODE_ENV === "development") {
        console.log("Usando datos de ejemplo para emociones (no hay token)")
        return fallbackEmotions
      }
    }

    const response = await fetchWithAuth("/home/emotions/general")

    if (!response.ok) {
      // Intentar leer el mensaje de error
      const errorText = await response.text()
      console.error(`Error al obtener emociones: ${response.status} - ${errorText}`)

      // En desarrollo, podemos devolver datos de ejemplo
      if (process.env.NODE_ENV === "development") {
        console.log("Usando datos de ejemplo para emociones (error en respuesta)")
        return fallbackEmotions
      }

      throw new Error(`Error al obtener emociones: ${response.status} - ${errorText}`)
    }

    // Intentar parsear la respuesta como JSON
    try {
      return await response.json()
    } catch (error) {
      console.error("Error al parsear la respuesta JSON:", error)

      // En desarrollo, podemos devolver datos de ejemplo
      if (process.env.NODE_ENV === "development") {
        console.log("Usando datos de ejemplo para emociones (error al parsear JSON)")
        return fallbackEmotions
      }

      throw error
    }
  } catch (error) {
    console.error("Error al obtener emociones:", error)

    // En desarrollo, podemos devolver datos de ejemplo
    if (process.env.NODE_ENV === "development") {
      console.log("Usando datos de ejemplo para emociones (error en try/catch)")
      return fallbackEmotions
    }

    // Devolver un array vacío en caso de error para evitar que la UI se rompa
    return []
  }
}
