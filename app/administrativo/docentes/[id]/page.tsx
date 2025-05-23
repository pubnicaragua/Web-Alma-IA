"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Calendar, BookOpen, School, Clock, Users, ToggleLeft, ToggleRight } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import TeacherDetailSkeleton from "@/components/teacher/teacher-detail-skeleton"
import { type Teacher, getTeacherById } from "@/services/teachers-service"

interface TeacherCourseInfo {
  curso: string
  numAlumnos: number
  alertasActivas: number
  ultimaAlerta: string
}

interface TeacherActivity {
  fecha: string
  accionRealizada: string
}

interface TeacherDetail extends Teacher {
  fullName?: string
  phone?: string
  position?: string
  additionalRole?: string
  yearsInSchool?: number
  availability?: string
  currentCourses?: string
  subjects?: string
  coursesInfo?: TeacherCourseInfo[]
  recentActivities?: TeacherActivity[]
  isActive?: boolean
}

export default function TeacherDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [teacher, setTeacher] = useState<TeacherDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (!id) {
          throw new Error("ID de docente no proporcionado")
        }

        const teacherData = await getTeacherById(id as string)

        if (!teacherData) {
          throw new Error("No se encontró el docente")
        }

        // Enriquecer los datos del docente con información adicional para la vista detallada
        const enhancedTeacher: TeacherDetail = {
          ...teacherData,
          fullName: teacherData.name,
          phone: "+56 9 8765 4321", // Datos de ejemplo
          position: `Docente de ${teacherData.subject}`,
          additionalRole: "Profesora Tutora del 1°A - 2°A",
          yearsInSchool: 3,
          availability: "Lunes a viernes, 08:00-16:30",
          currentCourses: "1°A - 2°A",
          subjects: teacherData.subject,
          isActive: teacherData.status === "Activo",
          coursesInfo: [
            {
              curso: "4°A",
              numAlumnos: 32,
              alertasActivas: 5,
              ultimaAlerta: "12/04/2025",
            },
            {
              curso: "2°A",
              numAlumnos: 32,
              alertasActivas: 5,
              ultimaAlerta: "12/04/2025",
            },
          ],
          recentActivities: [
            {
              fecha: "12/04/2025",
              accionRealizada: "Ingresó a vista de alertas activas",
            },
            {
              fecha: "11/04/2025",
              accionRealizada: "Exportó el informe mensual del 1°A",
            },
            {
              fecha: "09/04/2025",
              accionRealizada: "Revisó las alertas del 1°A",
            },
          ],
        }

        setTeacher(enhancedTeacher)
      } catch (err) {
        console.error("Error al cargar docente:", err)
        setError(
          `No se pudo cargar la información del docente: ${err instanceof Error ? err.message : "Error desconocido"}`,
        )
        setTeacher(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeacher()
  }, [id])

  const handleToggleTeacherStatus = () => {
    if (!teacher) return

    const action = teacher.isActive ? "desactivar" : "activar"
    if (confirm(`¿Estás seguro de que deseas ${action} a este docente?`)) {
      // En un caso real, aquí se haría una petición a la API para cambiar el estado del docente
      setTeacher({
        ...teacher,
        isActive: !teacher.isActive,
        status: teacher.isActive ? "Inactivo" : "Activo",
      })
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <TeacherDetailSkeleton />
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <div className="mt-4">
              <Button onClick={() => router.push("/administrativo/docentes")} variant="outline">
                Volver a la lista de docentes
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!teacher) {
    return (
      <AppLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-500">No se encontró información del docente</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-3 sm:px-6 py-8">
        {/* Zona 1: Información principal del docente */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-blue-200">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-blue-100">
                <Image
                  src={teacher.image || "/placeholder.svg"}
                  alt={teacher.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col items-center md:items-start">
                <h1 className="text-3xl font-bold text-gray-800">{teacher.name}</h1>
                <p className="text-xl text-gray-600 mb-2">{teacher.position}</p>
                <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {teacher.additionalRole}
                </div>
              </div>
            </div>
            <Button
              onClick={handleToggleTeacherStatus}
              className={`${teacher.isActive ? "bg-amber-500 hover:bg-amber-600" : "bg-green-500 hover:bg-green-600"} self-start`}
            >
              {isMobile ? (
                teacher.isActive ? (
                  <ToggleRight className="h-5 w-5" />
                ) : (
                  <ToggleLeft className="h-5 w-5" />
                )
              ) : (
                <>
                  {teacher.isActive ? (
                    <ToggleRight className="h-5 w-5 mr-2" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 mr-2" />
                  )}
                  {teacher.isActive ? "Desactivar docente" : "Activar docente"}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Zona 2: Datos personales */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
              <Users className="mr-2 h-5 w-5 text-blue-500" />
              Datos personales
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">Nombre completo:</span>
                <span className="text-gray-800 font-medium">{teacher.fullName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">Edad:</span>
                <span className="text-gray-800 font-medium">
                  {teacher.age ? `${teacher.age} años` : "No disponible"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">Documento:</span>
                <span className="text-gray-800 font-medium">
                  {teacher.documentType}: {teacher.document}
                </span>
              </div>
            </div>
          </div>

          {/* Zona 3: Información de contacto */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
              <Mail className="mr-2 h-5 w-5 text-blue-500" />
              Información de contacto
            </h2>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-blue-500 mr-3" />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Correo institucional:</span>
                  <span className="text-gray-800 font-medium">{teacher.email || "No disponible"}</span>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <Phone className="h-5 w-5 text-blue-500 mr-3" />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Teléfono:</span>
                  <span className="text-gray-800 font-medium">{teacher.phone || "No disponible"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Zona 4: Datos académicos */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
              Datos académicos
            </h2>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <School className="h-5 w-5 text-blue-500 mr-3" />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Cargo:</span>
                  <span className="text-gray-800 font-medium">{teacher.position}</span>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <Users className="h-5 w-5 text-blue-500 mr-3" />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Rol adicional:</span>
                  <span className="text-gray-800 font-medium">{teacher.additionalRole}</span>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <Calendar className="h-5 w-5 text-blue-500 mr-3" />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Años en el colegio:</span>
                  <span className="text-gray-800 font-medium">{teacher.yearsInSchool} años</span>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div
                  className={`h-5 w-5 rounded-full ${teacher.isActive ? "bg-green-500" : "bg-amber-500"} text-white flex items-center justify-center text-xs mr-3`}
                >
                  {teacher.isActive ? "A" : "I"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Estado:</span>
                  <span className="text-gray-800 font-medium">{teacher.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Zona 5: Horario y cursos */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-500" />
              Horario y cursos
            </h2>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <Clock className="h-5 w-5 text-blue-500 mr-3" />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Disponibilidad:</span>
                  <span className="text-gray-800 font-medium">{teacher.availability}</span>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <School className="h-5 w-5 text-blue-500 mr-3" />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Cursos actuales:</span>
                  <span className="text-gray-800 font-medium">{teacher.currentCourses}</span>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <BookOpen className="h-5 w-5 text-blue-500 mr-3" />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Especialidad:</span>
                  <span className="text-gray-800 font-medium">{teacher.subject}</span>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <School className="h-5 w-5 text-blue-500 mr-3" />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Colegio:</span>
                  <span className="text-gray-800 font-medium">
                    {teacher.school} ({teacher.schoolType})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zona 6: Panel de resumen del curso */}
        {teacher.coursesInfo && teacher.coursesInfo.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-blue-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
              <Users className="mr-2 h-5 w-5 text-blue-500" />
              Panel de resumen del curso
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-300">
                    <th className="px-4 py-3 text-left font-medium text-white">Curso</th>
                    <th className="px-4 py-3 text-left font-medium text-white">N° de alumnos</th>
                    <th className="px-4 py-3 text-left font-medium text-white">N° de alertas activas</th>
                    <th className="px-4 py-3 text-left font-medium text-white">Última alerta ingresada</th>
                  </tr>
                </thead>
                <tbody>
                  {teacher.coursesInfo.map((course, index) => (
                    <tr key={index} className="border-b-2 border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        <span className="font-medium text-blue-600">{course.curso}</span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{course.numAlumnos}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium inline-block">
                          {course.alertasActivas}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{course.ultimaAlerta}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Zona 7: Actividades recientes */}
        {teacher.recentActivities && teacher.recentActivities.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-blue-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-500" />
              Actividades recientes
            </h2>
            <div className="space-y-3">
              {teacher.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium mr-3 whitespace-nowrap">
                    {activity.fecha}
                  </div>
                  <span className="text-gray-800">{activity.accionRealizada}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
