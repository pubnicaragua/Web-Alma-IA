'use client'

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { fetchStudents, type Student } from "@/services/students-service"
import { searchStudents } from "@/services/header-service"
import { useToast } from "@/hooks/use-toast"
import { DataTable } from "@/components/data-table"
import { FilterDropdown } from "@/components/filter-dropdown"
import { RefreshCw } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import { AndroidNavMenu } from "@/components/android-nav-menu"
import { MobileSidebar } from "@/components/mobile-sidebar"

export function StudentsContent() {
  const searchParams = useSearchParams()
  const searchParam = searchParams.get("search") ?? ""
  const router = useRouter()
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [levelFilter, setLevelFilter] = useState<string>("Todos")
  const [courseFilter, setCourseFilter] = useState<string>("Todos")
  const [ageFilter, setAgeFilter] = useState<string>("Todos")
  const [statusFilter, setStatusFilter] = useState<string>("Todos")

  const [levelOptions, setLevelOptions] = useState<string[]>(["Todos"])
  const [courseOptions, setCourseOptions] = useState<string[]>(["Todos"])
  const [ageOptions, setAgeOptions] = useState<string[]>(["Todos"])
  const [statusOptions, setStatusOptions] = useState<string[]>(["Todos"])

  const [currentPage, setCurrentPage] = useState(1)

  const loadStudents = async () => {
    try {
      setIsLoading(true)
      setError(null)

      let data: Student[] = searchParam
        ? await searchStudents(searchParam)
        : await fetchStudents()

      const uniqueLevels = Array.from(new Set(data.map(s => s.level)))
      const uniqueCourses = Array.from(new Set(data.map(s => s.course)))
      const uniqueAges = Array.from(new Set(data.map(s => String(s.age))))
      const uniqueStatuses = Array.from(new Set(data.map(s => s.status)))

      setLevelOptions(["Todos", ...uniqueLevels])
      setCourseOptions(["Todos", ...uniqueCourses])
      setAgeOptions(["Todos", ...uniqueAges])
      setStatusOptions(["Todos", ...uniqueStatuses])

      setStudents(data)
    } catch (err) {
      console.error("Error al cargar estudiantes:", err)
      setError("No se pudieron cargar los datos.")
      toast({
        title: "Error al cargar datos",
        description: "No se pudieron cargar los datos de estudiantes.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [searchParam])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchParam, levelFilter, courseFilter, ageFilter, statusFilter])

  const filteredStudents = useMemo(() => {
    if (!students.length) return []
    return students.filter(s =>
      (levelFilter === "Todos" || s.level === levelFilter) &&
      (courseFilter === "Todos" || s.course === courseFilter) &&
      (ageFilter === "Todos" || String(s.age) === ageFilter) &&
      (statusFilter === "Todos" || s.status === statusFilter)
    )
  }, [students, levelFilter, courseFilter, ageFilter, statusFilter])

  const columns = [
    { key: "name", title: "Alumno" },
    { key: "level", title: "Nivel" },
    { key: "course", title: "Curso" },
    { key: "age", title: "Edad" },
    { key: "status", title: "Estado" },
  ]

  const handleStudentClick = (student: Student) => {
    router.push(`/alumnos/${student.id}`)
  }

  const renderCell = (student: Student, column: { key: string }) => {
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

  if (isLoading) {
    return <div className="animate-pulse text-gray-500">Cargando estudiantes...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={loadStudents}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          <RefreshCw className="w-4 h-4 mr-2 inline" />
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <FilterDropdown label="Nivel" options={levelOptions} value={levelFilter} onChange={setLevelFilter} />
        <FilterDropdown label="Curso" options={courseOptions} value={courseFilter} onChange={setCourseFilter} />
        <FilterDropdown label="Edad" options={ageOptions} value={ageFilter} onChange={setAgeFilter} />
        <FilterDropdown label="Estado" options={statusOptions} value={statusFilter} onChange={setStatusFilter} />
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Mostrando {filteredStudents.length} alumno(s)
      </p>

      <DataTable
        columns={columns}
        data={filteredStudents}
        renderCell={renderCell}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        pageSize={25}
        className="mt-4"
      />
    </>
  )
}
