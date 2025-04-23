"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { FilterDropdown } from "@/components/filter-dropdown"
import { DataTable } from "@/components/data-table"
import { Pagination } from "@/components/pagination"
import { AddTeacherModal } from "@/components/teacher/add-teacher-modal"

interface Teacher {
  id: string
  name: string
  level: string
  course: string
  subject: string
  type: string
  age: number
  image?: string
}

export default function TeachersPage() {
  const router = useRouter()

  // Datos de ejemplo para los docentes
  const [teachersData, setTeachersData] = useState<Teacher[]>([
    {
      id: "1",
      name: "Palomina Gutierrez",
      level: "Cuartos básicos",
      course: "A",
      subject: "Matemáticas",
      type: "Principal",
      age: 28,
      image: "/smiling-woman-garden.png",
    },
    {
      id: "2",
      name: "Matías Ignacio Díaz",
      level: "Cuartos básicos",
      course: "B",
      subject: "Comunicación",
      type: "No asignado",
      age: 28,
      image: "/young-man-city.png",
    },
    {
      id: "3",
      name: "Carolina Espina",
      level: "Cuartos básicos",
      course: "C",
      subject: "Comunicación",
      type: "No asignado",
      age: 28,
      image: "/smiling-woman-garden.png",
    },
    {
      id: "4",
      name: "Carolina Espina",
      level: "Cuartos básicos",
      course: "D",
      subject: "Comunicación",
      type: "No asignado",
      age: 28,
      image: "/smiling-woman-garden.png",
    },
    {
      id: "5",
      name: "Jorge Mendez",
      level: "Quintos básicos",
      course: "A",
      subject: "Ciencias",
      type: "Principal",
      age: 35,
      image: "/young-man-city.png",
    },
    {
      id: "6",
      name: "Ana María López",
      level: "Quintos básicos",
      course: "B",
      subject: "Historia",
      type: "Principal",
      age: 42,
      image: "/smiling-woman-garden.png",
    },
    {
      id: "7",
      name: "Roberto Sánchez",
      level: "Sextos básicos",
      course: "A",
      subject: "Educación Física",
      type: "No asignado",
      age: 31,
      image: "/young-man-city.png",
    },
    {
      id: "8",
      name: "Claudia Morales",
      level: "Sextos básicos",
      course: "B",
      subject: "Artes",
      type: "No asignado",
      age: 29,
      image: "/smiling-woman-garden.png",
    },
  ])

  // Estados para los filtros
  const [levelFilter, setLevelFilter] = useState<string>("Todos")
  const [courseFilter, setCourseFilter] = useState<string>("Todos")
  const [subjectFilter, setSubjectFilter] = useState<string>("Todos")
  const [typeFilter, setTypeFilter] = useState<string>("Todos")
  const [ageFilter, setAgeFilter] = useState<string>("Todos")

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4
  const totalPages = Math.ceil(teachersData.length / itemsPerPage)

  // Opciones para los filtros
  const levelOptions = ["Todos", "Cuartos básicos", "Quintos básicos", "Sextos básicos"]
  const courseOptions = ["Todos", "A", "B", "C", "D"]
  const subjectOptions = ["Todos", "Matemáticas", "Comunicación", "Ciencias", "Historia", "Educación Física", "Artes"]
  const typeOptions = ["Todos", "Principal", "No asignado"]
  const ageOptions = ["Todos", "28", "29", "31", "35", "42"]

  // Filtrar los datos según los filtros seleccionados
  const filteredTeachers = teachersData.filter((teacher) => {
    return (
      (levelFilter === "Todos" || teacher.level === levelFilter) &&
      (courseFilter === "Todos" || teacher.course === courseFilter) &&
      (subjectFilter === "Todos" || teacher.subject === subjectFilter) &&
      (typeFilter === "Todos" || teacher.type === typeFilter) &&
      (ageFilter === "Todos" || teacher.age.toString() === ageFilter)
    )
  })

  // Paginar los datos
  const paginatedTeachers = filteredTeachers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Columnas para la tabla
  const columns = [
    { key: "name", title: "Docente" },
    { key: "level", title: "Nivel" },
    { key: "course", title: "Curso" },
    { key: "subject", title: "Asignatura" },
    { key: "type", title: "Tipo" },
    { key: "age", title: "Edad" },
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
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={teacher.image || "/placeholder.svg"}
                alt={teacher.name}
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <span>{teacher.name}</span>
          </div>
        )
      case "age":
        return `${teacher.age} años`
      default:
        return teacher[column.key as keyof Teacher]
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
      level: "Cuartos básicos", // Valor por defecto
      course: teacherData.tutorCourse || "A", // Usar el curso que tutoriza o un valor por defecto
      subject: teacherData.subject,
      type: teacherData.type || "No asignado",
      age: calculateAge(teacherData.birthDate) || 30, // Calcular edad o usar valor por defecto
      image: "/young-man-city.png", // Imagen por defecto
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

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Docentes</h2>
          <AddTeacherModal onAddTeacher={handleAddTeacher} />
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <FilterDropdown label="Nivel" options={levelOptions} value={levelFilter} onChange={setLevelFilter} />
          <FilterDropdown label="Curso" options={courseOptions} value={courseFilter} onChange={setCourseFilter} />
          <FilterDropdown
            label="Asignatura"
            options={subjectOptions}
            value={subjectFilter}
            onChange={setSubjectFilter}
          />
          <FilterDropdown label="Tipo" options={typeOptions} value={typeFilter} onChange={setTypeFilter} />
          <FilterDropdown label="Edad" options={ageOptions} value={ageFilter} onChange={setAgeFilter} />
        </div>

        {/* Tabla de docentes */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <DataTable columns={columns} data={paginatedTeachers} renderCell={renderCell} />
        </div>

        {/* Paginación */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </AppLayout>
  )
}
