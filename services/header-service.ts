import { fetchWithAuth } from "@/lib/api-config";
import {
  ApiStudent,
  mapApiStudentsToStudents,
  Student,
} from "./students-service";

export async function getNotificationCount(): Promise<number> {
  try {
    const response = await fetchWithAuth(`/alumnos/alertas/conteo`);

    if (!response.ok) {
      throw new Error("Error al obtener el conteo de notificaciones");
    }

    const data = (await response.json()) as { count: number };
    return data.count || 0;
  } catch (error) {
    // Return a default value in case of error
    return 0;
  }
}

export async function searchStudents(term: string): Promise<Student[]> {
  try {
    const response = await fetchWithAuth(`/alumnos/buscar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ termino: term }),
    });

    if (!response.ok) {
      throw new Error("Error al buscar alumnos");
    }

    const data = (await response.json()) as ApiStudent[];
    const students = mapApiStudentsToStudents(data);
    return students || [];
  } catch (error) {
    throw error; // Re-lanzamos el error para manejarlo en el componente
  }
}
