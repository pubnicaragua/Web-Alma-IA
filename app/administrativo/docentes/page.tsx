"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { FilterDropdown } from "@/components/filter-dropdown"
import { DataTable } from "@/components/data-table"
import { Pagination } from "@/components/pagination"
import { AddTeacherModal, AddTeacherModalProps } from "@/components/teacher/add-teacher-modal"
import { type Teacher, getAllTeachers } from "@/services/teachers-service"
import { TeachersListSkeleton } from "@/components/teacher/teachers-list-skeleton"
import { equalsIgnoreCase } from "@/lib/utils"

export default function TeachersPage() {
  const router = useRouter()

  // Estados para los datos y la carga
  const [teachersData, setTeachersData] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados para los filtros
  const [nameFilter, setNameFilter] = useState<string>("")
  const [subjectFilter, setSubjectFilter] = useState<string>("Todos")
  const [statusFilter, setStatusFilter] = useState<string>("Todos")

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25

  // Cargar datos de docentes
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getAllTeachers()
        setTeachersData(data || [])
      } catch (err) {
        console.error("Error al cargar docentes:", err)
        setError("No se pudieron cargar los datos de docentes. Por favor, intenta de nuevo más tarde.")
        setTeachersData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeachers()
  }, [])

  // Generar opciones de filtro dinámicamente basadas en los datos
  const subjectOptions = ["Todos", ...new Set(teachersData.map((teacher) => teacher.subject).filter(Boolean))]
  const statusOptions = ["Todos", ...new Set(teachersData.map((teacher) => teacher.status).filter(Boolean))]

  // Filtrar los datos según los filtros seleccionados
  const filteredTeachers = teachersData.filter((teacher) => {
    const matchesName = teacher.name.toLowerCase().includes(nameFilter.toLowerCase())
    const matchesSubject = subjectFilter === "Todos" || teacher.subject === subjectFilter
    const matchesStatus = statusFilter === "Todos" || teacher.status === statusFilter
    
    return matchesName && matchesSubject && matchesStatus
  })

  // Calcular el total de páginas
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage)

  // Paginar los datos
  const paginatedTeachers = filteredTeachers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Columnas para la tabla
  const columns = [
    { key: "name", title: "Docente" },
    { key: "subject", title: "Especialidad" },
    { key: "school", title: "Colegio" },
    { key: "status", title: "Estado" },
  ]

  // Función para navegar a la vista detallada del docente
  const handleTeacherClick = (teacher: Teacher) => {
    router.push(`/administrativo/docentes/${teacher.id}`)
  }

  // Renderizar celdas de la tabla
  const renderCell = (teacher: Teacher, column: { key: string; title: string }) => {
    switch (column.key) {
      case "name":
        return (
          <div
            className="flex items-center space-x-3 cursor-pointer hover:text-blue-500"
            onClick={() => handleTeacherClick(teacher)}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={teacher.image || "https://avatar.iran.liara.run/public"}
                alt={teacher.name}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <span>{teacher.name}</span>
          </div>
        )
      case "status":
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              equalsIgnoreCase(teacher.status, "Activo") ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
            }`}
          >
            {teacher.status.toLowerCase()}
          </span>
        )
      default:
        return teacher[column.key as keyof Teacher] || "-"
    }
  }

  // Función para agregar un nuevo docente
  const handleAddTeacher: AddTeacherModalProps['onAddTeacher'] = (teacher) => {
    console.log("Docente agregado:", teacher)
  }

  // Función para calcular la edad a partir de la fecha de nacimiento
  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0

    const today = new Date()
    const birthDateObj = new Date(birthDate)
    let age = today.getFullYear() - birthDateObj.getFullYear()
    const monthDiff = today.getMonth() - birthDateObj.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--
    }

    return age
  }

  // Mostrar skeleton mientras se cargan los datos
  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-3 sm:px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Docentes</h2>
          </div>
          <TeachersListSkeleton />
        </div>
      </AppLayout>
    )
  }

  // Mostrar mensaje de error si hay algún problema
  if (error) {
    return (
      <AppLayout>
        <div className="container mx-auto px-3 sm:px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Docentes</h2>
          </div>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-3 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Docentes</h2>
          <div className="flex justify-end">
            <AddTeacherModal onAddTeacher={handleAddTeacher} isMobile={true} />
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-1">
            <label htmlFor="nameFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar por nombre
            </label>
            <input
              id="nameFilter"
              type="text"
              placeholder="Buscar docente..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Especialidad
            </label>
            <FilterDropdown
              label="Especialidad"
              options={subjectOptions}
              value={subjectFilter}
              onChange={setSubjectFilter}
              className="w-full"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <FilterDropdown
              label="Estado"
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-full"
            />
          </div>
        </div>

        {/* Mensaje si no hay docentes */}
        {filteredTeachers.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6">
            No se encontraron docentes con los filtros seleccionados.
          </div>
        ) : (
          <>
            {/* Tabla de docentes */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <DataTable columns={columns} data={paginatedTeachers} pageSize={itemsPerPage} renderCell={renderCell} />
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
