"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { StudentAlerts } from "@/components/student/student-alerts";
import { StudentReports } from "@/components/student/student-reports";
import { StudentSkeleton } from "@/components/student/student-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/data-table";
import {
  fetchStudentDetails,
  type StudentDetailResponse,
} from "@/services/students-service";
import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  FileText,
  Mail,
  Phone,
  Smile,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BarChartComparisonAlumno } from "@/components/bar-chart-comparison-alumno";
import { ComparisonChart } from "@/components/comparison-chart";

export default function StudentDetailPage() {
  const { id } = useParams();
  const [studentDetails, setStudentDetails] =
    useState<StudentDetailResponse | null>(null);
  const [activeTab, setActiveTab] = useState("ficha");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([
    "Tristeza",
    "Felicidad",
    "Estrés",
    "Ansiedad",
    "Enojo",
    "Otros",
  ]);

  useEffect(() => {
    const loadStudentDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const details = await fetchStudentDetails(id as string);
        if (details) {
          setStudentDetails(details);
        } else {
          setError("No se pudieron cargar los detalles del alumno");
        }
      } catch (err) {
        setError("Error al cargar los detalles del alumno");
      } finally {
        setIsLoading(false);
      }
    };

    loadStudentDetails();
  }, [id, refresh]);

  const handleToggleEmotion = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter((e) => e !== emotion));
    } else {
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };

  const generateNameFromEmail = (email: string) => {
    if (!email) return "Estudiante";

    const parts = email.split("@")[0].split(".");
    if (parts.length > 1) {
      return `${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)} ${
        parts[1].charAt(0).toUpperCase() + parts[1].slice(1)
      }`;
    }
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-2 sm:px-6 py-4 sm:py-8">
          <StudentSkeleton />
        </div>
      </AppLayout>
    );
  }

  if (error || !studentDetails) {
    return (
      <AppLayout>
        <div className="container mx-auto px-2 sm:px-6 py-4 sm:py-8">
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm p-6 border border-red-200">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-xl text-gray-700 mb-2">
              No se encontró información del alumno
            </p>
            <p className="text-sm text-gray-500">
              {error || "Intente nuevamente más tarde"}
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const {
    alumno,
    ficha,
    alertas,
    informes,
    emociones,
    apoderados,
    datosComparativa,
    tipo_informe,
  } = studentDetails;

  const studentName =
    alumno.personas.nombres || generateNameFromEmail(alumno.email);
  const studentLastName = alumno.personas.apellidos;

  const comparisonData = datosComparativa.map((data) => ({
    emocion: data.emocion,
    alumno: data.alumno,
    promedio: data.promedio,
  }));

  const alertsData = alertas.map((alerta) => ({
    alumno_alerta_id: alerta.alumno_alerta_id,
    fecha: formatDate(alerta.fecha_generada),
    hora: formatTime(alerta.fecha_generada),
    tipo: getTipoAlerta(alerta.alertas_tipo_alerta_tipo_id),
    estado: alerta.estado,
    prioridad: getPrioridad(alerta.prioridad_id),
    responsable:
      alerta?.persona_responsable_actual?.nombres +
      " " +
      alerta?.persona_responsable_actual?.apellidos,
    severidad_name: alerta.alertas_severidades.nombre,
  }));

  const reportsData = informes.map((informe) => ({
    fecha: formatDate(informe.fecha),
    tipo: informe.tipo_informe,
    resumen: `${formatDateMensual(informe.fecha)}`,
    url_reporte: informe.url_reporte,
    activo: informe.activo,
  }));

  return (
    <AppLayout>
      <div className="container mx-auto px-2 sm:px-6 py-4 sm:py-8">
        {/* Zona 1: Información principal del estudiante */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-blue-200">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-blue-100">
              <Image
                src={alumno.url_foto_perfil || "/placeholder.svg"}
                alt={studentName}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h1 className="text-3xl font-bold text-gray-800">{`${studentName}  ${studentLastName}`}</h1>
              <div className="flex flex-wrap gap-4">
                <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Colegio:{" "}
                  <span className="font-bold">{alumno.colegios.nombre}</span>
                </div>
                <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Email: {alumno.email}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zona 2: Pestañas de navegación */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-blue-200">
          <Tabs
            defaultValue="ficha"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="bg-blue-100 w-full justify-start overflow-x-auto flex-nowrap whitespace-nowrap">
              <TabsTrigger
                value="ficha"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white flex items-center text-xs sm:text-sm px-2 sm:px-4"
              >
                <User className="h-4 w-4 mr-2" />
                Ficha
              </TabsTrigger>
              <TabsTrigger
                value="alertas"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white flex items-center text-xs sm:text-sm px-2 sm:px-4"
              >
                <Bell className="h-4 w-4 mr-2" />
                Alertas
              </TabsTrigger>
              <TabsTrigger
                value="informes"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white flex items-center text-xs sm:text-sm px-2 sm:px-4"
              >
                <FileText className="h-4 w-4 mr-2" />
                Informes
              </TabsTrigger>
              <TabsTrigger
                value="emociones"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white flex items-center text-xs sm:text-sm px-2 sm:px-4"
              >
                <Smile className="h-4 w-4 mr-2" />
                Emociones
              </TabsTrigger>
            </TabsList>

            {/* Zona 3: Contenido de las pestañas */}
            <div className="mt-6 bg-white rounded-lg p-4 border border-blue-100">
              <TabsContent value="ficha">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Datos personales */}
                  <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                      <User className="mr-2 h-5 w-5 text-blue-500" />
                      Datos personales
                    </h3>
                    <div className="space-y-3">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          ID del alumno:
                        </span>
                        <span className="text-gray-800 font-medium">
                          {alumno.alumno_id}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Tipo de documento:
                        </span>
                        <span className="text-gray-800 font-medium">
                          {alumno.personas.tipo_documento}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Numero de documento:
                        </span>
                        <span className="text-gray-800 font-medium">
                          {alumno.personas.numero_documento}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Fecha de nacimiento:
                        </span>
                        <span className="text-gray-800 font-medium">
                          {alumno.personas.fecha_nacimiento.toString()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Genero:</span>
                        <span className="text-gray-800 font-medium">
                          {alumno.personas.generos.nombre}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Información de contacto */}
                  <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                      <Mail className="mr-2 h-5 w-5 text-blue-500" />
                      Información de contacto
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <Phone className="h-5 w-5 text-blue-500 mr-3" />
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">
                            Teléfono principal:
                          </span>
                          <span className="text-gray-800 font-medium">
                            {alumno.telefono_contacto1 || "No disponible"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <Phone className="h-5 w-5 text-blue-500 mr-3" />
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">
                            Teléfono secundario:
                          </span>
                          <span className="text-gray-800 font-medium">
                            {alumno.telefono_contacto2 || "No disponible"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <Mail className="h-5 w-5 text-blue-500 mr-3" />
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">Correo:</span>
                          <span className="text-gray-800 font-medium">
                            {alumno.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ficha médica */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-blue-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-blue-500" />
                    Antecedentes clínicos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="font-medium text-gray-700 mb-2">
                        Historial médico
                      </h4>
                      <p className="text-gray-600">
                        {ficha[0]?.historial_medico || "No disponible"}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="font-medium text-gray-700 mb-2">
                        Alergias
                      </h4>
                      <p className="text-gray-600">
                        {ficha[0]?.alergias.trim() || "No disponible"}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="font-medium text-gray-700 mb-2">
                        Enfermedades crónicas
                      </h4>
                      <p className="text-gray-600">
                        {ficha[0]?.enfermedades_cronicas.trim() ||
                          "No disponible"}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="font-medium text-gray-700 mb-2">
                        Condiciones médicas relevantes
                      </h4>
                      <p className="text-gray-600">
                        {ficha[0]?.condiciones_medicas_relevantes.trim() ||
                          "No disponible"}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="font-medium text-gray-700 mb-2">
                        Medicamentos actuales
                      </h4>
                      <p className="text-gray-600">
                        {ficha[0]?.medicamentos_actuales.trim() ||
                          "No disponible"}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="font-medium text-gray-700 mb-2">
                        Diagnósticos previos
                      </h4>
                      <p className="text-gray-600">
                        {ficha[0]?.diagnosticos_previos.trim() ||
                          "No disponible"}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 md:col-span-2">
                      <h4 className="font-medium text-gray-700 mb-2">
                        Terapias y tratamientos en curso
                      </h4>
                      <p className="text-gray-600">
                        {ficha[0]?.terapias_tratamiento_curso.trim() ||
                          "No disponible"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Apoderados */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-blue-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                    <Users className="mr-2 h-5 w-5 text-blue-500" />
                    Apoderados
                  </h3>
                  {apoderados.length ? (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[640px]">
                        <thead>
                          <tr className="bg-blue-300">
                            <th className="px-4 py-3 text-left font-medium text-white">
                              Nombre
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-white">
                              Tipo
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-white">
                              Observaciones
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-white">
                              Estado
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {apoderados.map((apoderado, index) => (
                            <tr
                              key={index}
                              className="border-b-2 border-gray-100 hover:bg-gray-50"
                            >
                              <td className="px-4 py-3 text-sm font-medium">
                                {apoderado.apoderados.personas.nombres}{" "}
                                {apoderado.apoderados.personas.apellidos}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    apoderado.tipo_apoderado === "Padre" ||
                                    apoderado.tipo_apoderado === "Madre"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {apoderado.tipo_apoderado}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {apoderado.observaciones}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    apoderado.estado_usuario === "activo"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {apoderado.estado_usuario}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-blue-500 rounded-md p-2">
                      <h1 className="font-medium text-white">
                        Apoderados no disponibles
                      </h1>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="alertas">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
                  <StudentAlerts
                    alerts={alertsData}
                    setRefresh={() => setRefresh(!refresh)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="informes">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
                  {reportsData.length ? (
                    <StudentReports reports={reportsData} />
                  ) : (
                    <div className="bg-blue-500 rounded-md p-2">
                      <h1 className="font-medium text-white">
                        Informes no disponibles
                      </h1>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="emociones">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Registro emocional del alumno
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BarChartComparisonAlumno
                      title="Emociones"
                      selectedEmotions={selectedEmotions}
                      onToggleEmotion={handleToggleEmotion}
                      apiEmotions={emociones}
                      setSelectedEmotions={setSelectedEmotions}
                    />

                    <ComparisonChart comparisonData={comparisonData} />
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}

// Funciones auxiliares
function formatDate(dateString: string): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateMensual(dateString: string): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const formatted = date.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function formatTime(dateString: string): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getEmotionColor(emotion: string): string {
  const colors: Record<string, string> = {
    Felicidad: "#ffd166",
    Tristeza: "#78b6ff",
    Estrés: "#6c757d",
    Ansiedad: "#f4a261",
    Enojo: "#e63946",
    Otros: "#6c757d",
  };
  return colors[emotion] || "#6c757d";
}

function getTipoAlerta(tipoId: number): string {
  const tipos: Record<number, string> = {
    1: "SOS Alma",
    2: "Alerta amarilla",
    3: "Alerta Naranja",
    4: "Denuncia",
    5: "Alerta General",
  };
  return tipos[tipoId] || `Tipo ${tipoId}`;
}

function getPrioridad(prioridadId: number): string {
  const prioridades: Record<number, string> = {
    1: "Baja",
    2: "Media",
    3: "Alta",
    4: "Critica",
  };
  return prioridades[prioridadId];
}
