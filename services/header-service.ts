import { fetchWithAuth } from "@/lib/api-config";
import {
  ApiStudent,
  mapApiStudentsToStudents,
  Student,
} from "./students-service";
import { cacheService } from "@/lib/cache-service";

export async function getNotificationCount(): Promise<number> {
  const cacheKey = "notification-count";

  const cachedCount = cacheService.get<number>(cacheKey);
  if (cachedCount !== null) {
    return cachedCount;
  }

  try {
    const response = await fetchWithAuth(`/alumnos/alertas/conteo`);

    if (!response.ok) {
      throw new Error("Error al obtener el conteo de notificaciones");
    }

    const data = (await response.json()) as { count: number };
    const count = data.count || 0;

    // Cache por 2 minutos
    cacheService.set(cacheKey, count, 2 * 60 * 1000);

    return count;
  } catch (error) {
    return 0;
  }
}
export async function searchStudents(term: string): Promise<Student[]> {
  try {
    const storedCursos =
      typeof window !== "undefined"
        ? localStorage.getItem("docente_cursos")
        : null;

    let bodyPayload: { termino: string; cursos?: number[] } = {
      termino: term,
    };

    if (storedCursos) {
      try {
        const cursoIds = JSON.parse(storedCursos);
        if (Array.isArray(cursoIds) && cursoIds.length > 0) {
          bodyPayload.cursos = cursoIds;
        }
      } catch {
        console.warn("No se pudo parsear 'docente_cursos' de localStorage.");
      }
    }

    const response = await fetchWithAuth("/alumnos/buscar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyPayload),
    });

    if (!response.ok) {
      throw new Error("Error al buscar alumnos");
    }

    const data = (await response.json()) as ApiStudent[];
    const students = mapApiStudentsToStudents(data);
    return students || [];
  } catch (error) {
    throw error;
  }
}
