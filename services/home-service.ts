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
  calendario_fecha_importante_id: number
  colegio_id: number
  curso_id: number
  calendario_escolar_id: number
  titulo: string
  descripcion: string
  fecha: string
  tipo: string
  creado_por: number
  actualizado_por: number
  fecha_creacion: string
  fecha_actualizacion: string
  activo: boolean
  colegios?: {
    nombre: string
    colegio_id: number
  }
  cursos?: {
    grados?: {
      nombre: string
      grado_id: number
    }
    nombre_curso: string
    niveles_educativos?: {
      nombre: string
      nivel_educativo_id: number
    }
  }
  calendarios_escolares?: {
    fecha_fin: string
    ano_escolar: number
    dias_habiles: number
    fecha_inicio: string
    calendario_escolar_id: number
  }
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

// Datos de ejemplo para fechas importantes
export const FALLBACK_IMPORTANT_DATES: ImportantDate[] = [
  {
    calendario_fecha_importante_id: 1,
    colegio_id: 1,
    curso_id: 1,
    calendario_escolar_id: 1,
    titulo: "Inicio de clases",
    descripcion: "Primer día del año escolar",
    fecha: "2025-02-28T00:00:00",
    tipo: "académico",
    creado_por: 1,
    actualizado_por: 1,
    fecha_creacion: "2025-05-12T17:36:28.764228",
    fecha_actualizacion: "2025-05-12T17:36:28.764228",
    activo: true,
    colegios: {
      nombre: "Colegio Bicentenario Santiago Centro",
      colegio_id: 1,
    },
    cursos: {
      grados: {
        nombre: "Quinto Básico",
        grado_id: 9,
      },
      nombre_curso: "1° Medio - Jornada Mañana - Colegio 1",
      niveles_educativos: {
        nombre: "Educación Básica",
        nivel_educativo_id: 1,
      },
    },
    calendarios_escolares: {
      fecha_fin: "2025-12-12T00:00:00",
      ano_escolar: 2025,
      dias_habiles: 190,
      fecha_inicio: "2025-02-28T00:00:00",
      calendario_escolar_id: 1,
    },
  },
  {
    calendario_fecha_importante_id: 2,
    colegio_id: 1,
    curso_id: 1,
    calendario_escolar_id: 1,
    titulo: "Feriado Nacional",
    descripcion: "Día de las Glorias Navales",
    fecha: "2025-05-21T00:00:00",
    tipo: "feriado",
    creado_por: 1,
    actualizado_por: 1,
    fecha_creacion: "2025-05-12T17:36:28.764228",
    fecha_actualizacion: "2025-05-12T17:36:28.764228",
    activo: true,
    colegios: {
      nombre: "Colegio Bicentenario Santiago Centro",
      colegio_id: 1,
    },
  },
  {
    calendario_fecha_importante_id: 3,
    colegio_id: 1,
    curso_id: 1,
    calendario_escolar_id: 1,
    titulo: "Semana de Evaluaciones",
    descripcion: "Evaluaciones finales del primer semestre",
    fecha: "2025-06-05T00:00:00",
    tipo: "académico",
    creado_por: 1,
    actualizado_por: 1,
    fecha_creacion: "2025-05-12T17:36:28.764228",
    fecha_actualizacion: "2025-05-12T17:36:28.764228",
    activo: true,
  },
  {
    calendario_fecha_importante_id: 4,
    colegio_id: 1,
    curso_id: 1,
    calendario_escolar_id: 1,
    titulo: "Vacaciones de Invierno",
    descripcion: "Receso escolar de invierno",
    fecha: "2025-07-10T00:00:00",
    tipo: "vacaciones",
    creado_por: 1,
    actualizado_por: 1,
    fecha_creacion: "2025-05-12T17:36:28.764228",
    fecha_actualizacion: "2025-05-12T17:36:28.764228",
    activo: true,
  },
  {
    calendario_fecha_importante_id: 5,
    colegio_id: 1,
    curso_id: 1,
    calendario_escolar_id: 1,
    titulo: "Día del Profesor",
    descripcion: "Celebración del día del profesor",
    fecha: "2025-10-16T00:00:00",
    tipo: "celebración",
    creado_por: 1,
    actualizado_por: 1,
    fecha_creacion: "2025-05-12T17:36:28.764228",
    fecha_actualizacion: "2025-05-12T17:36:28.764228",
    activo: true,
  },
  {
    calendario_fecha_importante_id: 6,
    colegio_id: 1,
    curso_id: 1,
    calendario_escolar_id: 1,
    titulo: "Fiestas Patrias",
    descripcion: "Celebración de fiestas patrias",
    fecha: "2025-09-18T00:00:00",
    tipo: "feriado",
    creado_por: 1,
    actualizado_por: 1,
    fecha_creacion: "2025-05-12T17:36:28.764228",
    fecha_actualizacion: "2025-05-12T17:36:28.764228",
    activo: true,
  },
  {
    calendario_fecha_importante_id: 7,
    colegio_id: 1,
    curso_id: 1,
    calendario_escolar_id: 1,
    titulo: "Ceremonia de Graduación",
    descripcion: "Ceremonia de graduación de estudiantes",
    fecha: "2025-12-15T00:00:00",
    tipo: "ceremonia",
    creado_por: 1,
    actualizado_por: 1,
    fecha_creacion: "2025-05-12T17:36:28.764228",
    fecha_actualizacion: "2025-05-12T17:36:28.764228",
    activo: true,
  },
]

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

    let data
    try {
      data = await response.json()
      console.log("Datos de fechas importantes (raw):", data)

      // Verificar si los datos tienen el formato esperado
      if (!data || !Array.isArray(data)) {
        console.error("Los datos recibidos no son un array:", data)
        return FALLBACK_IMPORTANT_DATES
      }

      return data
    } catch (parseError) {
      console.error("Error al parsear la respuesta JSON:", parseError)
      return FALLBACK_IMPORTANT_DATES
    }
  } catch (error) {
    console.error("Error al obtener fechas importantes:", error)
    return FALLBACK_IMPORTANT_DATES
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
