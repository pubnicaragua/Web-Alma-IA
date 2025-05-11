"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { FilterDropdown } from "@/components/filter-dropdown"
import { DataTable } from "@/components/data-table"
import { fetchStudents, type Student } from "@/services/students-service"
import { useToast } from "@/hooks/use-toast"

export default function StudentsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados para los filtros
  const [levelFilter, setLevelFilter] = useState<string>("Todos")
  const [courseFilter, setCourseFilter] = useState<string>("Todos")
  const [ageFilter, setAgeFilter] = useState<string>("Todos")
  const [statusFilter, setStatusFilter] = useState<string>("Todos")

  // Opciones para los filtros
  const levelOptions = ["Todos", "5° Básicos", "6° Básicos", "7° Básicos", "8° Básicos", "9° Básicos"]
  const courseOptions = ["Todos", "3°B", "4°A", "5°A", "6°C", "1°A", "2°B"]
  const ageOptions = ["Todos", "8", "9", "11", "12", "14", "15"]
  const statusOptions = ["Todos", "Bien", "Normal", "Mal"]

  // Cargar datos de estudiantes
  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchStudents()
      setStudents(data)
    } catch (err) {
      console.error("Error al cargar estudiantes:", err)
      setError("No se pudieron cargar los datos de estudiantes. Por favor, intente de nuevo.")

      // Mostrar notificación de error
      toast({
        title: "Error al cargar datos",
        description: "No se pudieron cargar los datos de estudiantes. Por favor, intente de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filtrar los datos según los filtros seleccionados
  const filteredStudents = students.filter((student) => {
    return (
      (levelFilter === "Todos" || student.level === levelFilter) &&
      (courseFilter === "Todos" || student.course === courseFilter) &&
      (ageFilter === "Todos" || student.age.toString() === ageFilter) &&
      (statusFilter === "Todos" || student.status === statusFilter)
    )
  })

  // Columnas para la tabla
  const columns = [
    { key: "name", title: "Alumno" },
    { key: "level", title: "Nivel" },
    { key: "course", title: "Curso" },
    { key: "age", title: "Edad" },
    { key: "status", title: "Estado" },
  ]

  // Función para navegar a la vista detallada del alumno
  const handleStudentClick = (student: Student) => {
    router.push(`/alumnos/${student.id}`)
  }

  // Renderizar celdas de la tabla
  const renderCell = (student: Student, column: { key: string; title: string }, index: number) => {
    switch (column.key) {
      case "name":
        return (
          <div
            className="flex items-center space-x-3 cursor-pointer hover:text-blue-500"
            onClick={() => handleStudentClick(student)}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={student.image || "/placeholder.svg"}
                alt={student.name}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <span>{student.name}</span>
          </div>
        )
      case "age":
        return `${student.age} años`
      default:
        return student[column.key as keyof Student]
    }
  }

  // Renderizar esqueleto de carga
  const renderSkeleton = () => {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  // Renderizar mensaje de error
  const renderError = () => {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={loadStudents}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2 inline" /> Reintentar
        </button>
      </div>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-2 sm:px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Alumnos</h2>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <FilterDropdown label="Nivel" options={levelOptions} value={levelFilter} onChange={setLevelFilter} />
          <FilterDropdown label="Curso" options={courseOptions} value={courseFilter} onChange={setCourseFilter} />
          <FilterDropdown label="Edad" options={ageOptions} value={ageFilter} onChange={setAgeFilter} />
          <FilterDropdown label="Estado" options={statusOptions} value={statusFilter} onChange={setStatusFilter} />
        </div>

        {/* Tabla de alumnos */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            renderSkeleton()
          ) : error ? (
            renderError()
          ) : students.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No hay alumnos disponibles</div>
          ) : (
            <DataTable columns={columns} data={filteredStudents} renderCell={renderCell} />
          )}
        </div>
      </div>
    </AppLayout>
  )
}
