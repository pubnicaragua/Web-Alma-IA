import { fetchWithAuth } from "@/lib/api-config"

// Interfaces para la API
export interface ApiReport {
  alumno_informe_id: number
  alumno_id: number
  fecha: string
  url_reporte: string
  tipo: string
  periodo_evaluado: string
  url_anexos: string[]
  observaciones: string
  creado_por: string
  estado: string
}

// Interfaces para la UI
export interface Report {
  id: string
  studentId: string
  date: string
  reportUrl: string
  type: string
  evaluationPeriod: string
  attachments: string[]
  observations: string
  createdBy: string
  status: string
  statusColor: string
}

// Función para convertir el formato de la API al formato de la UI
function mapApiReportsToReports(apiReports: ApiReport[]): Report[] {
  return apiReports.map((apiReport) => {
    // Determinar el color del estado
    let statusColor = "#4CAF50" // Verde por defecto para "Activo"
    if (apiReport.estado === "Inactivo") {
      statusColor = "#F44336" // Rojo para "Inactivo"
    } else if (apiReport.estado === "Pendiente") {
      statusColor = "#FFC107" // Amarillo para "Pendiente"
    } else if (apiReport.estado === "Archivado") {
      statusColor = "#9E9E9E" // Gris para "Archivado"
    }

    // Formatear la fecha
    const date = new Date(apiReport.fecha)
    const formattedDate = date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })

    return {
      id: apiReport.alumno_informe_id.toString(),
      studentId: apiReport.alumno_id.toString(),
      date: formattedDate,
      reportUrl: apiReport.url_reporte,
      type: apiReport.tipo,
      evaluationPeriod: apiReport.periodo_evaluado,
      attachments: apiReport.url_anexos,
      observations: apiReport.observaciones,
      createdBy: apiReport.creado_por,
      status: apiReport.estado,
      statusColor,
    }
  })
}

// Datos de ejemplo para cuando la API no está disponible
const sampleReports: Report[] = [
  {
    id: "801",
    studentId: "101",
    date: "15/06/2023",
    reportUrl: "https://storage.colegio.com/informes/801.pdf",
    type: "Académico",
    evaluationPeriod: "Primer Semestre 2023",
    attachments: ["https://storage.colegio.com/anexos/801-1.pdf"],
    observations: "El alumno muestra mejora en matemáticas",
    createdBy: "profesor.jimenez@colegio.com",
    status: "Activo",
    statusColor: "#4CAF50",
  },
  {
    id: "802",
    studentId: "102",
    date: "20/06/2023",
    reportUrl: "https://storage.colegio.com/informes/802.pdf",
    type: "Conductual",
    evaluationPeriod: "Primer Semestre 2023",
    attachments: ["https://storage.colegio.com/anexos/802-1.pdf", "https://storage.colegio.com/anexos/802-2.pdf"],
    observations: "El alumno ha mejorado su comportamiento en clase",
    createdBy: "orientador.perez@colegio.com",
    status: "Activo",
    statusColor: "#4CAF50",
  },
  {
    id: "803",
    studentId: "103",
    date: "25/06/2023",
    reportUrl: "https://storage.colegio.com/informes/803.pdf",
    type: "Psicológico",
    evaluationPeriod: "Primer Semestre 2023",
    attachments: [],
    observations: "Se recomienda seguimiento por parte del departamento de orientación",
    createdBy: "psicologo.martinez@colegio.com",
    status: "Pendiente",
    statusColor: "#FFC107",
  },
  {
    id: "804",
    studentId: "104",
    date: "30/06/2023",
    reportUrl: "https://storage.colegio.com/informes/804.pdf",
    type: "Académico",
    evaluationPeriod: "Primer Semestre 2023",
    attachments: ["https://storage.colegio.com/anexos/804-1.pdf"],
    observations: "El alumno necesita refuerzo en matemáticas",
    createdBy: "profesor.rodriguez@colegio.com",
    status: "Activo",
    statusColor: "#4CAF50",
  },
  {
    id: "805",
    studentId: "105",
    date: "05/07/2023",
    reportUrl: "https://storage.colegio.com/informes/805.pdf",
    type: "Conductual",
    evaluationPeriod: "Primer Semestre 2023",
    attachments: [],
    observations: "Se ha observado una mejora significativa en su comportamiento",
    createdBy: "orientador.gomez@colegio.com",
    status: "Archivado",
    statusColor: "#9E9E9E",
  },
]

// Función para obtener los informes
export async function fetchReports(): Promise<Report[]> {
  try {
    // Usar el proxy local en lugar de la URL directa
    const response = await fetchWithAuth("/informes/alumnos", {
      method: "GET",
    })

    if (!response.ok) {
      // Si la respuesta no es exitosa, lanzar un error
      const errorText = await response.text()
      console.error("Error en respuesta API (informes):", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })
      throw new Error(`Error al obtener informes: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    // Verificar que data sea un array antes de mapearlo
    if (!Array.isArray(data)) {
      console.error("La respuesta de la API no es un array:", data)
      return sampleReports
    }
    return mapApiReportsToReports(data)
  } catch (error) {
    console.error("Error al obtener informes:", error)
    // En caso de error, devolver datos de ejemplo
    console.log("Usando datos de ejemplo para informes")
    return sampleReports
  }
}

// Función para obtener un informe específico por ID
export async function fetchReportById(id: string): Promise<Report | null> {
  try {
    // Intentar obtener todos los informes
    const reports = await fetchReports()
    // Buscar el informe con el ID especificado
    const report = reports.find((r) => r.id === id)
    return report || null
  } catch (error) {
    console.error(`Error al obtener informe con ID ${id}:`, error)
    // En caso de error, buscar en los datos de ejemplo
    const sampleReport = sampleReports.find((r) => r.id === id)
    return sampleReport || null
  }
}
