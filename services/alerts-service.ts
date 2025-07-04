import { fetchApi, fetchWithAuth } from "@/lib/api-config";
import { DataPoint } from "@/components/line-chart-comparison";
import { Persona } from "./teachers-service";

// Interfaces para los datos de la API según la estructura real
interface ApiPerson {
  nombres: string;
  apellidos: string;
  persona_id: number;
}

interface ApiAlertStudent {
  alumno_id: number;
  personas: {
    nombres: string;
    apellidos: string;
    persona_id: number;
  };
  url_foto_perfil?: string;
}

interface ApiAlertRule {
  nombre: string;
  alerta_regla_id: number;
}

interface ApiAlertOrigin {
  nombre: string;
  alerta_origen_id: number;
}

export interface ApiAlertSeverity {
  nombre: string;
  alerta_severidad_id: number;
}

export interface ApiAlertPriority {
  nombre: string;
  alerta_prioridad_id: number;
}

interface AlertState {
  alerta_estado_id: number;
  nombre_alerta_estado: string;
  creado_por: number;
  fecha_creacion: string;
  actualizado_por: number;
  fecha_actualizacion: string;
  activo: boolean;
}

interface ApiAlertType {
  nombre: string;
  alerta_tipo_id: number;
}

export interface AlertPage {
  id: number;
  student: {
    name: string;
    image: string;
    alumno_id: number;
    course: string;
  };
  generationDate: string;
  generationTime: string;
  responsible?: {
    name: string;
    image: string;
  };
  isAnonymous: boolean;
  description: string;
  actions: any[];
  regla: string;
  origen: string;
  tipo: string;
  prioridad: string;
  prioridad_id: number;
  severidad: string;
  severidad_id: number;
}

export interface ApiAlert {
  alumno_alerta_id: number;
  alumno_id: number;
  alerta_regla_id: number;
  fecha_generada: string;
  fecha_resolucion: string | null;
  alerta_origen_id: number;
  prioridad_id: number;
  severidad_id: number;
  accion_tomada: string | null;
  leida: boolean;
  responsable_actual_id: number | null;
  estado: string;
  creado_por: number;
  actualizado_por: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  activo: boolean;
  alertas_tipo_alerta_tipo_id: number;
  mensaje: string | null;
  alumnos: ApiAlertStudent;
  alertas_reglas: ApiAlertRule;
  alertas_origenes: ApiAlertOrigin;
  alertas_severidades: ApiAlertSeverity;
  alertas_prioridades: ApiAlertPriority;
  alertas_tipos: ApiAlertType;
  personas: ApiPerson | null;
  persona_responsable_actual: ApiPerson | null;
}

// Interfaces para la UI
export interface Alert {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  status: string;
  priority: string;
  type: string;
  student?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

// Función para convertir el formato de la API al formato de la UI
function mapApiAlertsToAlerts(apiAlerts: ApiAlert[]): Alert[] {
  return apiAlerts.map((apiAlert) => {
    try {
      // Verificar que los objetos necesarios existan
      if (!apiAlert) {
        console.error("Alert object is undefined");
        throw new Error("Alert object is undefined");
      }

      // Verificar que el objeto alumno exista
      if (!apiAlert.alumnos) {
        console.error(
          "Student object is undefined for alert:",
          apiAlert.alumno_alerta_id
        );
        throw new Error("Student object is undefined");
      }

      // Extraer la hora y fecha de fecha_generada con manejo seguro
      let formattedDate = "01/01/2023";
      let formattedTime = "00:00";

      try {
        if (apiAlert.fecha_generada) {
          const generatedDate = new Date(apiAlert.fecha_generada);
          formattedDate = generatedDate.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          formattedTime = generatedDate.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          });
        }
      } catch (dateError) {
        console.error("Error parsing date:", dateError);
      }

      // Acceso seguro a propiedades con valores por defecto
      const studentName =
        apiAlert.alumnos.personas.nombres || "Estudiante sin nombre";
      const studentLastName =
        apiAlert.alumnos.personas.apellidos || "Estudiante sin apellidos";
      const studentId = apiAlert.alumno_id.toString() || "0";

      // Mapear tipo de alerta
      let alertType = apiAlert.alertas_tipos.nombre || "General";
      // Convertir primera letra a mayúscula
      alertType = alertType.charAt(0).toUpperCase() + alertType.slice(1);

      // Mapear prioridad
      let priority = "Media";

      if (apiAlert.alertas_prioridades) {
        if (apiAlert.alertas_prioridades.nombre) {
          const nivel = apiAlert.alertas_prioridades.nombre.toLowerCase();
          if (nivel === "alta") priority = "Alta";
          else if (nivel === "media") priority = "Media";
          else if (nivel === "baja") priority = "Baja";
        }
      }

      // Mapear el estado
      let status = apiAlert.estado || "Pendiente";
      // Asegurarse de que la primera letra sea mayúscula
      status = status.charAt(0).toUpperCase() + status.slice(1);

      // Crear la imagen del estudiante (aleatoria)
      // const studentImages = ["/smiling-woman-garden.png", "/young-man-city.png", "/confident-businessman.png"]
      const studentImage =
        apiAlert.alumnos.url_foto_perfil || "/confident-businessman.png";

      return {
        id: apiAlert.alumno_alerta_id.toString(),
        title: alertType,
        description: alertType, // Using tipo_alerta as description
        date: formattedDate,
        time: formattedTime,
        status: status,
        priority: priority,
        type: alertType,
        student: {
          id: studentId,
          name: studentName,
          lastName: studentLastName,
          avatar: studentImage,
        },
      };
    } catch (error) {
      console.error("Error mapping alert:", error);
      // Devolver un objeto de alerta por defecto en caso de error
      throw error;
    }
  });
}

// Función para obtener todas las alertas
export async function fetchAlerts(): Promise<Alert[]> {
  try {
    const response = await fetchWithAuth("/alumnos/alertas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Intentar leer el mensaje de error
      const errorText = await response.text();
      console.error(
        `Error en respuesta API (alumnos/alertas): ${response.status} - ${errorText}`
      );

      throw new Error(
        `Error al obtener alertas: ${response.status} - ${errorText}`
      );
    }

    // Intentar parsear la respuesta como JSON
    const apiAlerts: ApiAlert[] = await response.json();
    console.log("Datos reales de alertas obtenidos:", apiAlerts);

    // Convertir los datos de la API al formato de la UI
    const alerts = mapApiAlertsToAlerts(apiAlerts);
    return alerts;
  } catch (error) {
    console.error("Error al obtener alertas:", error);
    // Usar datos de ejemplo en caso de error
    throw error;
  }
}

// Función para obtener una alerta por ID
export async function fetchAlertById(id: number): Promise<AlertPage | null> {
  try {
    console.log(`Obteniendo alerta con ID ${id}...`);

    // Intentar obtener todas las alertas
    const response = await fetchWithAuth(`/alumnos/alertas/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("error en la petición");
    const alert = await response.json();
    console.log("detalle Alerta", alert);

    if (!alert) {
      console.error(`No se encontró ninguna alerta con ID ${id}`);
      throw new Error(`No se encontró ninguna alerta con ID ${id}`);
    }
    if (Array.isArray(alert)) return alert[0];
    return alert;
  } catch (error) {
    console.error(`Error al obtener alerta con ID ${id}:`, error);
    throw error;
  }
}

export async function fetchRecentAlerts(): Promise<Alert[]> {
  try {
    console.log("Fetching recent alerts from API...");
    const response = await fetchWithAuth("/alertas/recientes", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching recent alerts: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Recent alerts data:", data);
    return data;
  } catch (error) {
    console.error("Error in fetchRecentAlerts:", error);
    throw error;
  }
}

/**
 * Marks an alert as read by its ID
 * @param alertId The ID of the alert to mark as read
 * @returns Promise that resolves to true if successful
 */
export async function changeLeida(alertId: string | number): Promise<boolean> {
  try {
    const response = await fetchWithAuth(
      `/alumnos/alertas/${alertId}?cambiar_lectura=true`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leida: true }),
      }
    );

    if (!response.ok) {
      throw new Error("Error al actualizar el estado de la alerta");
    }

    return true;
  } catch (error) {
    console.error("Error en changeLeida:", error);
    throw error;
  }
}

//funcion para la data del chartLine de comparativo
export async function fetchTotalAlertsChartLine(): Promise<DataPoint[]> {
  try {
    console.log("Obteniendo Alertas...");
    const response = await fetchWithAuth("/comparativa/alerts/totales", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Error al obtener alertas: ${response.status} - ${errorText}`
      );
      throw new Error(
        `Error al obtener alertas: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Alertas totales obtenodas:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener emociones:", error);
    throw error;
  }
}
export async function fetchTotalAlertsHistoricoChartLine(): Promise<
  DataPoint[]
> {
  try {
    console.log("Obteniendo Alertas...");
    const response = await fetchWithAuth("/comparativa/alerts/historial", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Error al obtener alertas: ${response.status} - ${errorText}`
      );
      throw new Error(
        `Error al obtener alertas: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Alertas totales obtenodas:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener emociones:", error);
    throw error;
  }
}

export interface CreateAccionAlertParams {
  alumno_alerta_id: number;
  alumno_id: number;
  plan_accion: string;
  fecha_compromiso: string;
  fecha_realizacion: string;
  url_archivo?: string;
}

/**
 * Crea una nueva acción de alerta en la bitácora
 * @param data Datos de la acción a crear
 * @returns La acción creada
 */
export const createAccionAlert = async (data: CreateAccionAlertParams) => {
  try {
    const response = await fetch(
      "https://api-almaia.onrender.com/api/v1/alumnos/alertas_bitacoras",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          alumno_alerta_id: data.alumno_alerta_id,
          alumno_id: data.alumno_id,
          plan_accion: data.plan_accion,
          fecha_compromiso: data.fecha_compromiso,
          fecha_realizacion: data.fecha_realizacion,
          url_archivo: data.url_archivo || "",
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Error al crear la acción de alerta"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createAccionAlert:", error);
    throw error;
  }
};

// Interfaces para bitácora de alertas
export interface AlumnoAlertaBitacora {
  alumno_alerta_id: number;
  alumno_id: number;
  plan_accion: string; // OBLIGATORIO
  fecha_compromiso?: string;
  fecha_realizacion?: string;
  url_archivo?: string;
  alerta_prioridad_id: number;
  alerta_severidad_id: number;
  responsable_id: number;
  // observaciones?: string // ELIMINAR ESTA LÍNEA
}

export interface BitacoraResponse {
  alumno_alerta_bitacora_id: number;
  alumno_alerta_id: number;
  alumno_id: number;
  plan_accion: string;
  fecha_compromiso: string;
  fecha_realizacion: string | null;
  url_archivo: string | null;
  creado_por: number;
  actualizado_por: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  activo: boolean;
  alumno?: {
    alumno_id: number;
    nombre: string;
    curso_actual: string;
  };
  alerta?: {
    alumno_alerta_id: number;
    tipo_alerta: string;
    estado: string;
    severidad: string;
  };
}

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
export interface AlertDetailResponse {
  alumno_alerta_id: number;
  alumno_id: number;
  alerta_regla_id: number;
  fecha_generada: string;
  fecha_resolucion: string | null;
  alerta_origen_id: number;
  prioridad_id: number;
  severidad_id: number;
  accion_tomada: string | null;
  leida: boolean;
  responsable_actual_id: number;
  estado: string;
  creado_por: number;
  actualizado_por: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  activo: boolean;
  alertas_tipo_alerta_tipo_id: number;
  alumnos: {
    personas: {
      nombres: string;
      apellidos: string;
      persona_id: number;
    };
    alumno_id: number;
    url_foto_perfil: string;
  };
  alertas_reglas: {
    nombre: string;
    alerta_regla_id: number;
  };
  alertas_origenes: {
    nombre: string;
    alerta_origen_id: number;
  };
  alertas_severidades: {
    nombre: string;
    alerta_severidad_id: number;
  };
  alertas_prioridades: {
    nombre: string;
    alerta_prioridad_id: number;
  };
  alertas_tipos: {
    nombre: string;
    alerta_tipo_id: number;
  };
}

// Crear nueva bitácora
export async function createAlertBitacora(
  bitacoraData: AlumnoAlertaBitacora
): Promise<BitacoraResponse> {
  console.log(bitacoraData);

  const response = await fetchWithAuth("/alumnos/alertas_bitacoras", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bitacoraData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Error al crear bitácora: ${response.status} - ${errorText}`
    );
  }

  return await response.json();
}

// Obtener bitácoras de una alerta
export async function fetchAlertBitacoras(
  alertaId?: number
): Promise<BitacoraResponse[]> {
  let endpoint = "/alumnos/alertas_bitacoras";
  if (alertaId) {
    endpoint += `?alumno_alerta_id=${alertaId}`;
  }

  const response = await fetchApi(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Error al obtener bitácoras: ${response.status} - ${errorText}`
    );
  }

  return await response.json();
}

// Obtener detalle de alerta
export async function fetchAlertDetail(
  alertaId: number
): Promise<AlertDetailResponse> {
  const response = await fetchWithAuth(`/alumnos/alertas/${alertaId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Error al obtener detalle de alerta: ${response.status} - ${errorText}`
    );
  }

  const data = await response.json();
  // El backend retorna un array, tomamos el primer elemento
  return Array.isArray(data) ? data[0] : data;
}

// Actualizar bitácora
export async function updateAlertBitacora(
  bitacoraId: number,
  bitacoraData: Partial<AlumnoAlertaBitacora>
): Promise<BitacoraResponse> {
  const response = await fetchWithAuth(
    `/alumnos/alertas_bitacoras/${bitacoraId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bitacoraData),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Error al actualizar bitácora: ${response.status} - ${errorText}`
    );
  }

  return await response.json();
}

// Eliminar bitácora (soft delete - marca como inactivo)
export async function deleteAlertBitacora(bitacoraId: number): Promise<void> {
  const response = await fetchWithAuth(
    `/alumnos/alertas_bitacoras/${bitacoraId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Error al eliminar bitácora: ${response.status} - ${errorText}`
    );
  }
}
export async function fetchSeverity(): Promise<ApiAlertSeverity[]> {
  try {
    console.log("Obteniendo lista de grados desde la API...");

    // Realizar la solicitud GET a la API
    const response = await fetchWithAuth("/alertas/alertas_severidades", {
      method: "GET",
    });
    // Si la respuesta no es exitosa, lanzar un error
    if (!response.ok) {
      // Intentar leer el mensaje de error
      const errorText = await response.text();
      throw new Error(
        `Error al obtener alumnos: ${response.status} - ${errorText}`
      );
    }

    // Intentar parsear la respuesta como JSON
    const apiStudents = await response.json();

    // Transformar los datos de la API a nuestro modelo de Student
    console.log("Estudiantes transformados:", apiStudents);
    return apiStudents;
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
    throw error; // Propagar el error para que se maneje en el componente
  }
}
export async function fetchPrority(): Promise<ApiAlertPriority[]> {
  try {
    console.log("Obteniendo lista de grados desde la API...");

    // Realizar la solicitud GET a la API
    const response = await fetchWithAuth("/alertas/alertas_prioridades", {
      method: "GET",
    });
    // Si la respuesta no es exitosa, lanzar un error
    if (!response.ok) {
      // Intentar leer el mensaje de error
      const errorText = await response.text();
      throw new Error(
        `Error al obtener alumnos: ${response.status} - ${errorText}`
      );
    }

    // Intentar parsear la respuesta como JSON
    const apiStudents = await response.json();

    // Transformar los datos de la API a nuestro modelo de Student
    console.log("Estudiantes transformados:", apiStudents);
    return apiStudents;
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
    throw error; // Propagar el error para que se maneje en el componente
  }
}
export async function fetchStates(): Promise<AlertState[]> {
  try {
    const response = await fetchApi("/alertas/alertas_estado", {
      method: "GET",
    });
    // Si la respuesta no es exitosa, lanzar un error
    if (!response.ok) {
      // Intentar leer el mensaje de error
      const errorText = await response.text();
      throw new Error(
        `Error al obtener alumnos: ${response.status} - ${errorText}`
      );
    }

    // Intentar parsear la respuesta como JSON
    const apiStudents = await response.json();

    // Transformar los datos de la API a nuestro modelo de Student
    console.log("Estudiantes transformados:", apiStudents);
    return apiStudents;
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
    throw error; // Propagar el error para que se maneje en el componente
  }
}

export async function fetchEquipoAlma(): Promise<Persona[]> {
  try {
    console.log("Obteniendo lista de grados desde la API...");

    // Realizar la solicitud GET a la API
    const response = await fetchWithAuth("/personas?rol_id=3", {
      method: "GET",
    });
    // Si la respuesta no es exitosa, lanzar un error
    if (!response.ok) {
      // Intentar leer el mensaje de error
      const errorText = await response.text();
      throw new Error(
        `Error al obtener personas: ${response.status} - ${errorText}`
      );
    }

    // Intentar parsear la respuesta como JSON
    const apiStudents = await response.json();

    // Transformar los datos de la API a nuestro modelo de Student
    console.log("Estudiantes transformados:", apiStudents);
    return apiStudents;
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
    throw error; // Propagar el error para que se maneje en el componente
  }
}

export interface UpdateAlertParams {
  id: number;
  alumno_alerta_id: number;
  alumno_id: number;
  alerta_regla_id: number;
  prioridad_id: number;
  severidad_id: number;
  responsable_actual_id: string;
  estado: string;
  accion_tomada?: string;
  tipo_id?: string;
}

export interface UpdateBitacoraParams {
  alumno_alerta_id: number;
  alumno_id: number;
  plan_accion: string;
  fecha_compromiso: string;
  fecha_realizacion?: string;
  url_archivo?: string;
}

export async function updateAlert(
  alertData: UpdateAlertParams
): Promise<ApiAlert> {
  try {
    const response = await fetch(
      "https://api-almaia.onrender.com/api/v1/alumnos/alertas/" + alertData.id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          alumno_alerta_id: alertData.alumno_alerta_id,
          alumno_id: alertData.alumno_id,
          alerta_regla_id: alertData.alerta_regla_id,
          prioridad_id: alertData.prioridad_id,
          severidad_id: alertData.severidad_id,
          responsable_actual_id: alertData.responsable_actual_id,
          estado: alertData.estado,
          accion_tomada: alertData.accion_tomada,
          // fecha_resolucion: alertData.fecha_resolucion || null,
          actualizado_por: 1,
          alertas_tipos: {
            alerta_tipo_id: alertData.tipo_id ? parseInt(alertData.tipo_id) : 1,
          },
          alertas_prioridades: {
            alerta_prioridad_id: alertData.prioridad_id,
          },
          alertas_severidades: {
            alerta_severidad_id: alertData.severidad_id,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar la alerta");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en updateAlert:", error);
    throw error;
  }
}

export async function getPowerUsers(): Promise<PowerUser[]> {
  try {
    // Realizar la solicitud GET a la API
    const response = await fetchApi("/auth/usuarios/", {
      method: "GET",
    });
    // Si la respuesta no es exitosa, lanzar un error
    if (!response.ok) {
      // Intentar leer el mensaje de error
      const errorText = await response.text();
      throw new Error(
        `Error al obtener personas: ${response.status} - ${errorText}`
      );
    }

    // Intentar parsear la respuesta como JSON
    const apiStudents = await response.json();
    const filteredStudents = apiStudents.filter((student: PowerUser) =>
      [5, 6, 7].includes(student.rol_id)
    );

    // Transformar los datos de la API a nuestro modelo de Student
    return filteredStudents;
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
    throw error; // Propagar el error para que se maneje en el componente
  }
}

export async function updateBitacora(
  bitacoraData: UpdateBitacoraParams
): Promise<any> {
  try {
    const response = await fetchApi(
      `/alumnos/alertas_bitacoras/${bitacoraData.alumno_alerta_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(bitacoraData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar la bitácora");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en updateBitacora:", error);
    throw error;
  }
}

export async function updateAlertAndBitacora(
  alertData: UpdateAlertParams,
  bitacoraData: UpdateBitacoraParams
): Promise<[any, any]> {
  try {
    // Ejecutar ambas actualizaciones en paralelo
    const [alertResponse, bitacoraResponse] = await Promise.all([
      updateAlert(alertData),
      createAccionAlert(bitacoraData),
    ]);

    return [alertResponse, bitacoraResponse];
  } catch (error) {
    console.error("Error en updateAlertAndBitacora:", error);
    throw error;
  }
}
