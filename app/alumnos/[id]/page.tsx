"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentHeader } from "@/components/student/student-header"
import { StudentProfile } from "@/components/student/student-profile"
import { StudentAlerts } from "@/components/student/student-alerts"
import { StudentReports } from "@/components/student/student-reports"
import { StudentEmotions } from "@/components/student/student-emotions"

interface Contact {
  tipo: string
  nombre: string
  parentesco: string
  telefono: string
  rut: string
}

interface Alert {
  fecha: string
  hora: string
  tipo: string
  estado: string
  prioridad: string
  responsable: string
}

interface Report {
  fecha: string
  tipo: string
  resumen: string
}

interface EmotionData {
  name: string
  value: number
  color: string
}

interface Student {
  id: string
  name: string
  age: number
  course: string
  status: string
  image: string
  documentNumber: string
  birthDate: string
  birthDateFull: string
  gender: string
  cellphone: string
  email: string
  languages: string
  address: string
  contacts: {
    apoderados: Contact[]
    antecedentesClinicosContactos: Contact[]
    entrevistaFamiliarContactos: Contact[]
  }
  alerts: Alert[]
  reports: Report[]
  emotions: {
    data: EmotionData[]
    radarData: {
      alumno: number[]
      promedio: number[]
    }
  }
}

export default function StudentDetailPage() {
  const { id } = useParams()
  const [student, setStudent] = useState<Student | null>(null)
  const [activeTab, setActiveTab] = useState("ficha")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulación de carga de datos del estudiante
    const fetchStudent = async () => {
      // En un caso real, aquí se haría una petición a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Datos de ejemplo
      const mockStudent: Student = {
        id: id as string,
        name: "Matías Ignacio Díaz",
        age: 8,
        course: "4°A",
        status: "Bien",
        image: "/young-man-city.png",
        documentNumber: "72275889",
        birthDate: "03/05/2016",
        birthDateFull: "(03/05/2016)",
        gender: "Hombre",
        cellphone: "+51 943 925 343",
        email: "Paoloce57@gmail.com",
        languages: "Español y Inglés (B1)",
        address: "Jr. De la Unión 293",
        contacts: {
          apoderados: [
            {
              tipo: "Principal",
              nombre: "Carolina Pérez Salinas",
              parentesco: "Madre",
              telefono: "226543210",
              rut: "11.234.567-8",
            },
            {
              tipo: "Secundario",
              nombre: "Juan Díaz Riquelme",
              parentesco: "Padre",
              telefono: "225678912",
              rut: "10.876.543-2",
            },
            {
              tipo: "Secundario",
              nombre: "Teresa Salinas López",
              parentesco: "Abuela",
              telefono: "224561987",
              rut: "9.876.321-0",
            },
          ],
          antecedentesClinicosContactos: [
            {
              tipo: "Principal",
              nombre: "Carolina Pérez Salinas",
              parentesco: "Madre",
              telefono: "226543210",
              rut: "11.234.567-8",
            },
            {
              tipo: "Secundario",
              nombre: "Juan Díaz Riquelme",
              parentesco: "Padre",
              telefono: "225678912",
              rut: "10.876.543-2",
            },
            {
              tipo: "Secundario",
              nombre: "Teresa Salinas López",
              parentesco: "Abuela",
              telefono: "224561987",
              rut: "9.876.321-0",
            },
          ],
          entrevistaFamiliarContactos: [
            {
              tipo: "Principal",
              nombre: "Carolina Pérez Salinas",
              parentesco: "Madre",
              telefono: "226543210",
              rut: "11.234.567-8",
            },
            {
              tipo: "Secundario",
              nombre: "Juan Díaz Riquelme",
              parentesco: "Padre",
              telefono: "225678912",
              rut: "10.876.543-2",
            },
            {
              tipo: "Secundario",
              nombre: "Teresa Salinas López",
              parentesco: "Abuela",
              telefono: "224561987",
              rut: "9.876.321-0",
            },
          ],
        },
        alerts: [
          {
            fecha: "08/04/2025",
            hora: "08:12 AM",
            tipo: "SOS Alma",
            estado: "Pendiente",
            prioridad: "Alta",
            responsable: "Enc. Convivencia",
          },
          {
            fecha: "08/04/2025",
            hora: "10:00 AM",
            tipo: "Alerta amarilla",
            estado: "En curso",
            prioridad: "Media",
            responsable: "Psic. Escolar",
          },
          {
            fecha: "09/04/2025",
            hora: "08:45 AM",
            tipo: "Denuncia",
            estado: "Resuelto",
            prioridad: "Alta",
            responsable: "Director Académico",
          },
          {
            fecha: "10/04/2025",
            hora: "11:30 AM",
            tipo: "Alerta Naranja",
            estado: "En curso",
            prioridad: "Alta",
            responsable: "Prof. J. Rivera",
          },
        ],
        reports: [
          {
            fecha: "08/04/2025",
            tipo: "Gustos",
            resumen: "Informe de gustos Inicio de Año",
          },
          {
            fecha: "08/04/2025",
            tipo: "Mensual Mar 2025",
            resumen: "Informe mensual del alumno",
          },
          {
            fecha: "08/04/2025",
            tipo: "Mensual Abr 2025",
            resumen: "Informe mensual del alumno",
          },
          {
            fecha: "08/04/2025",
            tipo: "Mensual May 2025",
            resumen: "Informe mensual del alumno",
          },
          {
            fecha: "08/04/2025",
            tipo: "Mensual Jun 2025",
            resumen: "Informe mensual del alumno",
          },
        ],
        emotions: {
          data: [
            { name: "Tristeza", value: 5, color: "#78b6ff" },
            { name: "Felicidad", value: 18, color: "#ffd166" },
            { name: "Estrés", value: 10, color: "#f5f5f5" },
            { name: "Ansiedad", value: 20, color: "#f4a261" },
            { name: "Enojo", value: 5, color: "#e63946" },
            { name: "Otros", value: 15, color: "#6c757d" },
          ],
          radarData: {
            alumno: [4.5, 3.8, 2.5, 4.2, 3.9],
            promedio: [3.2, 2.8, 3.5, 3.0, 2.7],
          },
        },
      }

      setStudent(mockStudent)
      setIsLoading(false)
    }

    fetchStudent()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleSidebar={() => {}} />
          <main className="flex-1 overflow-y-auto pb-10">
            <div className="container mx-auto px-6 py-8">
              <div className="flex justify-center items-center h-64">
                <p className="text-xl text-gray-500">Cargando información del alumno...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleSidebar={() => {}} />
          <main className="flex-1 overflow-y-auto pb-10">
            <div className="container mx-auto px-6 py-8">
              <div className="flex justify-center items-center h-64">
                <p className="text-xl text-gray-500">No se encontró información del alumno</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => {}} />
        <main className="flex-1 overflow-y-auto pb-10">
          <div className="container mx-auto px-6 py-8">
            {/* Información del estudiante */}
            <StudentHeader student={student} />

            {/* Pestañas */}
            <Tabs defaultValue="ficha" className="mb-6" onValueChange={setActiveTab}>
              <TabsList className="bg-blue-100">
                <TabsTrigger value="ficha" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Ficha
                </TabsTrigger>
                <TabsTrigger value="alertas" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Alertas
                </TabsTrigger>
                <TabsTrigger
                  value="informes"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  Informes
                </TabsTrigger>
                <TabsTrigger
                  value="emociones"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  Emociones
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ficha" className="mt-6">
                <StudentProfile student={student} />
              </TabsContent>

              <TabsContent value="alertas" className="mt-6">
                <StudentAlerts alerts={student.alerts} />
              </TabsContent>

              <TabsContent value="informes" className="mt-6">
                <StudentReports reports={student.reports} />
              </TabsContent>

              <TabsContent value="emociones" className="mt-6">
                <StudentEmotions emotionData={student.emotions.data} radarData={student.emotions.radarData} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
