import { fetchWithAuth } from "@/lib/api-config"

// Interfaces para los datos de la API
export interface Persona {
  persona_id: number
  tipo_documento: string
  numero_documento: string
  nombres: string
  apellidos: string
  genero_id: number
  estado_civil_id: number
}

export interface Colegio {
  colegio_id: number
  nombre: string
  nombre_fantasia: string
  tipo_colegio: string
  direccion: string
  telefono_contacto: string
  correo_electronico: string
  comuna_id: number
  region_id: number
  pais_id: number
}

export interface TeacherApiResponse {
  docente_id: number
  persona_id: number
  colegio_id: number
  especialidad: string
  estado: string
  persona: Persona
  colegio: Colegio
}

// Interfaz para los datos que usará la UI
export interface Teacher {
  id: string
  name: string
  level?: string
  course?: string
  subject: string
  type?: string
  age?: number
  image?: string
  status: string
  document: string
  documentType: string
  school: string
  schoolType: string
  email?: string
}

// Datos de ejemplo para usar como fallback
const exampleTeachers: Teacher[] = [
  {
    id: "1",
    name: "Palomina Gutierrez",
    level: "Cuartos básicos",
    course: "A",
    subject: "Matemáticas",
    type: "Principal",
    age: 28,
    image: "/smiling-woman-garden.png",
    status: "Activo",
    document: "12345678",
    documentType: "DNI",
    school: "Colegio Horizonte",
    schoolType: "Privado",
    email: "pgutierrez@colegiohorizonte.cl",
  },
  {
    id: "2",
    name: "Matías Ignacio Díaz",
    level: "Cuartos básicos",
    course: "B",
    subject: "Comunicación",
    type: "No asignado",
    age: 28,
    image: "/young-man-city.png",
    status: "Activo",
    document: "87654321",
    documentType: "DNI",
    school: "Colegio Horizonte",
    schoolType: "Privado",
    email: "mdiaz@colegiohorizonte.cl",
  },
]

// Función para mapear los datos de la API al formato que espera la UI
const mapApiDataToTeachers = (apiData: TeacherApiResponse[]): Teacher[] => {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    console.warn("No se recibieron datos de docentes de la API o el formato es incorrecto")
    return []
  }

  return apiData.map((item) => ({
    id: item.docente_id.toString(),
    name: `${item.persona.nombres} ${item.persona.apellidos}`,
    subject: item.especialidad,
    status: item.estado,
    document: item.persona.numero_documento,
    documentType: item.persona.tipo_documento,
    school: item.colegio.nombre,
    schoolType: item.colegio.tipo_colegio,
    // Campos opcionales o que no vienen en la API
    level: "",
    course: "",
    type: "",
    age: undefined,
    image: item.persona.genero_id === 1 ? "/young-man-city.png" : "/smiling-woman-garden.png", // Asignar imagen según género
    email: item.colegio.correo_electronico,
  }))
}

// Función para obtener todos los docentes
export const getAllTeachers = async (): Promise<Teacher[]> => {
  try {
    console.log("Obteniendo lista de docentes...")
    const response = await fetchWithAuth("/docentes", {
      method: "GET",
    })

    if (!response.ok) {
      throw new Error(`Error al obtener docentes: ${response.status} ${response.statusText}`)
    }

    const data: TeacherApiResponse[] = await response.json()
    console.log(`Se obtuvieron ${data.length} docentes de la API`)

    return mapApiDataToTeachers(data)
  } catch (error) {
    console.error("Error al obtener docentes:", error)
    console.log("Usando datos de ejemplo como fallback")
    return exampleTeachers
  }
}

// Función para obtener un docente específico
export const getTeacherById = async (id: string): Promise<Teacher | null> => {
  try {
    console.log(`Obteniendo docente con ID ${id}...`)
    const response = await fetchWithAuth(`/docentes/${id}`, {
      method: "GET",
    })

    if (!response.ok) {
      throw new Error(`Error al obtener docente: ${response.status} ${response.statusText}`)
    }

    const data: TeacherApiResponse = await response.json()
    const teachers = mapApiDataToTeachers([data])

    return teachers.length > 0 ? teachers[0] : null
  } catch (error) {
    console.error(`Error al obtener docente con ID ${id}:`, error)
    console.log("Usando datos de ejemplo como fallback")
    return exampleTeachers.find((teacher) => teacher.id === id) || null
  }
}
