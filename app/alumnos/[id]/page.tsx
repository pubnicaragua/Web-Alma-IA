"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentAlerts } from "@/components/student/student-alerts"
import { StudentReports } from "@/components/student/student-reports"
import { StudentEmotions } from "@/components/student/student-emotions"
import { User, Phone, Mail, Home, Users, FileText, Bell, Smile } from "lucide-react"
import { StudentSkeleton } from "@/components/student/student-skeleton"

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
      <AppLayout>
        <div className="container mx-auto px-3 sm:px-6 py-8">
          <StudentSkeleton />
        </div>
      </AppLayout>
    )
  }

  if (!student) {
    return (
      <AppLayout>
        <div className="container mx-auto px-3 sm:px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-500">No se encontró información del alumno</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-3 sm:px-6 py-8">
        {/* Zona 1: Información principal del estudiante */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-blue-200">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-blue-100">
              <img
                src={student.image || "/placeholder.svg"}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h1 className="text-3xl font-bold text-gray-800">{student.name}</h1>
              <p className="text-xl text-gray-600 mb-2">{student.course}</p>
              <div className="flex gap-4">
                <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {student.age} años
                </div>
                <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Estado: {student.status}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zona 2: Pestañas de navegación */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-blue-200">
          <Tabs defaultValue="ficha" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="bg-blue-100 w-full justify-start">
              <TabsTrigger
                value="ficha"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white flex items-center"
              >
                <User className="h-4 w-4 mr-2" />
                Ficha
              </TabsTrigger>
              <TabsTrigger
                value="alertas"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white flex items-center"
              >
                <Bell className="h-4 w-4 mr-2" />
                Alertas
              </TabsTrigger>
              <TabsTrigger
                value="informes"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white flex items-center"
              >
                <FileText className="h-4 w-4 mr-2" />
                Informes
              </TabsTrigger>
              <TabsTrigger
                value="emociones"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white flex items-center"
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
                        <span className="text-sm text-gray-500">Número de documento:</span>
                        <span className="text-gray-800 font-medium">{student.documentNumber}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Fecha de nacimiento:</span>
                        <span className="text-gray-800 font-medium">{student.birthDate}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Género:</span>
                        <span className="text-gray-800 font-medium">{student.gender}</span>
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
                          <span className="text-sm text-gray-500">Celular:</span>
                          <span className="text-gray-800 font-medium">{student.cellphone}</span>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <Mail className="h-5 w-5 text-blue-500 mr-3" />
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">Correo:</span>
                          <span className="text-gray-800 font-medium">{student.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <Users className="h-5 w-5 text-blue-500 mr-3" />
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">Idioma:</span>
                          <span className="text-gray-800 font-medium">{student.languages}</span>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <Home className="h-5 w-5 text-blue-500 mr-3" />
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">Dirección:</span>
                          <span className="text-gray-800 font-medium">{student.address}</span>
                        </div>
                      </div>
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
                          <th className="px-4 py-3 text-left font-medium text-white">Tipo</th>
                          <th className="px-4 py-3 text-left font-medium text-white">Nombre</th>
                          <th className="px-4 py-3 text-left font-medium text-white">Parentesco</th>
                          <th className="px-4 py-3 text-left font-medium text-white">Teléfono</th>
                          <th className="px-4 py-3 text-left font-medium text-white">RUT/DNI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {student.contacts.apoderados.map((contact, index) => (
                          <tr key={index} className="border-b-2 border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  contact.tipo === "Principal"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {contact.tipo}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-medium">{contact.nombre}</td>
                            <td className="px-4 py-3 text-sm">{contact.parentesco}</td>
                            <td className="px-4 py-3 text-sm">{contact.telefono}</td>
                            <td className="px-4 py-3 text-sm">{contact.rut}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Antecedentes clínicos */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-blue-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Antecedentes clínicos
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                      <thead>
                        <tr className="bg-blue-300">
                          <th className="px-4 py-3 text-left font-medium text-white">Tipo</th>
                          <th className="px-4 py-3 text-left font-medium text-white">Nombre</th>
                          <th className="px-4 py-3 text-left font-medium text-white">Parentesco</th>
                          <th className="px-4 py-3 text-left font-medium text-white">Teléfono</th>
                          <th className="px-4 py-3 text-left font-medium text-white">RUT/DNI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {student.contacts.antecedentesClinicosContactos.map((contact, index) => (
                          <tr key={index} className="border-b-2 border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  contact.tipo === "Principal"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {contact.tipo}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-medium">{contact.nombre}</td>
                            <td className="px-4 py-3 text-sm">{contact.parentesco}</td>
                            <td className="px-4 py-3 text-sm">{contact.telefono}</td>
                            <td className="px-4 py-3 text-sm">{contact.rut}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="alertas">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
                  <StudentAlerts alerts={student.alerts} />
                </div>
              </TabsContent>

              <TabsContent value="informes">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
                  <StudentReports reports={student.reports} />
                </div>
              </TabsContent>

              <TabsContent value="emociones">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
                  <StudentEmotions emotionData={student.emotions.data} radarData={student.emotions.radarData} />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}
