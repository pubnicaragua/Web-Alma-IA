"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Trash2, Mail, Phone, Calendar, BookOpen, School, Clock, Users } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import TeacherDetailSkeleton from "@/components/teacher/teacher-detail-skeleton"

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

interface Teacher {
  id: string
  name: string
  fullName: string
  age: number
  rut: string
  email: string
  phone: string
  position: string
  additionalRole: string
  yearsInSchool: number
  status: string
  availability: string
  currentCourses: string
  subjects: string
  image: string
  coursesInfo: TeacherCourseInfo[]
  recentActivities: TeacherActivity[]
}

export default function TeacherDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isMobile = useIsMobile()

  useEffect(() => {
    // Simulación de carga de datos del docente
    const fetchTeacher = async () => {
      // En un caso real, aquí se haría una petición a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Datos de ejemplo
      const mockTeacher: Teacher = {
        id: id as string,
        name: "Palomina Gutierrez",
        fullName: "Palomina Alejandra Gutiérrez Martínez",
        age: 28,
        rut: "19.345.876-2",
        email: "pgutierrez@colegiohorizonte.cl",
        phone: "+56 9 8765 4321",
        position: "Docente de Matemáticas",
        additionalRole: "Profesora Tutora del 1°A - 2°A",
        yearsInSchool: 3,
        status: "Activa",
        availability: "Lunes a viernes, 08:00-16:30",
        currentCourses: "1°A - 2°A",
        subjects: "Matemáticas - Taller de Lógica",
        image: "/smiling-woman-garden.png",
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

      setTeacher(mockTeacher)
      setIsLoading(false)
    }

    fetchTeacher()
  }, [id])

  const handleDeleteTeacher = () => {
    if (confirm("¿Estás seguro de que deseas eliminar a este docente?")) {
      // En un caso real, aquí se haría una petición a la API para eliminar al docente
      router.push("/administrativo/docentes")
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <TeacherDetailSkeleton />
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
            <Button onClick={handleDeleteTeacher} className="bg-red-500 hover:bg-red-600 self-start">
              {isMobile ? (
                <Trash2 className="h-5 w-5" />
              ) : (
                <>
                  <Trash2 className="h-5 w-5 mr-2" />
                  Borrar docente
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
                <span className="text-gray-800 font-medium">{teacher.age} años</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">RUT:</span>
                <span className="text-gray-800 font-medium">{teacher.rut}</span>
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
                  <span className="text-gray-800 font-medium">{teacher.email}</span>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <Phone className="h-5 w-5 text-blue-500 mr-3" />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Teléfono:</span>
                  <span className="text-gray-800 font-medium">{teacher.phone}</span>
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
                <div className="h-5 w-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs mr-3">
                  A
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
                  <span className="text-sm text-gray-500">Asignaturas:</span>
                  <span className="text-gray-800 font-medium">{teacher.subjects}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zona 6: Panel de resumen del curso */}
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

        {/* Zona 7: Actividades recientes */}
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
      </div>
    </AppLayout>
  )
}
