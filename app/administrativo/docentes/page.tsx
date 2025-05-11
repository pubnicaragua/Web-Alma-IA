"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { FilterDropdown } from "@/components/filter-dropdown"
import { DataTable } from "@/components/data-table"
import { Pagination } from "@/components/pagination"
import { AddTeacherModal } from "@/components/teacher/add-teacher-modal"
import { type Teacher, getAllTeachers } from "@/services/teachers-service"
import TeacherDetailSkeleton from "@/components/teacher/teacher-detail-skeleton"

export default function TeachersPage() {
  const router = useRouter()

  // Estados para los datos y la carga
  const [teachersData, setTeachersData] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados para los filtros
  const [levelFilter, setLevelFilter] = useState<string>("Todos")
  const [courseFilter, setCourseFilter] = useState<string>("Todos")
  const [subjectFilter, setSubjectFilter] = useState<string>("Todos")
  const [typeFilter, setTypeFilter] = useState<string>("Todos")
  const [statusFilter, setStatusFilter] = useState<string>("Todos")

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

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

  // Opciones para los filtros
  const levelOptions = ["Todos", "Cuartos básicos", "Quintos básicos", "Sextos básicos"]
  const courseOptions = ["Todos", "A", "B", "C", "D"]

  // Generar opciones de filtro dinámicamente basadas en los datos
  const subjectOptions = ["Todos", ...Array.from(new Set(teachersData.map((teacher) => teacher.subject)))]
  const typeOptions = ["Todos", "Principal", "No asignado"]
  const statusOptions = ["Todos", ...Array.from(new Set(teachersData.map((teacher) => teacher.status)))]

  // Filtrar los datos según los filtros seleccionados
  const filteredTeachers = teachersData.filter((teacher) => {
    return (
      (levelFilter === "Todos" || teacher.level === levelFilter) &&
      (courseFilter === "Todos" || teacher.course === courseFilter) &&
      (subjectFilter === "Todos" || teacher.subject === subjectFilter) &&
      (typeFilter === "Todos" || teacher.type === typeFilter) &&
      (statusFilter === "Todos" || teacher.status === statusFilter)
    )
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
    { key: "document", title: "Documento" },
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
                src={teacher.image || "/placeholder.svg"}
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
              teacher.status === "Activo" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
            }`}
          >
            {teacher.status}
          </span>
        )
      case "document":
        return `${teacher.documentType}: ${teacher.document}`
      default:
        return teacher[column.key as keyof Teacher] || "-"
    }
  }

  // Función para agregar un nuevo docente
  const handleAddTeacher = (teacherData: {
    name: string
    rut: string
    email: string
    phone: string
    birthDate: string
    position: string
    subject: string
    tutorCourse: string
    type: string
    courses: string
  }) => {
    // En un caso real, aquí se enviaría la información al servidor
    // y luego se actualizaría el estado con la respuesta

    // Para este ejemplo, creamos un nuevo docente con datos simulados
    const newTeacher: Teacher = {
      id: (teachersData.length + 1).toString(),
      name: teacherData.name,
      subject: teacherData.subject,
      status: "Activo",
      document: teacherData.rut,
      documentType: "RUT",
      school: "Colegio Horizonte",
      schoolType: "Privado",
      level: "Cuartos básicos", // Valor por defecto
      course: teacherData.tutorCourse || "A", // Usar el curso que tutoriza o un valor por defecto
      type: teacherData.type || "No asignado",
      age: calculateAge(teacherData.birthDate) || 30, // Calcular edad o usar valor por defecto
      image: "/young-man-city.png", // Imagen por defecto
      email: teacherData.email,
    }

    setTeachersData([...teachersData, newTeacher])
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
          <TeacherDetailSkeleton />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <FilterDropdown label="Nivel" options={levelOptions} value={levelFilter} onChange={setLevelFilter} />
          <FilterDropdown label="Curso" options={courseOptions} value={courseFilter} onChange={setCourseFilter} />
          <FilterDropdown
            label="Especialidad"
            options={subjectOptions}
            value={subjectFilter}
            onChange={setSubjectFilter}
          />
          <FilterDropdown label="Tipo" options={typeOptions} value={typeFilter} onChange={setTypeFilter} />
          <FilterDropdown label="Estado" options={statusOptions} value={statusFilter} onChange={setStatusFilter} />
        </div>

        {/* Mensaje si no hay docentes */}
        {filteredTeachers.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6">
            No se encontraron docentes con los filtros seleccionados.
          </div>
        )}

        {/* Tabla de docentes */}
        {filteredTeachers.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <DataTable columns={columns} data={paginatedTeachers} renderCell={renderCell} />
          </div>
        )}

        {/* Paginación */}
        {filteredTeachers.length > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </div>
    </AppLayout>
  )
}
