"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

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
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-500">Cargando información del docente...</p>
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
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden mr-6 bg-gray-200 flex-shrink-0">
              <Image
                src={teacher.image || "/placeholder.svg"}
                alt={teacher.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{teacher.name}</h1>
              <p className="text-xl text-gray-600">
                {teacher.subjects} - {teacher.currentCourses}
              </p>
            </div>
          </div>
          <Button onClick={handleDeleteTeacher} className="bg-red-500 hover:bg-red-600">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Datos personales */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Datos personales</h2>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Nombre completo:</span>
                <span className="text-gray-800">{teacher.fullName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Edad:</span>
                <span className="text-gray-800">{teacher.age} años</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">RUT:</span>
                <span className="text-gray-800">{teacher.rut}</span>
              </div>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Información de contacto</h2>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Correo institucional:</span>
                <span className="text-gray-800">{teacher.email}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Teléfono:</span>
                <span className="text-gray-800">{teacher.phone}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Datos académicos */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Datos académicos</h2>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Cargo:</span>
                <span className="text-gray-800">{teacher.position}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Rol adicional:</span>
                <span className="text-gray-800">{teacher.additionalRole}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Años en el colegio:</span>
                <span className="text-gray-800">{teacher.yearsInSchool} años</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Estado:</span>
                <span className="text-gray-800">{teacher.status}</span>
              </div>
            </div>
          </div>

          {/* Horario y cursos */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Horario y cursos</h2>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Disponibilidad:</span>
                <span className="text-gray-800">{teacher.availability}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Cursos actuales:</span>
                <span className="text-gray-800">{teacher.currentCourses}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Asignaturas:</span>
                <span className="text-gray-800">{teacher.subjects}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de resumen del curso */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Panel de resumen del curso</h2>
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
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{course.curso}</td>
                    <td className="px-4 py-3 text-sm">{course.numAlumnos}</td>
                    <td className="px-4 py-3 text-sm">{course.alertasActivas}</td>
                    <td className="px-4 py-3 text-sm">{course.ultimaAlerta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actividades recientes */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Actividades recientes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-300">
                  <th className="px-4 py-3 text-left font-medium text-white">Fecha</th>
                  <th className="px-4 py-3 text-left font-medium text-white">Acción realizada</th>
                </tr>
              </thead>
              <tbody>
                {teacher.recentActivities.map((activity, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{activity.fecha}</td>
                    <td className="px-4 py-3 text-sm">{activity.accionRealizada}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
