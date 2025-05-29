import { fetchWithAuth } from "@/lib/api-config"

// Interfaces para los datos de la API
export interface Persona {
  persona_id: number
  nombres: string
  apellidos: string
  tipo_documento?: string
  numero_documento?: string
  genero_id?: number
  estado_civil_id?: number
}

export interface Colegio {
  colegio_id: number
  nombre: string
  nombre_fantasia?: string
  tipo_colegio?: string
  direccion?: string
  telefono_contacto?: string
  correo_electronico?: string
  comuna_id?: number
  region_id?: number
  pais_id?: number
}

export interface TeacherApiResponse {
  docente_id: number
  persona_id: number
  colegio_id: number
  especialidad: string
  estado: string
  creado_por: number
  actualizado_por: number
  fecha_creacion: string
  fecha_actualizacion: string
  activo: boolean
  personas: {
    nombres: string
    apellidos: string
    persona_id: number
  }
  colegios: {
    nombre: string
    colegio_id: number
  }
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
  document?: string
  documentType?: string
  school: string
  schoolType?: string
  email?: string
}

// Datos de ejemplo para usar como fallback
// const exampleTeachers: Teacher[] = [
//   {
//     id: "1",
//     name: "Palomina Gutierrez",
//     level: "Cuartos básicos",
//     course: "A",
//     subject: "Matemáticas",
//     type: "Principal",
//     age: 28,
//     image: "/smiling-woman-garden.png",
//     status: "Activo",
//     document: "12345678",
//     documentType: "DNI",
//     school: "Colegio Horizonte",
//     schoolType: "Privado",
//     email: "pgutierrez@colegiohorizonte.cl",
//   },
//   {
//     id: "2",
//     name: "Matías Ignacio Díaz",
//     level: "Cuartos básicos",
//     course: "B",
//     subject: "Comunicación",
//     type: "No asignado",
//     age: 28,
//     image: "/young-man-city.png",
//     status: "Activo",
//     document: "87654321",
//     documentType: "DNI",
//     school: "Colegio Horizonte",
//     schoolType: "Privado",
//     email: "mdiaz@colegiohorizonte.cl",
//   },
// ]

// Función para mapear los datos de la API al formato que espera la UI
const mapApiDataToTeachers = (apiData: TeacherApiResponse[]): Teacher[] => {
  console.log("Datos de docentes recibidos:", apiData)
  if (!Array.isArray(apiData) || apiData.length === 0) {
    console.warn("No se recibieron datos de docentes de la API o el formato es incorrecto")
    return []
  }

  return apiData.map((item) => ({
    id: item.docente_id.toString(),
    name: `${item.personas.nombres} ${item.personas.apellidos}`,
    subject: item.especialidad,
    status: item.estado.toLowerCase(),
    school: item.colegios.nombre,
    // Campos opcionales o que no vienen en la API
    level: "",
    course: "",
    type: "",
    age: undefined,
    image: "/young-man-city.png"
   
  }))
}

// Función para obtener todos los docentes
export const getAllTeachers = async (): Promise<Teacher[]> => {
  try {
    // console.log("Obteniendo lista de docentes...")
    const response = await fetchWithAuth("/docentes", {
      method: "GET",
    })

    if (!response.ok) {
      throw new Error(`Error al obtener docentes: ${response.status} ${response.statusText}`)
    }

    const data: TeacherApiResponse[] = await response.json()
    // console.log(`Se obtuvieron ${data.length} docentes de la API`)

    return mapApiDataToTeachers(data)
  } catch (error) {
    console.error("Error al obtener docentes:", error)
    console.log("Usando datos de ejemplo como fallback")
    throw error
  }
}

// Función para obtener un docente específico
export async function getTeacherById(id: string): Promise<TeacherApiResponse | null> {
  try {
    const response = await fetchWithAuth(`/docentes/detalle/${id}`)
    if (!response.ok) {
      throw new Error('Error al obtener los datos del docente')
    }
    const data = await response.json() as TeacherApiResponse
    console.log("Datos del docente:", data)
    
    return data
  } catch (error) {
    console.error('Error al obtener el docente:', error)
    // Si hay un error, devolver un docente de ejemplo
   throw error
  }
}

/**
 * Elimina un docente por su ID
 * @param id - ID del docente a eliminar
 * @returns Promise que se resuelve a true si se eliminó correctamente, false en caso contrario
 */
export async function deleteTeacher(id: string): Promise<boolean> {
  try {
    const response = await fetchWithAuth(`/docentes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error('Error al eliminar el docente')
    }
    
    return true
  } catch (error) {
    console.error('Error al eliminar el docente:', error)
    return false
  }
}
