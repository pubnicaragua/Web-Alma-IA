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

export interface CardData {
  alumnos: {
    activos: number
    inactivos: number
    frecuentes: number
    totales: number
  }
  sos_alma: {
    activos: number
    vencidos: number
    por_vencer: number
    totales: number
  }
  denuncias: {
    activos: number
    vencidos: number
    por_vencer: number
    totales: number
  }
  alertas_alma: {
    activos: number
    vencidos: number
    por_vencer: number
    totales: number
  }
}

export async function fetchCardData(): Promise<CardData> {
  try {
    console.log("Obteniendo datos de tarjetas...")
    const response = await fetchWithAuth("/home/cards/emociones", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error al obtener datos de tarjetas: ${response.status} - ${errorText}`)
      throw new Error(`Error al obtener datos de tarjetas: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("Datos de tarjetas obtenidos:", data)
    return data
  } catch (error) {
    console.error("Error al obtener datos de tarjetas:", error)
    throw error
  }
}

export async function fetchRecentAlerts(): Promise<RecentAlert[]> {
  try {
    console.log("Obteniendo alertas recientes...")
    const response = await fetchWithAuth("/home/alertas/recientes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error al obtener alertas recientes: ${response.status} - ${errorText}`)
      throw new Error(`Error al obtener alertas recientes: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("Alertas recientes obtenidas:", data)
    return data
  } catch (error) {
    console.error("Error al obtener alertas recientes:", error)
    throw error
  }
}

export async function fetchImportantDates(): Promise<ImportantDate[]> {
  try {
    console.log("Obteniendo fechas importantes...")
    const response = await fetchWithAuth("/home/fechas/importantes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error al obtener fechas importantes: ${response.status} - ${errorText}`)
      throw new Error(`Error al obtener fechas importantes: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("Fechas importantes obtenidas:", data)
    return data
  } catch (error) {
    console.error("Error al obtener fechas importantes:", error)
    throw error
  }
}

export async function fetchTotalAlerts(): Promise<TotalAlert[]> {
  try {
    console.log("Obteniendo alertas totales...")
    const response = await fetchWithAuth("/home/alertas/totales", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error al obtener alertas totales: ${response.status} - ${errorText}`)
      throw new Error(`Error al obtener alertas totales: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("Alertas totales obtenidas:", data)
    return data
  } catch (error) {
    console.error("Error al obtener alertas totales:", error)
    throw error
  }
}

export async function fetchEmotions(): Promise<Emotion[]> {
  try {
    console.log("Obteniendo emociones...")
    const response = await fetchWithAuth("/home/emotions/general", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error al obtener emociones: ${response.status} - ${errorText}`)
      throw new Error(`Error al obtener emociones: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("Emociones obtenidas:", data)
    return data
  } catch (error) {
    console.error("Error al obtener emociones:", error)
    throw error
  }
}
