"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentAlerts } from "@/components/student/student-alerts"
import { StudentReports } from "@/components/student/student-reports"
import { User, Phone, Mail, Users, FileText, Bell, Smile, AlertTriangle } from "lucide-react"
import { StudentSkeleton } from "@/components/student/student-skeleton"
import { fetchStudentDetails, type StudentDetailResponse } from "@/services/students-service"
import { BarChartComparison } from "@/components/bar-chart-comparison"
import Image from "next/image"

export default function StudentDetailPage() {
  const { id } = useParams()
  const [studentDetails, setStudentDetails] = useState<StudentDetailResponse | null>(null)
  const [activeTab, setActiveTab] = useState("ficha")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([
    "Tristeza",
    "Felicidad",
    "Estrés",
    "Ansiedad",
    "Enojo",
    "Otros",
  ])

  useEffect(() => {
    const loadStudentDetails = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const details = await fetchStudentDetails(id as string)
        if (details) {
          setStudentDetails(details)
        } else {
          setError("No se pudieron cargar los detalles del alumno")
        }
      } catch (err) {
        setError("Error al cargar los detalles del alumno")
      } finally {
        setIsLoading(false)
      }
    }

    loadStudentDetails()
  }, [id])

  // Función para manejar la selección de emociones
  const handleToggleEmotion = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter((e) => e !== emotion))
    } else {
      setSelectedEmotions([...selectedEmotions, emotion])
    }
  }

  // Función para generar un nombre a partir del email
  const generateNameFromEmail = (email: string) => {
    if (!email) return "Estudiante"

    const parts = email.split("@")[0].split(".")
    if (parts.length > 1) {
      return `${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)} ${parts[1].charAt(0).toUpperCase() + parts[1].slice(1)}`
    }
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-2 sm:px-6 py-4 sm:py-8">
          <StudentSkeleton />
        </div>
      </AppLayout>
    )
  }

  if (error || !studentDetails) {
    return (
      <AppLayout>
        <div className="container mx-auto px-2 sm:px-6 py-4 sm:py-8">
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm p-6 border border-red-200">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-xl text-gray-700 mb-2">No se encontró información del alumno</p>
            <p className="text-sm text-gray-500">{error || "Intente nuevamente más tarde"}</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  // Extraer datos del estudiante
  const { alumno, ficha, alertas, informes, emociones, apoderados } = studentDetails

  // Generar nombre del estudiante (en un caso real vendría de la API)
  const studentName = generateNameFromEmail(alumno.email)

  // Convertir emociones al formato esperado por el componente StudentEmotions
  const emotionData = emociones.map((emotion) => ({
    name: emotion.nombre,
    value: Math.round(emotion.valor / 100), // Normalizar para el componente
    color: getEmotionColor(emotion.nombre),
  }))

  // Datos para el gráfico de radar (simulados)
  const radarData = {
    alumno: [4.5, 3.8, 2.5, 4.2, 3.9],
    promedio: [3.2, 2.8, 3.5, 3.0, 2.7],
  }

  // Convertir alertas al formato esperado por el componente
  const alertsData = alertas.map((alerta) => ({
    fecha: formatDate(alerta.fecha_generada),
    hora: formatTime(alerta.fecha_generada),
    tipo: getTipoAlerta(alerta.alertas_tipo_alerta_tipo_id),
    estado: alerta.estado,
    prioridad: getPrioridad(alerta.prioridad_id),
    responsable: `ID: ${alerta.responsable_actual_id}`,
  }))

  // Convertir informes al formato esperado por el componente
  const reportsData = informes.map((informe) => ({
    fecha: formatDate(informe.fecha),
    tipo: "Informe General",
    resumen: `Informe ${formatDate(informe.fecha)}`,
    url: informe.url_reporte,
  }))

  return (
    <AppLayout>
      <div className="container mx-auto px-2 sm:px-6 py-4 sm:py-8">
        {/* Zona 1: Información principal del estudiante */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-blue-200">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-blue-100">
              <Image
                src={alumno.url_foto_perfil || "/placeholder.svg?height=128&width=128&query=student"}
                alt={studentName}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h1 className="text-3xl font-bold text-gray-800">{studentName}</h1>
              <p className="text-xl text-gray-600 mb-2">ID: {alumno.alumno_id}</p>
              <div className="flex flex-wrap gap-4">
                <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Colegio ID: {alumno.colegio_id}
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
          <Tabs defaultValue="ficha" className="w-full" onValueChange={setActiveTab}>
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
                        <span className="text-sm text-gray-500">ID del alumno:</span>
                        <span className="text-gray-800 font-medium">{alumno.alumno_id}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Email:</span>
                        <span className="text-gray-800 font-medium">{alumno.email}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Colegio ID:</span>
                        <span className="text-gray-800 font-medium">{alumno.colegio_id}</span>
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
                          <span className="text-sm text-gray-500">Teléfono principal:</span>
                          <span className="text-gray-800 font-medium">
                            {alumno.telefono_contacto1 || "No disponible"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <Phone className="h-5 w-5 text-blue-500 mr-3" />
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">Teléfono secundario:</span>
                          <span className="text-gray-800 font-medium">
                            {alumno.telefono_contacto2 || "No disponible"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <Mail className="h-5 w-5 text-blue-500 mr-3" />
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">Correo:</span>
                          <span className="text-gray-800 font-medium">{alumno.email}</span>
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
                      <h4 className="font-medium text-gray-700 mb-2">Historial médico</h4>
                      <p className="text-gray-600">{ficha.historial_medico}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="font-medium text-gray-700 mb-2">Alergias</h4>
                      <p className="text-gray-600">{ficha.alergias}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="font-medium text-gray-700 mb-2">Enfermedades crónicas</h4>
                      <p className="text-gray-600">{ficha.enfermedades_cronicas}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="font-medium text-gray-700 mb-2">Condiciones médicas relevantes</h4>
                      <p className="text-gray-600">{ficha.condiciones_medicas_relevantes}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="font-medium text-gray-700 mb-2">Medicamentos actuales</h4>
                      <p className="text-gray-600">{ficha.medicamentos_actuales}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="font-medium text-gray-700 mb-2">Diagnósticos previos</h4>
                      <p className="text-gray-600">{ficha.diagnosticos_previos}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 md:col-span-2">
                      <h4 className="font-medium text-gray-700 mb-2">Terapias y tratamientos en curso</h4>
                      <p className="text-gray-600">{ficha.terapias_tratamiento_curso}</p>
                    </div>
                  </div>
                </div>

                {/* Apoderados */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-blue-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                    <Users className="mr-2 h-5 w-5 text-blue-500" />
                    Apoderados
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                      <thead>
                        <tr className="bg-blue-300">
                          <th className="px-4 py-3 text-left font-medium text-white">ID</th>
                          <th className="px-4 py-3 text-left font-medium text-white">Tipo</th>
                          <th className="px-4 py-3 text-left font-medium text-white">Observaciones</th>
                          <th className="px-4 py-3 text-left font-medium text-white">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {apoderados.map((apoderado, index) => (
                          <tr key={index} className="border-b-2 border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium">{apoderado.apoderado_id}</td>
                            <td className="px-4 py-3 text-sm">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  apoderado.tipo_apoderado === "Padre" || apoderado.tipo_apoderado === "Madre"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {apoderado.tipo_apoderado}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">{apoderado.observaciones}</td>
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
                </div>
              </TabsContent>

              <TabsContent value="alertas">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
                  <StudentAlerts alerts={alertsData} />
                </div>
              </TabsContent>

              <TabsContent value="informes">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
                  <StudentReports reports={reportsData} />
                </div>
              </TabsContent>

              <TabsContent value="emociones">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Registro emocional del alumno</h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Primera gráfica: Emociones (reemplazada por la del menú principal) */}
                    <BarChartComparison
                      title="Emociones"
                      selectedEmotions={selectedEmotions}
                      onToggleEmotion={handleToggleEmotion}
                      apiEmotions={emociones}
                    />

                    {/* Segunda gráfica: Comparativa (nueva versión con pentágono regular) */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
                      <h4 className="text-lg font-medium mb-4">Comparativa</h4>

                      <div className="flex items-center justify-end gap-4 mb-2">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                          <span className="text-sm">Alumno</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-gray-400 mr-1"></div>
                          <span className="text-sm">Promedio</span>
                        </div>
                      </div>

                      <div className="flex justify-center mb-4">
                        <div className="w-full max-w-md">
                          <svg viewBox="0 0 400 400" width="100%" height="100%">
                            {/* Círculos de fondo */}
                            <circle cx="200" cy="200" r="120" fill="none" stroke="#e5e5e5" strokeWidth="1" />
                            <circle cx="200" cy="200" r="90" fill="none" stroke="#e5e5e5" strokeWidth="1" />
                            <circle cx="200" cy="200" r="60" fill="none" stroke="#e5e5e5" strokeWidth="1" />
                            <circle cx="200" cy="200" r="30" fill="none" stroke="#e5e5e5" strokeWidth="1" />

                            {/* Cálculo de coordenadas para un pentágono regular */}
                            {/* 
                              Usamos trigonometría para calcular las coordenadas de un pentágono regular
                              x = cx + r * cos(ángulo)
                              y = cy + r * sin(ángulo)
                              donde:
                              - cx, cy es el centro (200, 200)
                              - r es el radio (120 para el círculo exterior)
                              - ángulo está en radianes, comenzando desde -π/2 (arriba) y avanzando en sentido horario
                            */}

                            {/* Líneas radiales - distribuidas uniformemente en forma de pentágono */}
                            <line x1="200" y1="200" x2="200" y2="80" stroke="#e5e5e5" strokeWidth="1" />
                            <line x1="200" y1="200" x2="314" y2="163" stroke="#e5e5e5" strokeWidth="1" />
                            <line x1="200" y1="200" x2="276" y2="297" stroke="#e5e5e5" strokeWidth="1" />
                            <line x1="200" y1="200" x2="124" y2="297" stroke="#e5e5e5" strokeWidth="1" />
                            <line x1="200" y1="200" x2="86" y2="163" stroke="#e5e5e5" strokeWidth="1" />

                            {/* Etiquetas de escala */}
                            <text x="205" y="85" textAnchor="middle" fontSize="10" fill="#888">
                              2.0
                            </text>
                            <text x="205" y="115" textAnchor="middle" fontSize="10" fill="#888">
                              1.5
                            </text>
                            <text x="205" y="145" textAnchor="middle" fontSize="10" fill="#888">
                              1.0
                            </text>
                            <text x="205" y="175" textAnchor="middle" fontSize="10" fill="#888">
                              0.5
                            </text>

                            {/* Polígono del promedio - pentágono regular */}
                            <polygon
                              points="200,128 272,163 248,257 152,257 128,163"
                              fill="rgba(128, 128, 128, 0.2)"
                              stroke="#888"
                              strokeWidth="2"
                              strokeDasharray="5,3"
                            />

                            {/* Polígono del alumno - pentágono regular */}
                            <polygon
                              points="200,110 290,153 260,277 140,277 110,153"
                              fill="rgba(120, 182, 255, 0.3)"
                              stroke="#78b6ff"
                              strokeWidth="2"
                            />

                            {/* Puntos del alumno - pentágono regular */}
                            <circle cx="200" cy="110" r="4" fill="white" stroke="#78b6ff" strokeWidth="2" />
                            <circle cx="290" cy="153" r="4" fill="white" stroke="#78b6ff" strokeWidth="2" />
                            <circle cx="260" cy="277" r="4" fill="white" stroke="#78b6ff" strokeWidth="2" />
                            <circle cx="140" cy="277" r="4" fill="white" stroke="#78b6ff" strokeWidth="2" />
                            <circle cx="110" cy="153" r="4" fill="white" stroke="#78b6ff" strokeWidth="2" />

                            {/* Puntos del promedio - pentágono regular */}
                            <circle cx="200" cy="128" r="4" fill="white" stroke="#888" strokeWidth="2" />
                            <circle cx="272" cy="163" r="4" fill="white" stroke="#888" strokeWidth="2" />
                            <circle cx="248" cy="257" r="4" fill="white" stroke="#888" strokeWidth="2" />
                            <circle cx="152" cy="257" r="4" fill="white" stroke="#888" strokeWidth="2" />
                            <circle cx="128" cy="163" r="4" fill="white" stroke="#888" strokeWidth="2" />

                            {/* Etiquetas de emociones - pentágono regular */}
                            <text x="200" y="60" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">
                              Feliz
                            </text>
                            <text x="330" y="153" textAnchor="start" fontSize="12" fontWeight="bold" fill="#333">
                              Triste
                            </text>
                            <text x="276" y="317" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">
                              Estresada
                            </text>
                            <text x="124" y="317" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">
                              Enojada
                            </text>
                            <text x="70" y="153" textAnchor="end" fontSize="12" fontWeight="bold" fill="#333">
                              Ansiosa
                            </text>
                          </svg>
                        </div>
                      </div>

                      {/* Tabla de comparación */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="py-2 text-left font-medium">Emoción</th>
                              <th className="py-2 text-center font-medium text-blue-500">Alumno</th>
                              <th className="py-2 text-center font-medium text-gray-500">Promedio</th>
                              <th className="py-2 text-center font-medium">Dif.</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-100">
                              <td className="py-2">Feliz</td>
                              <td className="py-2 text-center text-blue-500 font-medium">4.5</td>
                              <td className="py-2 text-center text-gray-500">3.2</td>
                              <td className="py-2 text-center font-medium text-green-500">+1.3</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="py-2">Triste</td>
                              <td className="py-2 text-center text-blue-500 font-medium">3.8</td>
                              <td className="py-2 text-center text-gray-500">2.8</td>
                              <td className="py-2 text-center font-medium text-green-500">+1.0</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="py-2">Estresada</td>
                              <td className="py-2 text-center text-blue-500 font-medium">2.5</td>
                              <td className="py-2 text-center text-gray-500">3.5</td>
                              <td className="py-2 text-center font-medium text-red-500">-1.0</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="py-2">Enojada</td>
                              <td className="py-2 text-center text-blue-500 font-medium">4.2</td>
                              <td className="py-2 text-center text-gray-500">3.0</td>
                              <td className="py-2 text-center font-medium text-green-500">+1.2</td>
                            </tr>
                            <tr>
                              <td className="py-2">Ansiosa</td>
                              <td className="py-2 text-center text-blue-500 font-medium">3.9</td>
                              <td className="py-2 text-center text-gray-500">2.7</td>
                              <td className="py-2 text-center font-medium text-green-500">+1.2</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}

// Funciones auxiliares
function formatDate(dateString: string): string {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
}

function formatTime(dateString: string): string {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
}

function getEmotionColor(emotion: string): string {
  const colors: Record<string, string> = {
    Felicidad: "#ffd166",
    Tristeza: "#78b6ff",
    Estrés: "#6c757d",
    Ansiedad: "#f4a261",
    Enojo: "#e63946",
    Otros: "#6c757d",
  }
  return colors[emotion] || "#6c757d"
}

function getTipoAlerta(tipoId: number): string {
  const tipos: Record<number, string> = {
    1: "SOS Alma",
    2: "Alerta amarilla",
    3: "Alerta Naranja",
    4: "Denuncia",
    5: "Alerta General",
  }
  return tipos[tipoId] || `Tipo ${tipoId}`
}

function getPrioridad(prioridadId: number): string {
  const prioridades: Record<number, string> = {
    1: "Baja",
    2: "Media",
    3: "Alta",
  }
  return prioridades[prioridadId] || `Prioridad ${prioridadId}`
}
