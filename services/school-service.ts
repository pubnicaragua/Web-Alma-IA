import { fetchWithAuth } from "@/lib/api-config"
import { fetchProfileData } from "./profile-service"

// Interfaces para los datos de la API según la estructura real
export interface ApiSchool {
  colegio_id: number
  nombre: string
  nombre_fantasia: string
  tipo_colegio: string
  dependencia: string
  sitio_web: string
  direccion: string
  telefono_contacto: string
  correo_electronico: string
  creado_por: number
  actualizado_por: number | null
  fecha_creacion: string
  fecha_actualizacion: string | null
  activo: boolean
  comuna_id: number
  region_id: number
  pais_id: number,
  alerts: number
  students: number
}


// Interface para el componente
export interface School {
  id: string
  name: string
  fantasyName: string
  type: string
  dependency: string
  website: string
  address: string
  contactPhone: string
  email: string
  alerts: number
  students: number
  color: string
  isActive: boolean
  communeId: number
  regionId: number
  countryId: number
}

export async function loadSchools(): Promise<School[]> {
    try {
      const response = await fetchWithAuth(`/colegios`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error al obtener colegios: ${response.status} - ${errorText}`);
        throw new Error(`Error al obtener colegios: ${response.status} - ${errorText}`);
      }

      const apiSchools = (await response.json()) as ApiSchool[];
      console.log("Colegios obtenidos correctamente:", apiSchools);
      
      // Transformar la respuesta de la API al formato que espera el componente
      return apiSchools.map(school => ({
        id: school.colegio_id.toString(),
        name: school.nombre,
        fantasyName: school.nombre_fantasia,
        type: school.tipo_colegio,
        dependency: school.dependencia,
        website: school.sitio_web,
        address: school.direccion,
        contactPhone: school.telefono_contacto,
        email: school.correo_electronico,
        alerts: 0, // Valor por defecto
        students: 0, // Valor por defecto
        color: "bg-gray-500", // Valor por defecto
        isActive: school.activo,
        communeId: school.comuna_id,
        regionId: school.region_id,
        countryId: school.pais_id
      }));
    } catch (error) {
      console.error("Error en loadSchools:", error);
      throw error;
    }
  }



  export async function loadSchoolsByUsuario_id(usuario_id:number): Promise<School[]> {
    try {

      const response = await fetchWithAuth(`/colegios/usuarios_colegios?usuario_id=${usuario_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error al obtener colegios: ${response.status} - ${errorText}`);
        throw new Error(`Error al obtener colegios: ${response.status} - ${errorText}`);
      }

      const apiSchools = (await response.json()) as ApiSchool[];
      console.log("Colegios de usuarios obtenidos correctamente:", apiSchools);
      
      // Transformar la respuesta de la API al formato que espera el componente
      return apiSchools.map(school => ({
        id: school.colegio_id.toString(),
        name: school.nombre,
        fantasyName: school.nombre_fantasia,
        type: school.tipo_colegio,
        dependency: school.dependencia,
        website: school.sitio_web,
        address: school.direccion,
        contactPhone: school.telefono_contacto,
        email: school.correo_electronico,
        alerts: school.alerts || 0, 
        students: school.students || 0, 
        color: "bg-gray-500", 
        isActive: school.activo,
        communeId: school.comuna_id,
        regionId: school.region_id,
        countryId: school.pais_id
      }));
    } catch (error) {
      console.error("Error en loadSchools:", error);
      throw error;
    }
  }

  /**
   * Obtiene un colegio por su ID
   * @param id ID del colegio a buscar
   * @returns El colegio encontrado o null si no existe
   */
  export async function getSchoolById(id: string | number): Promise<School | null> {
    try {
      const response = await fetchWithAuth(`/colegios`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Colegio no encontrado
        }
        const errorText = await response.text();
        console.error(`Error al obtener el colegio: ${response.status} - ${errorText}`);
        throw new Error(`Error al obtener el colegio: ${response.status} - ${errorText}`);
      }

      const apiSchools = (await response.json()) as ApiSchool[];
      const apiSchool = apiSchools.find((school) => school.colegio_id == id);
      if (!apiSchool) {
        return null; // Colegio no encontrado
      }
      // Transformar la respuesta de la API al formato que espera el componente
      return {
        id: apiSchool.colegio_id.toString(),
        name: apiSchool.nombre,
        fantasyName: apiSchool.nombre_fantasia,
        type: apiSchool.tipo_colegio,
        dependency: apiSchool.dependencia,
        website: apiSchool.sitio_web,
        address: apiSchool.direccion,
        contactPhone: apiSchool.telefono_contacto,
        email: apiSchool.correo_electronico,
        alerts: apiSchool.alerts || 0, 
        students: apiSchool.students || 0, 
        color: "bg-gray-500", 
        isActive: apiSchool.activo,
        communeId: apiSchool.comuna_id,
        regionId: apiSchool.region_id,
        countryId: apiSchool.pais_id
      };
    } catch (error) {
      console.error(`Error en getSchoolById (ID: ${id}):`, error);
      throw error;
    }
  }
