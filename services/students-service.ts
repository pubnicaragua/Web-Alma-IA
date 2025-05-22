import { fetchWithAuth } from "@/lib/api-config"

// Interfaces para la respuesta de la API
export interface ApiStudent {
  alumno_id: number;
  colegio_id: number;
  url_foto_perfil: string;
  telefono_contacto1: string;
  email: string;
  telefono_contacto2: string;
  creado_por: number;
  actualizado_por: number;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  activo: boolean;
  persona_id: number;
  personas: Personas;
  colegios: Colegios;
  cursos: Curso[];
}

export interface Colegios {
  nombre: string;
  colegio_id: number;
}

export interface Curso {
  grados: Grados;
  niveles_educativos: NivelesEducativos;
}

export interface Grados {
  nombre: string;
  grado_id: number;
}

export interface NivelesEducativos {
  nombre: string;
  nivel_educativo_id: number;
}

export interface Personas {
  nombres: string;
  apellidos: string;
  persona_id: number;
  fecha_nacimiento: string | null;
}

// Interfaz para el modelo de estudiante usado en la UI
export interface Student {
  id: string
  name: string
  level: string
  course: string
  age: number
  status: string
  image?: string
  email?: string
  phone?: string
}

export interface StudentReport {
  alumno_informe_id: number
  alumno_id: number
  fecha: string
  url_reporte: string
  tipo: string
  periodo_evaluado: string
  url_anexos: string[]
  observaciones: string
  creado_por: string
  estado: string
}

export interface StudentReportFilters {
  alumno_id?: number
  fecha_inicio?: string
  fecha_fin?: string
  tipo?: string
  periodo_evaluado?: string
  estado?: string
}

// Nueva interfaz para la respuesta detallada del alumno
export interface StudentDetailResponse {
  alumno: {
    alumno_id: number
    colegio_id: number
    url_foto_perfil: string
    telefono_contacto1: string
    telefono_contacto2: string
    email: string
    creado_por: number
    actualizado_por: number
    fecha_creacion: Date
    fecha_actualizacion: Date
    activo: boolean
    persona_id: number
    personas: {
      generos: {
        nombre: string
        genero_id: number
      }
      nombres: string
      apellidos: string
      persona_id: number
      fecha_nacimiento: Date
    }
    colegios: {
      nombre: string
      colegio_id: number
    }
    cursos: {
      grados: {
        nombre: string
        grado_id: number
      }
      niveles_educativos: {
        nomber: string
        nivel_educativo_id: number
      }
    }[]
  }
  ficha: {
    alumno_ant_clinico_id: number
    alumno_id: number
    historial_medico: string
    alergias: string
    enfermedades_cronicas: string
    condiciones_medicas_relevantes: string
    medicamentos_actuales: string
    diagnosticos_previos: string
    terapias_tratamiento_curso: string
    creado_por: number
    actualizado_por: number
    fecha_creacion: Date
    fecha_actualizacion: Date
    activo: boolean
  }[]
  alertas: Array<{
    alumno_alerta_id: number
    alumno_id: number
    alerta_regla_id: number
    fecha_generada: string
    fecha_resolucion: string | null
    alerta_origen_id: number
    prioridad_id: number
    severidad_id: number
    accion_tomada: string
    leida: boolean
    activo: boolean
    responsable_actual_id: number
    estado: string
    alertas_tipo_alerta_tipo_id: number
    alertas_reglas: {
      nombre: string
      alerta_regla_id: number
    }
    alertas_origenes: {
      nombre: string
      alerta_origen_id: number
    }
    alertas_severidades: {
      nombre: string
      alerta_severidad_id: number
    }
  }>
  informes: Array<{
    alumno_informe_id: number
    alumno_id: number
    fecha: string
    url_reporte: string
    creado_por: number
    actualizado_por: number
    fecha_creacion: Date
    fecha_actualizacion: Date
    activo: boolean
  }>
  emociones: Array<{
    nombre: string
    valor: number
  }>
  apoderados: Array<{
    alumno_apoderado_id: number
    alumno_id: number
    apoderado_id: number
    tipo_apoderado: string
    observaciones: string
    estado_usuario: string
    creado_por: Date
    actualizado_por: Date
    fecha_creacion: Date
    fecha_actualizacion: Date
    activo: boolean
    apoderados: {
      personas: {
        nombres: string,
        apellidos: string,
        persona_id: number
      }
      apoderado_id: number,
      email_contacto1: string,
      email_contacto2: string,
      telefono_contacto1: string,
      telefono_contacto2: string
    }
  }>
}

// Función para transformar los datos de la API a nuestro modelo de Student
function mapApiStudentsToStudents(apiStudents: ApiStudent[]): Student[] {
  try {
    if (!Array.isArray(apiStudents)) {
      console.error("Error: apiStudents no es un array", apiStudents);
      return [];
    }

    return apiStudents.map((apiStudent) => {
      try {
        // Determinar el estado basado en algún criterio (por ejemplo, alertas activas)
        // Como no tenemos un criterio claro, usaremos "Normal" como valor predeterminado
        const status = "Normal";

        // Extraer el nombre completo
        let name = "";
        if (apiStudent.personas?.nombres && apiStudent.personas?.apellidos) {
          name = `${ apiStudent.personas.nombres } ${ apiStudent.personas.apellidos }`;
        } else if (apiStudent.email) {
          const emailParts = apiStudent.email.split("@")[0].split(".");
          if (emailParts.length > 1) {
            name = `${ emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1) } ${ emailParts[1].charAt(0).toUpperCase() + emailParts[1].slice(1) }`;
          } else {
            name = emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1);
          }
        }

        // Calcular edad correctamente
        let age = 0; // Valor por defecto
        if (apiStudent.personas?.fecha_nacimiento) {
          const calculatedAge = calcularEdad(apiStudent.personas.fecha_nacimiento);
          if (calculatedAge > 0) {
            age = calculatedAge;
          }
        }

        // Acceder a nivel y curso correctamente
        let level = "No especificado";
        let course = "No especificado";

        if (apiStudent.cursos && apiStudent.cursos.length > 0) {
          // Obtener el nivel educativo
          if (apiStudent.cursos[0].niveles_educativos?.nombre) {
            level = apiStudent.cursos[0].niveles_educativos.nombre;
          }

          // Obtener el grado/curso
          if (apiStudent.cursos[0].grados?.nombre) {
            course = apiStudent.cursos[0].grados.nombre;
          }
        }

        // Construir el objeto Student
        return {
          id: apiStudent.alumno_id.toString(),
          name: name,
          level: level,
          course: course,
          age: age,
          status: status,
          image: apiStudent.url_foto_perfil || "/placeholder.svg",
          email: apiStudent.email,
          phone: apiStudent.telefono_contacto1,
        };
      } catch (error) {
        console.error("Error al mapear estudiante individual:", error, apiStudent);
        // Devolver un estudiante con datos mínimos para evitar errores en la UI
        return {
          id: apiStudent.alumno_id?.toString() || "0",
          name: "Error en datos",
          level: "No disponible",
          course: "No disponible",
          age: 0,
          status: "Error",
          email: "",
          phone: "",
        };
      }
    });
  } catch (error) {
    console.error("Error en mapApiStudentsToStudents:", error);
    return [];
  }
}

// Calcular edad correctamente
function calcularEdad(fechaNacimiento: Date | string): number {
  try {
    // Asegurarnos de que tenemos un objeto Date
    const fechaNac = typeof fechaNacimiento === 'string'
      ? new Date(fechaNacimiento)
      : fechaNacimiento;

    // Validar que la fecha es válida
    if (isNaN(fechaNac.getTime())) {
      console.warn("Fecha de nacimiento inválida:", fechaNacimiento);
      return 0;
    }

    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    // Ajustar la edad si aún no ha pasado el mes de cumpleaños
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }

    return edad;
  } catch (error) {
    console.error("Error al calcular edad:", error, fechaNacimiento);
    return 0;
  }
}

// Función para obtener informes de estudiantes
export const getStudentReports = async (filters: StudentReportFilters = {}): Promise<StudentReport[]> => {
  try {
    const response = await fetchWithAuth("/informes/alumnos", {
      method: "POST",
      body: JSON.stringify(filters),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || response.statusText || "Error al obtener informes de alumnos")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error al obtener informes de estudiantes:", error);
    throw error
  }
}

// Función para obtener la lista de estudiantes
export async function fetchStudents(): Promise<Student[]> {
  try {
    console.log("Obteniendo lista de estudiantes desde la API...");

    // Obtener el ID del colegio seleccionado
    const selectedSchool = localStorage.getItem("selectedSchool");

    // Construir la URL con el parámetro de colegio si existe
    let url = "/alumnos";
    if (selectedSchool) {
      url += `?colegio_id = ${ selectedSchool }`;
    }

    // Realizar la solicitud GET a la API
    const response = await fetchWithAuth(url, {
      method: "GET",
    });

    // Si la respuesta no es exitosa, lanzar un error
    if (!response.ok) {
      // Intentar leer el mensaje de error
      const errorText = await response.text();
      throw new Error(`Error al obtener alumnos: ${ response.status } - ${ errorText }`);
    }

    // Intentar parsear la respuesta como JSON
    const apiStudents = (await response.json()) as ApiStudent[];
    console.log(`Recibidos ${ apiStudents.length } estudiantes de la API`);

    // Transformar los datos de la API a nuestro modelo de Student
    const students = mapApiStudentsToStudents(apiStudents);
    return students;
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    throw error; // Propagar el error para que se maneje en el componente
  }
}

// Función para obtener un estudiante por ID
export async function fetchStudentById(id: string): Promise<Student | null> {
  try {
    console.log(`Obteniendo estudiante con ID ${ id } desde la API...`);

    // Realizar la solicitud GET a la API
    const response = await fetchWithAuth(`/alumnos/${ id }`, {
      method: "GET",
    });

    // Si la respuesta no es exitosa, lanzar un error
    if (!response.ok) {
      // Intentar leer el mensaje de error
      const errorText = await response.text();
      throw new Error(`Error al obtener alumno: ${ response.status } - ${ errorText }`);
    }

    // Intentar parsear la respuesta como JSON
    const apiStudent = (await response.json()) as ApiStudent;

    // Transformar los datos de la API a nuestro modelo de Student
    const students = mapApiStudentsToStudents([apiStudent]);
    return students[0] || null;
  } catch (error) {
    console.error(`Error al obtener estudiante con ID ${ id }`, error);
    throw error; // Propagar el error para que se maneje en el componente
  }
}

// Nueva función para obtener los detalles completos de un estudiante
export async function fetchStudentDetails(id: string): Promise<StudentDetailResponse | null> {
  try {
    console.log(`Obteniendo detalles del alumno con ID: ${ id }`);

    // Realizar la solicitud GET a la API con la nueva ruta
    const response = await fetchWithAuth(`/alumno/${ id }`, {
      method: "GET",
    });

    // Si la respuesta no es exitosa, lanzar un error
    if (!response.ok) {
      // Intentar leer el mensaje de error
      const errorText = await response.text();
      console.error(`Error al obtener detalles del alumno: ${ response.status } - ${ errorText }`);
      throw new Error(`Error al obtener detalles del alumno: ${ response.status } - ${ errorText }`);
    }

    // Intentar parsear la respuesta como JSON
    const studentDetails = (await response.json()) as StudentDetailResponse;
    console.log("Detalles del alumno obtenidos correctamente:", studentDetails);
    return studentDetails;
  } catch (error) {
    console.error(`Error en fetchStudentDetails para ID ${ id }:`, error);
    throw error; // Propagar el error para que se maneje en el componente
  }
}