"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { FilterDropdown } from "@/components/filter-dropdown"
import { DataTable } from "@/components/data-table"

interface Student {
  id: string
  name: string
  level: string
  course: string
  age: number
  status: string
  image?: string
}

export default function StudentsPage() {
  const router = useRouter()

  // Datos de ejemplo para los alumnos
  const studentsData: Student[] = [
    {
      id: "1",
      name: "Carolina Espina",
      level: "Básico",
      course: "4°A",
      age: 12,
      status: "Bien",
      image: "/smiling-woman-garden.png",
    },
    {
      id: "2",
      name: "Matías Ignacio Díaz",
      level: "Básico",
      course: "4°A",
      age: 8,
      status: "Bien",
      image: "/young-man-city.png",
    },
    {
      id: "3",
      name: "Carolina Espina",
      level: "Básico",
      course: "4°A",
      age: 12,
      status: "Bien",
      image: "/smiling-woman-garden.png",
    },
    {
      id: "4",
      name: "Jaime Brito",
      level: "Básico",
      course: "3°B",
      age: 9,
      status: "Normal",
      image: "/young-man-city.png",
    },
    {
      id: "5",
      name: "Teresa Ulloa",
      level: "Básico",
      course: "5°A",
      age: 11,
      status: "Bien",
      image: "/smiling-woman-garden.png",
    },
    {
      id: "6",
      name: "Carlos Araneda",
      level: "Básico",
      course: "6°C",
      age: 12,
      status: "Bien",
      image: "/young-man-city.png",
    },
    {
      id: "7",
      name: "Valentina Rojas",
      level: "Medio",
      course: "1°A",
      age: 14,
      status: "Normal",
      image: "/smiling-woman-garden.png",
    },
    {
      id: "8",
      name: "Sebastián Muñoz",
      level: "Medio",
      course: "2°B",
      age: 15,
      status: "Bien",
      image: "/young-man-city.png",
    },
  ]

  // Estados para los filtros
  const [levelFilter, setLevelFilter] = useState<string>("Todos")
  const [courseFilter, setCourseFilter] = useState<string>("Todos")
  const [ageFilter, setAgeFilter] = useState<string>("Todos")
  const [statusFilter, setStatusFilter] = useState<string>("Todos")

  // Opciones para los filtros
  const levelOptions = ["Todos", "Básico", "Medio"]
  const courseOptions = ["Todos", "3°B", "4°A", "5°A", "6°C", "1°A", "2°B"]
  const ageOptions = ["Todos", "8", "9", "11", "12", "14", "15"]
  const statusOptions = ["Todos", "Bien", "Normal", "Mal"]

  // Filtrar los datos según los filtros seleccionados
  const filteredStudents = studentsData.filter((student) => {
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
          <DataTable columns={columns} data={filteredStudents} renderCell={renderCell} />
        </div>
      </div>
    </AppLayout>
  )
}
