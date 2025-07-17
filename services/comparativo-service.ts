import { fetchWithAuth } from "@/lib/api-config";
import { Alert, Alert as AlertPage } from "@/app/alertas/[id]/page";
import { DataPoint } from "@/components/line-chart-comparison";

// Función para obtener una alerta por ID
export async function fetchAlertById(id: string): Promise<AlertPage | null> {
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

export async function fetchRecentAlerts(): Promise<Alert[]> {
  try {
    const response = await fetchWithAuth("/alertas/recientes", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching recent alerts: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

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
