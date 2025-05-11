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

// Datos de ejemplo para alertas recientes
export const FALLBACK_RECENT_ALERTS: RecentAlert[] = [
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
      name: "Martín Soto",
      image: "/young-man-city.png",
    },
    alertType: "Alerta Académica",
    date: "Abr 05 - 2024",
  },
  {
    student: {
      name: "Ana García",
      image: "/confident-businessman.png",
    },
    alertType: "Alerta de Asistencia",
    date: "Abr 10 - 2024",
  },
]

// Datos de ejemplo para fechas importantes
export const FALLBACK_IMPORTANT_DATES: ImportantDate[] = [
  {
    event: "Reunión de Apoderados",
    dateRange: "May 15 - 2024",
  },
  {
    event: "Feriado Nacional",
    dateRange: "May 21 - 2024",
  },
  {
    event: "Semana de Evaluaciones",
    dateRange: "Jun 05 - Jun 09, 2024",
  },
  {
    event: "Vacaciones de Invierno",
    dateRange: "Jul 10 - Jul 25, 2024",
  },
]

// Datos de ejemplo para alertas totales
export const FALLBACK_TOTAL_ALERTS: TotalAlert[] = [
  {
    label: "Académicas",
    value: 24,
    percentage: "+5.3%",
    color: "bg-blue-500",
  },
  {
    label: "Asistencia",
    value: 16,
    percentage: "-2.1%",
    color: "bg-amber-500",
  },
  {
    label: "Conducta",
    value: 8,
    percentage: "+1.2%",
    color: "bg-red-500",
  },
]

// Datos de ejemplo para emociones
export const FALLBACK_EMOTIONS: Emotion[] = [
  {
    name: "Feliz",
    value: 45,
    color: "#4ade80",
  },
  {
    name: "Tranquilo",
    value: 25,
    color: "#60a5fa",
  },
  {
    name: "Triste",
    value: 15,
    color: "#f87171",
  },
  {
    name: "Enojado",
    value: 10,
    color: "#fb923c",
  },
  {
    name: "Ansioso",
    value: 5,
    color: "#a78bfa",
  },
]

export async function fetchRecentAlerts(): Promise<RecentAlert[]> {
  try {
    console.log("Obteniendo alertas recientes...")

    // Intentar obtener datos reales de la API
    console.log("Intentando obtener datos reales de alertas recientes...")
    const response = await fetchWithAuth("/home/alertas/recientes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      // Intentar leer el mensaje de error
      const errorText = await response.text()
      console.error(`Error al obtener alertas recientes: ${response.status} - ${errorText}`)
      throw new Error(`Error al obtener alertas recientes: ${response.status} - ${errorText}`)
    }

    // Intentar parsear la respuesta como JSON
    const data = await response.json()
    console.log("Datos reales de alertas recientes obtenidos:", data)
    return data
  } catch (error) {
    console.error("Error al obtener alertas recientes:", error)
    // Propagar el error para que el componente pueda manejarlo
    throw error
  }
}

export async function fetchImportantDates(): Promise<ImportantDate[]> {
  try {
    console.log("Obteniendo fechas importantes...")

    // Intentar obtener datos reales de la API
    console.log("Intentando obtener datos reales de fechas importantes...")
    const response = await fetchWithAuth("/home/fechas-importantes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      // Intentar leer el mensaje de error
      const errorText = await response.text()
      console.error(`Error al obtener fechas importantes: ${response.status} - ${errorText}`)
      throw new Error(`Error al obtener fechas importantes: ${response.status} - ${errorText}`)
    }

    // Intentar parsear la respuesta como JSON
    const data = await response.json()
    console.log("Datos reales de fechas importantes obtenidos:", data)
    return data
  } catch (error) {
    console.error("Error al obtener fechas importantes:", error)
    // Propagar el error para que el componente pueda manejarlo
    throw error
  }
}

export async function fetchTotalAlerts(): Promise<TotalAlert[]> {
  try {
    console.log("Obteniendo alertas totales...")

    // Intentar obtener datos reales de la API
    console.log("Intentando obtener datos reales de alertas totales...")
    const response = await fetchWithAuth("/home/alertas/totales", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      // Intentar leer el mensaje de error
      const errorText = await response.text()
      console.error(`Error al obtener alertas totales: ${response.status} - ${errorText}`)
      throw new Error(`Error al obtener alertas totales: ${response.status} - ${errorText}`)
    }

    // Intentar parsear la respuesta como JSON
    const data = await response.json()
    console.log("Datos reales de alertas totales obtenidos:", data)
    return data
  } catch (error) {
    console.error("Error al obtener alertas totales:", error)
    // Propagar el error para que el componente pueda manejarlo
    throw error
  }
}

export async function fetchEmotions(): Promise<Emotion[]> {
  try {
    console.log("Obteniendo emociones...")

    // Intentar obtener datos reales de la API
    console.log("Intentando obtener datos reales de emociones...")
    const response = await fetchWithAuth("/home/emotions/general", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      // Intentar leer el mensaje de error
      const errorText = await response.text()
      console.error(`Error al obtener emociones: ${response.status} - ${errorText}`)
      throw new Error(`Error al obtener emociones: ${response.status} - ${errorText}`)
    }

    // Intentar parsear la respuesta como JSON
    const data = await response.json()
    console.log("Datos reales de emociones obtenidos:", data)
    return data
  } catch (error) {
    console.error("Error al obtener emociones:", error)
    // Propagar el error para que el componente pueda manejarlo
    throw error
  }
}
