import { fetchWithAuth } from "@/lib/api-config";
import { AlertPagev1 } from "@/services/alerts-service";
import { DataPoint } from "@/components/line-chart-comparison";

// Función para obtener una alerta por ID
export async function fetchAlertById(id: string): Promise<AlertPagev1 | null> {
  try {
    // Intentar obtener todas las alertas
    const response = await fetchWithAuth(`/alumnos/alertas/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("error en la petición");
    const alert = await response.json();

    if (!alert) {
      throw new Error(`No se encontró ninguna alerta con ID ${id}`);
    }
    if (Array.isArray(alert)) return alert[0];
    return alert;
  } catch (error) {
    throw error;
  }
}

// ❌ ENDPOINT INCORRECTO - ELIMINADO
// /alertas/recientes - No existe en backend, usar /home/alertas/recientes en su lugar
// Esta función está duplicada con la de home-service.ts

//funcion para la data del chartLine de comparativo
export async function getComparativaEmotionsCourses(): Promise<any> {
  try {
    const response = await fetchWithAuth("/comparativa/emotions/course", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Error al obtener comparativas: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
