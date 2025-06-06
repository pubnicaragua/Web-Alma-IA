import { fetchWithAuth } from "@/lib/api-config";
export interface Grade {
  grado_id: number
  nombre: string
  creado_por: number
  estado: string
}

export async function fetchGrade(): Promise<Grade[]> {
  try {
    console.log("Obteniendo lista de grados desde la API...");

    // Realizar la solicitud GET a la API
    const response = await fetchWithAuth("/colegios/grados", {
      method: "GET",
    });
    // Si la respuesta no es exitosa, lanzar un error
    if (!response.ok) {
      // Intentar leer el mensaje de error
      const errorText = await response.text();
      throw new Error(`Error al obtener alumnos: ${ response.status } - ${ errorText }`);
    }

    // Intentar parsear la respuesta como JSON
    const apiStudents = (await response.json());
   
    // Transformar los datos de la API a nuestro modelo de Student
    console.log("Estudiantes transformados:", apiStudents);
    return apiStudents;
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    throw error; // Propagar el error para que se maneje en el componente
  }
}