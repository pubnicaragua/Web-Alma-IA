"use client";

import { fetchWithAuth } from "@/lib/api-config";

export interface ProfileResponse {
  usuario: {
    creado_por: number;
    actualizado_por: number;
    fecha_creacion: string;
    fecha_actualizacion: string;
    activo: boolean;
    usuario_id: number;
    nombre_social: string;
    email: string;
    encripted_password: string;
    rol_id: number;
    telefono_contacto: string;
    ultimo_inicio_sesion: string;
    estado_usuario: string;
    intentos_inicio_sesion: number;
    persona_id: number;
    idioma_id: number;
    auth_id: string;
    url_foto_perfil: string;
  };
  persona: {
    creado_por: number;
    actualizado_por: number;
    fecha_creacion: string;
    fecha_actualizacion: string;
    activo: boolean;
    persona_id: number;
    tipo_documento: string;
    numero_documento: string;
    nombres: string;
    apellidos: string;
    genero_id: number;
    estado_civil_id: number;
    fecha_nacimiento: string;
    telefono_contacto?: string;
  };
  rol: {
    creado_por: number;
    actualizado_por: number;
    fecha_creacion: string;
    fecha_actualizacion: string;
    activo: boolean;
    nombre: string;
    descripcion: string;
    rol_id: number;
  };
  funcionalidades: Array<{
    id: number;
    nombre: string;
    descripcion: string;
  }>;
}

export async function fetchUserProfile(): Promise<ProfileResponse | null> {
  try {
    const response = await fetchWithAuth("/perfil/obtener", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

export interface UpdateProfileData {
  nombre_social: string;
  email: string;
  encripted_password: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  numero_documento: string;
  telefono_contacto: string;
  url_foto_perfil: string | null;
}

export type ProfileData = UpdateProfileData;

export const updateProfile = async (
  userId: number,
  data: Partial<UpdateProfileData>
): Promise<ProfileResponse> => {
  try {
    const response = await fetchWithAuth(`/alumnos/perfil/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el perfil");
    }

    // Devolver los datos actualizados del perfil
    return await response.json();
  } catch (error) {
    throw error;
  }
};
