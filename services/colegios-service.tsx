import { fetchWithAuth } from "@/lib/api-config";

export interface ColegiosAPI {
    colegio_id: number;
    nombre: string;
    nombre_fantasia: string;
    tipo_colegio: string;
    dependencia: string;
    sitio_web: string;
    direccion: string;
    telefono_contacto: string;
    correo_electronico: string;
    creado_por: number;
    actualizado_por: number;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
    activo: boolean;
    comuna_id: number;
    region_id: number;
    pais_id: number;
}



export async function fetchAllColegios(): Promise<ColegiosAPI[]> {
    try {
        console.log("Obteniendo datos de tarjetas...")
        const response = await fetchWithAuth("/colegios", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error(`Error al obtener datos de los colegios: ${response.status} - ${errorText}`)
            throw new Error(`Error al obtener datos de los colegios: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        console.log("Datos de tarjetas obtenidos:", data)
        return data
    } catch (error) {
        console.error("Error al obtener datos de tarjetas:", error)
        throw error
    }
}