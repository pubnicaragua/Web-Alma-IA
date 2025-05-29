"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { RefreshCw } from 'lucide-react'
import { Header } from "@/components/header"
import { NavigationMenu } from "@/components/navigation-menu"
import { FilterDropdown } from "@/components/filter-dropdown"
import { DataTable } from "@/components/data-table"
import { fetchStudents, type Student } from "@/services/students-service"
import { useToast } from "@/hooks/use-toast"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { AndroidNavMenu } from "@/components/android-nav-menu"
import { useIsMobile } from "@/hooks/use-mobile"

export default function StudentsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  // Estados para los filtros
  const [levelFilter, setLevelFilter] = useState<string>("Todos")
  const [courseFilter, setCourseFilter] = useState<string>("Todos")
  const [ageFilter, setAgeFilter] = useState<string>("Todos")
  const [statusFilter, setStatusFilter] = useState<string>("Todos")
  const [levelOptions, setLevelOptions] = useState<string[]>(["Todos"])
  const [courseOptions, setCourseOptions] = useState<string[]>(["Todos"])
  const [ageOptions, setAgeOptions] = useState<string[]>(["Todos"])
  const [statusOptions, setStatusOptions] = useState<string[]>(["Todos"])
  const [currentPage, setCurrentPage] = useState(1)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Cargar datos de estudiantes
  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Obtener datos de estudiantes desde la API
      const data = await fetchStudents()
      console.log("Datos de estudiantes obtenidos:", data)

      // Extraer opciones únicas para los filtros y añadir "Todos" al principio
      const uniqueLevels = Array.from(new Set(data.map(student => student.level)))
      const uniqueCourses = Array.from(new Set(data.map(student => student.course)))
      const uniqueAges = Array.from(new Set(data.map(student => String(student.age))))
      const uniqueStatuses = Array.from(new Set(data.map(student => student.status)))

      setLevelOptions(["Todos", ...uniqueLevels])
      setCourseOptions(["Todos", ...uniqueCourses])
      setAgeOptions(["Todos", ...uniqueAges])
      setStatusOptions(["Todos", ...uniqueStatuses])

      // Actualizar el estado con los datos obtenidos
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
  const filteredStudents = useMemo(() => {
    // Restablecer a la primera página cuando cambian los filtros
    setCurrentPage(1);
    
    return students.filter((student) => {
      return (
        (levelFilter === "Todos" || student.level === levelFilter) &&
        (courseFilter === "Todos" || student.course === courseFilter) &&
        (ageFilter === "Todos" || student.age.toString() === ageFilter) &&
        (statusFilter === "Todos" || student.status === statusFilter)
      )
    });
  }, [students, levelFilter, courseFilter, ageFilter, statusFilter]);

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
    router.push(`/alumnos/${ student.id }`)
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
        return `${ student.age } años`
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
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header toggleSidebar={toggleMobileMenu} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar para escritorio (siempre visible en md y superior) */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200">
          <div className="h-12 border-b"></div>
          <NavigationMenu />
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto p-2 md:p-6">
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
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No hay alumnos disponibles</div>
              ) : (
                <DataTable 
                  columns={columns} 
                  data={filteredStudents} 
                  renderCell={renderCell}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  pageSize={25}
                  className="mt-4"
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Menú para Android (solo en dispositivos móviles) */}
      {isMobile ? (
        <AndroidNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      ) : (
        <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  )
}