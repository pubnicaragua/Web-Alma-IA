import { fetchWithAuth } from "@/lib/api-config"

// Interfaces para la respuesta de la API
export interface ApiStudent {
  alumno_id: number
  colegio_id: number
  url_foto_perfil: string
  telefono_contacto1: string
  email: string
  telefono_contacto2: string
  activo: boolean
  colegio: {
    colegio_id: number
    nombre: string
    tipo_colegio: string
    comuna_id: number
    region_id: number
    pais_id: number
  }
  // Campos adicionales que podrían venir de la API
  nombre?: string
  apellido?: string
  curso?: string
  nivel?: string
  edad?: number
}

// Interfaz para el modelo de estudiante usado en la UI
export interface Student {
  id: string
  name: string
  level: string
  course: string
  age: number
  status: string
  image?: string
  email?: string
  phone?: string
}

export interface StudentReport {
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

export interface StudentReportFilters {
  alumno_id?: number
  fecha_inicio?: string
  fecha_fin?: string
  tipo?: string
  periodo_evaluado?: string
  estado?: string
}

// Nueva interfaz para la respuesta detallada del alumno
export interface StudentDetailResponse {
  alumno: {
    alumno_id: number
    colegio_id: number
    url_foto_perfil: string
    telefono_contacto1: string
    telefono_contacto2: string
    email: string
    creado_por: number
    actualizado_por: number
    fecha_creacion: Date
    fecha_actualizacion: Date
    activo: boolean
    persona_id: number
    personas: {
      generos: {
        nombre: string
        genero_id: number
      }
      nombres: string
      apellidos: string
      persona_id: number
      fecha_nacimiento: Date
    }
    colegios: {
      nombre: string
      colegio_id: number
    }
    cursos: {
      grados: {
        nombre: string
        grado_id: number
      }
      niveles_educativos: {
        nomber: string
        nivel_educativo_id: number
      }
    }[]
  }
  ficha: {
    alumno_ant_clinico_id: number
    alumno_id: number
    historial_medico: string
    alergias: string
    enfermedades_cronicas: string
    condiciones_medicas_relevantes: string
    medicamentos_actuales: string
    diagnosticos_previos: string
    terapias_tratamiento_curso: string
    creado_por: number
    actualizado_por: number
    fecha_creacion: Date
    fecha_actualizacion: Date
    activo: boolean
  }[]
  alertas: Array<{
    alumno_alerta_id: number
    alumno_id: number
    alerta_regla_id: number
    fecha_generada: string
    fecha_resolucion: string | null
    alerta_origen_id: number
    prioridad_id: number
    severidad_id: number
    accion_tomada: string
    leida: boolean
    activo: boolean
    responsable_actual_id: number
    estado: string
    alertas_tipo_alerta_tipo_id: number
    alertas_reglas: {
      nombre: string
      alerta_regla_id: number
    }
    alertas_origenes: {
      nombre: string
      alerta_origen_id: number
    }
    alertas_severidades: {
      nombre: string
      alerta_severidad_id: number

    }
  }>
  informes: Array<{
    alumno_informe_id: number
    alumno_id: number
    fecha: string
    url_reporte: string
    creado_por: number
    actualizado_por: number
    fecha_creacion: Date
    fecha_actualizacion: Date
    activo: boolean
  }>
  emociones: Array<{
    nombre: string
    valor: number
  }>
  apoderados: Array<{
    alumno_apoderado_id: number
    alumno_id: number
    apoderado_id: number
    tipo_apoderado: string
    observaciones: string
    estado_usuario: string
    creado_por: Date
    actualizado_por: Date
    fecha_creacion: Date
    fecha_actualizacion: Date
    activo: boolean
    apoderados: {
      personas: {
        nombres: string,
        apellidos: string,
        persona_id: 1
      }
      apoderado_id: number,
      email_contacto1: string,
      email_contacto2: string,
      telefono_contacto1: string,
      telefono_contacto2: string
    }
  }>
}

// Datos de ejemplo para usar cuando la API no está disponible
const exampleStudents: Student[] = [
  {
    id: "101",
    name: "Carolina Espina",
    level: "7° Básicos",
    course: "7°A",
    age: 12,
    status: "Bien",
    image: "/smiling-woman-garden.png",
    email: "carolina.espina@ejemplo.com",
    phone: "+56912345678",
  },
  {
    id: "102",
    name: "Martín Soto",
    level: "8° Básicos",
    course: "8°B",
    age: 13,
    status: "Normal",
    image: "/young-man-city.png",
    email: "martin.soto@ejemplo.com",
    phone: "+56923456789",
  },
  {
    id: "103",
    name: "Valentina Rojas",
    level: "6° Básicos",
    course: "6°C",
    age: 11,
    status: "Mal",
    image: "/smiling-woman-garden.png",
    email: "valentina.rojas@ejemplo.com",
    phone: "+56934567890",
  },
  {
    id: "104",
    name: "Diego Muñoz",
    level: "5° Básicos",
    course: "5°A",
    age: 10,
    status: "Bien",
    image: "/young-man-city.png",
    email: "diego.munoz@ejemplo.com",
    phone: "+56945678901",
  },
]

// Función para transformar los datos de la API a nuestro modelo de Student
function mapApiStudentsToStudents(apiStudents: ApiStudent[]): Student[] {
  return apiStudents.map((apiStudent) => {
    // Generar datos aleatorios para los campos que no vienen en la API
    const levels = ["5° Básicos", "6° Básicos", "7° Básicos", "8° Básicos", "9° Básicos"]
    const courses = ["1°A", "2°B", "3°B", "4°A", "5°A", "6°C", "7°A", "8°B"]
    const statuses = ["Bien", "Normal", "Mal"]

    // Extraer el nombre del email si no viene en la API
    let name = apiStudent.nombre || ""
    if (!name && apiStudent.email) {
      const emailParts = apiStudent.email.split("@")[0].split(".")
      if (emailParts.length > 1) {
        name = `${emailParts[1].charAt(0).toUpperCase() + emailParts[1].slice(1)} ${emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1)
          }`
      } else {
        name = emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1)
      }
    }

    return {
      id: apiStudent.alumno_id.toString(),
      name: name,
      level: apiStudent.nivel || levels[Math.floor(Math.random() * levels.length)],
      course: apiStudent.curso || courses[Math.floor(Math.random() * courses.length)],
      age: apiStudent.edad || Math.floor(Math.random() * 8) + 8, // Edad entre 8 y 15
      status: statuses[Math.floor(Math.random() * statuses.length)],
      image:
        apiStudent.url_foto_perfil ||
        ["/smiling-woman-garden.png", "/young-man-city.png"][Math.floor(Math.random() * 2)],
      email: apiStudent.email,
      phone: apiStudent.telefono_contacto1,
    }
  })
}

// Función para obtener informes de estudiantes
export const getStudentReports = async (filters: StudentReportFilters = {}): Promise<StudentReport[]> => {
  try {
    const response = await fetchWithAuth("/informes/alumnos", {
      method: "POST",
      body: JSON.stringify(filters),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || response.statusText || "Error al obtener informes de alumnos")
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}

// Función para obtener la lista de estudiantes
export async function fetchStudents(): Promise<Student[]> {
  try {
    // Realizar la solicitud GET a la API
    const response = await fetchWithAuth("/alumnos", {
      method: "GET",
    })

    // Si la respuesta no es exitosa, lanzar un error
    if (!response.ok) {
      // Intentar leer el mensaje de error
      const errorText = await response.text()

      // Si es un error 404, usar datos de ejemplo
      if (response.status === 404) {
        return exampleStudents
      }

      throw new Error(`Error al obtener alumnos: ${response.status} - ${errorText}`)
    }

    // Intentar parsear la respuesta como JSON
    const apiStudents = (await response.json()) as ApiStudent[]

    // Transformar los datos de la API a nuestro modelo de Student
    const students = mapApiStudentsToStudents(apiStudents)
    return students
  } catch (error) {
    // En caso de error, devolver datos de ejemplo
    return exampleStudents
  }
}

// Función para obtener un estudiante por ID
export async function fetchStudentById(id: string): Promise<Student | null> {
  try {
    // Realizar la solicitud GET a la API
    const response = await fetchWithAuth(`/alumnos/${id}`, {
      method: "GET",
    })

    // Si la respuesta no es exitosa, lanzar un error
    if (!response.ok) {
      // Intentar leer el mensaje de error
      const errorText = await response.text()

      // Si es un error 404, buscar en datos de ejemplo
      if (response.status === 404) {
        const exampleStudent = exampleStudents.find((student) => student.id === id)
        return exampleStudent || null
      }

      throw new Error(`Error al obtener alumno: ${response.status} - ${errorText}`)
    }

    // Intentar parsear la respuesta como JSON
    const apiStudent = (await response.json()) as ApiStudent

    // Transformar los datos de la API a nuestro modelo de Student
    const students = mapApiStudentsToStudents([apiStudent])
    return students[0] || null
  } catch (error) {
    // En caso de error, buscar en datos de ejemplo
    const exampleStudent = exampleStudents.find((student) => student.id === id)
    return exampleStudent || null
  }
}

// Nueva función para obtener los detalles completos de un estudiante
export async function fetchStudentDetails(id: string): Promise<StudentDetailResponse | null> {
  try {
    console.log(`Obteniendo detalles del alumno con ID: ${id}`)

    // Realizar la solicitud GET a la API con la nueva ruta
    const response = await fetchWithAuth(`/alumnos/detalle/${id}`, {
      method: "GET",
    })

    // Si la respuesta no es exitosa, lanzar un error
    if (!response.ok) {
      // Intentar leer el mensaje de error
      const errorText = await response.text()
      console.error(`Error al obtener detalles del alumno: ${response.status} - ${errorText}`)
      throw new Error(`Error al obtener detalles del alumno: ${response.status} - ${errorText}`)
    }

    // Intentar parsear la respuesta como JSON
    const studentDetails = (await response.json()) as StudentDetailResponse
    console.log("Detalles del alumno obtenidos correctamente:", studentDetails)
    return studentDetails
  } catch (error) {
    console.error(`Error en fetchStudentDetails para ID ${id}:`, error)
    // En caso de error, devolver null
    return null
  }
}
