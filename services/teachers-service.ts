import { fetchWithAuth } from "@/lib/api-config";

export interface PowerUser {
  usuario_id: number;
  nombre_social: string;
  email: string;
  activo: boolean;
  actualizado_por: number;
  auth_id: string;
  clave_generada: string | null;
  creado_por: number;
  encripted_password: string;
  estado_usuario: string;
  fecha_actualizacion: string;
  fecha_creacion: string;
  idioma_id: number;
  intentos_inicio_sesion: number;
  persona_id: number;
  rol_id: number;
  telefono_contacto: string;
  ultimo_inicio_sesion: string;
  url_foto_perfil: string;

  // Sub-objetos anidados (definidos inline)
  idiomas: {
    idioma_id: number;
    nombre: string;
  };

  personas: {
    persona_id: number;
    nombres: string;
    apellidos: string;
  };

  roles: {
    rol_id: number;
    nombre: string;
  };
}

// Interfaces para los datos de la API
export interface Genero {
  genero_id: number;
  nombre: string;
}

export interface EstadoCivil {
  estado_civil_id: number;
  nombre: string;
}

export interface Persona {
  activo: boolean;
  persona_id: number;
  nombres: string;
  apellidos: string;
  genero_id: number;
  generos: Genero;
  tipo_documento: string;
  numero_documento: string;
  estado_civil_id: number;
  estados_civiles: EstadoCivil;
  fecha_nacimiento: string | null;
  creado_por: number;
  actualizado_por: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface Colegio {
  colegio_id: number;
  nombre: string;
}

export interface TeacherApiResponse {
  docente_id: number;
  persona_id: number;
  colegio_id: number;
  especialidad: string;
  estado: string;
  creado_por: number;
  actualizado_por: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  activo: boolean;
  personas: Persona;
  colegios: Colegio;
}

// Interfaz para los datos que usará la UI
export interface Teacher {
  id: string;
  name: string;
  level?: string;
  course?: string;
  subject: string;
  type?: string;
  age?: number;
  image?: string;
  status: string;
  document?: string;
  documentType?: string;
  school: string;
  schoolType?: string;
  email?: string;
}

// Función para mapear los datos de la API al formato que espera la UI
const mapApiDataToTeachers = (apiData: TeacherApiResponse[]): Teacher[] => {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    console.warn(
      "No se recibieron datos de docentes de la API o el formato es incorrecto"
    );
    return [];
  }

  return apiData.map((item) => ({
    id: item.docente_id.toString(),
    name: `${item.personas.nombres} ${item.personas.apellidos}`,
    subject: item.especialidad,
    status: item.estado.toLowerCase(),
    school: item.colegios.nombre,
    level: "",
    course: "",
    type: "",
    age: undefined,
    image: "https://avatar.iran.liara.run/public",
  }));
};

// Función para obtener todos los docentes
export const getAllTeachers = async (): Promise<Teacher[]> => {
  try {
    const response = await fetchWithAuth("/docentes", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        `Error al obtener docentes: ${response.status} ${response.statusText}`
      );
    }

    const data: TeacherApiResponse[] = await response.json();
    return mapApiDataToTeachers(data);
  } catch (error) {
    throw error;
  }
};

// Función para obtener un docente específico
export async function getTeacherById(
  id: string
): Promise<TeacherApiResponse | null> {
  try {
    const response = await fetchWithAuth(`/docentes/detalle/${id}`);
    if (!response.ok) {
      throw new Error("Error al obtener los datos del docente");
    }
    const data = (await response.json()) as TeacherApiResponse;

    return data;
  } catch (error) {
    // Si hay un error, devolver un docente de ejemplo
    throw error;
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
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el docente");
    }

    return true;
  } catch (error) {
    return false;
  }
}
