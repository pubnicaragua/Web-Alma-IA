"use client"

import { fetchWithAuth } from "@/lib/api-config"

export interface ProfileResponse {
  usuario: {
    creado_por: number
    actualizado_por: number
    fecha_creacion: string
    fecha_actualizacion: string
    activo: boolean
    usuario_id: number
    nombre_social: string
    email: string
    encripted_password: string
    rol_id: number
    telefono_contacto: string
    ultimo_inicio_sesion: string
    estado_usuario: string
    intentos_inicio_sesion: number
    persona_id: number
    idioma_id: number
    auth_id: string
    url_foto_perfil: string
  }
  persona: {
    creado_por: number
    actualizado_por: number
    fecha_creacion: string
    fecha_actualizacion: string
    activo: boolean
    persona_id: number
    tipo_documento: string
    numero_documento: string
    nombres: string
    apellidos: string
    genero_id: number
    estado_civil_id: number
    fecha_nacimiento: string
  }
  rol: {
    creado_por: number
    actualizado_por: number
    fecha_creacion: string
    fecha_actualizacion: string
    activo: boolean
    nombre: string
    descripcion: string
    rol_id: number
  }
  funcionalidades: Array<{
    funcionalidad_id: number
    nombre: string
    descripcion: string
    creado_por: number
    actualizado_por: number
    fecha_creacion: string
    fecha_actualizacion: string
    activo: boolean
  }>
}

// Datos de ejemplo para usar como fallback
export const FALLBACK_PROFILE_DATA: ProfileResponse = {
  usuario: {
    creado_por: 0,
    actualizado_por: 0,
    fecha_creacion: "2025-05-12T18:21:45.662Z",
    fecha_actualizacion: "2025-05-12T18:21:45.662Z",
    activo: true,
    usuario_id: 1,
    nombre_social: "Juan Pérez",
    email: "juan.perez@example.com",
    encripted_password: "",
    rol_id: 1,
    telefono_contacto: "+123456789",
    ultimo_inicio_sesion: "2025-05-12T18:21:45.662Z",
    estado_usuario: "ACTIVO",
    intentos_inicio_sesion: 0,
    persona_id: 1,
    idioma_id: 1,
    auth_id: "",
    url_foto_perfil: "/confident-businessman.png",
  },
  persona: {
    creado_por: 0,
    actualizado_por: 0,
    fecha_creacion: "2025-05-12T18:21:45.662Z",
    fecha_actualizacion: "2025-05-12T18:21:45.662Z",
    activo: true,
    persona_id: 1,
    tipo_documento: "DNI",
    numero_documento: "12345678",
    nombres: "Juan",
    apellidos: "Pérez",
    genero_id: 1,
    estado_civil_id: 2,
    fecha_nacimiento: "1990-01-01T00:00:00.000Z",
  },
  rol: {
    creado_por: 0,
    actualizado_por: 0,
    fecha_creacion: "2025-05-12T18:21:45.662Z",
    fecha_actualizacion: "2025-05-12T18:21:45.662Z",
    activo: true,
    nombre: "Administrador",
    descripcion: "Acceso completo al sistema",
    rol_id: 1,
  },
  funcionalidades: [
    {
      funcionalidad_id: 1,
      nombre: "Dashboard",
      descripcion: "Acceso al panel principal",
      creado_por: 22,
      actualizado_por: 2,
      fecha_creacion: "2025-05-12T18:21:45.662Z",
      fecha_actualizacion: "2025-05-12T18:21:45.662Z",
      activo: true,
    },
    {
      funcionalidad_id: 2,
      nombre: "Gestión de Usuarios",
      descripcion: "Administrar usuarios del sistema",
      creado_por: 22,
      actualizado_por: 2,
      fecha_creacion: "2025-05-12T18:21:45.662Z",
      fecha_actualizacion: "2025-05-12T18:21:45.662Z",
      activo: true,
    },
  ],
}

export async function fetchUserProfile(): Promise<ProfileResponse | null> {
  try {
    console.log("Obteniendo datos de perfil...")
    const response = await fetchWithAuth("/perfil/obtener", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error al obtener datos de perfil: ${response.status} - ${errorText}`)
      return null
    }

    const data = await response.json()
    console.log("Datos de perfil obtenidos:", data)
    return data
  } catch (error) {
    console.error("Error al obtener datos de perfil:", error)
    return null
  }
}

export async function fetchProfileData(): Promise<ProfileResponse> {
  try {
    console.log("Obteniendo datos de perfil...")
    const response = await fetchWithAuth("/perfil/obtener", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error al obtener datos de perfil: ${response.status} - ${errorText}`)
      throw new Error(`Error al obtener datos de perfil: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("Datos de perfil obtenidos:", data)
    return data
  } catch (error) {
    console.error("Error al obtener datos de perfil:", error)
    console.log("Usando datos de ejemplo para perfil")
    throw error
  }
}
