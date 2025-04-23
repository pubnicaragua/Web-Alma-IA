"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, Bell, Users } from "lucide-react"
import { Header } from "@/components/header"

interface School {
  id: string
  name: string
  alerts: number
  students: number
  color: string
}

export default function SelectSchoolPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  useEffect(() => {
    // Comprobar si el usuario está autenticado
    const isAuthenticated = localStorage.getItem("isAuthenticated")

    if (isAuthenticated !== "true") {
      // Si no está autenticado, redirigir al login
      router.push("/login")
    } else {
      setIsLoading(false)
    }
  }, [router])

  // Datos de ejemplo para los colegios
  const schools: School[] = [
    {
      id: "1",
      name: "Colegio San Pedrito",
      alerts: 230,
      students: 2300,
      color: "bg-blue-500",
    },
    {
      id: "2",
      name: "Colegio San Pedrito",
      alerts: 230,
      students: 2300,
      color: "bg-green-500",
    },
    {
      id: "3",
      name: "Colegio San Pedrito",
      alerts: 230,
      students: 2300,
      color: "bg-orange-400",
    },
    {
      id: "4",
      name: "Colegio San Pedrito",
      alerts: 230,
      students: 2300,
      color: "bg-pink-400",
    },
    {
      id: "5",
      name: "Colegio San Pedrito",
      alerts: 230,
      students: 2300,
      color: "bg-blue-300",
    },
  ]

  const handleSelectSchool = (schoolId: string) => {
    // Guardar el colegio seleccionado
    localStorage.setItem("selectedSchool", schoolId)

    // Redirigir al dashboard
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-gray-700 text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex-1 px-6 py-8">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Seleccionar colegio</h2>

          <div className="space-y-4">
            {schools.map((school) => (
              <button
                key={school.id}
                className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex items-center justify-between border border-gray-100 relative overflow-hidden"
                onClick={() => handleSelectSchool(school.id)}
              >
                <div className="flex items-center">
                  <div className="bg-gray-100 p-3 rounded-lg mr-4">
                    <Building2 className="h-6 w-6 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-800">{school.name}</span>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-600">{school.alerts} alertas totales</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-600">{school.students} alumnos</span>
                  </div>
                </div>

                {/* Barra de color */}
                <div className={`absolute right-0 top-0 bottom-0 w-2 ${school.color}`}></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
