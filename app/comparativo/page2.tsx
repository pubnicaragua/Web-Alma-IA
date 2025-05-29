"use client"

import { BarChartComparison } from "@/components/bar-chart-comparison"
import { FilterDropdown } from "@/components/filter-dropdown"
import { AppLayout } from "@/components/layout/app-layout"
import { LineChartComparison } from "@/components/line-chart-comparison"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  type AlertsTimelineData,
  type CourseData,
  type EmotionData,
  getAlertsTimelineData,
  getAvailableCourses,
  getCourseEmotionsData,
  getFilterOptions,
} from "@/services/comparativo-service"
import { Download, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function ComparativePage() {
  const { toast } = useToast()
  const isMobile = useIsMobile()

  // Estado para el colegio actual (debería venir de un contexto global o localStorage)
  const [colegioId, setColegioId] = useState<string>(() => {
    // Intentar obtener el colegio_id del localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem("colegio_id") || "1" // Valor por defecto si no existe
    }
    return "1"
  })

  // Estados para los filtros
  const [levelFilter, setLevelFilter] = useState<string>("Todos")
  const [courseAFilter, setCourseAFilter] = useState<string>("")
  const [courseBFilter, setCourseBFilter] = useState<string>("")
  const [yearFilter, setYearFilter] = useState<string>("")
  const [monthFilter, setMonthFilter] = useState<string>("")

  // Estados para las opciones de filtros
  const [filterOptions, setFilterOptions] = useState({
    levels: ["Todos"],
    courses: [],
    years: [],
    months: [],
  })

  // Estado para los cursos disponibles
  const [availableCourses, setAvailableCourses] = useState<CourseData[]>([])

  // Estados para los datos de emociones
  const [emotionsDataCourseA, setEmotionsDataCourseA] = useState<EmotionData[]>([])
  const [emotionsDataCourseB, setEmotionsDataCourseB] = useState<EmotionData[]>([])

  // Estado para los datos de la línea de tiempo
  const [timelineData, setTimelineData] = useState<AlertsTimelineData[]>([])

  // Estados para las emociones seleccionadas
  const [selectedEmotionsCourseA, setSelectedEmotionsCourseA] = useState<string[]>([])
  const [selectedEmotionsCourseB, setSelectedEmotionsCourseB] = useState<string[]>([])

  // Estado para los cursos seleccionados en el gráfico de líneas
  const [selectedCourses, setSelectedCourses] = useState<string[]>(["courseA", "courseB"])

  // Estado de carga
  const [isLoading, setIsLoading] = useState({
    filters: true,
    courses: true,
    emotionsA: false,
    emotionsB: false,
    timeline: false,
  })

  // Cargar opciones de filtros y cursos disponibles al inicio
  useEffect(() => {
    async function loadInitialData() {
      try {
        // Cargar opciones de filtros
        const options = await getFilterOptions(colegioId)
        setFilterOptions(options)

        // Establecer valores iniciales para los filtros
        if (options.years.length > 0) setYearFilter(options.years[0])
        if (options.months.length > 0) setMonthFilter(options.months[0])

        setIsLoading((prev) => ({ ...prev, filters: false }))

        // Cargar cursos disponibles
        const courses = await getAvailableCourses(colegioId)
        setAvailableCourses(courses)

        // Establecer cursos iniciales si hay disponibles
        if (courses.length >= 2) {
          setCourseAFilter(courses[0].id)
          setCourseBFilter(courses[1].id)
        } else if (courses.length === 1) {
          setCourseAFilter(courses[0].id)
        }

        setIsLoading((prev) => ({ ...prev, courses: false }))
      } catch (error) {
        console.error("Error loading initial data:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos iniciales. Por favor, intente nuevamente.",
          variant: "destructive",
        })
        setIsLoading((prev) => ({ ...prev, filters: false, courses: false }))
      }
    }

    loadInitialData()
  }, [colegioId, toast])

  // Cargar datos de emociones cuando cambien los filtros
  useEffect(() => {
    async function loadEmotionsData() {
      // Solo cargar si tenemos todos los filtros necesarios
      if (!courseAFilter || !yearFilter || !monthFilter) return

      setIsLoading((prev) => ({ ...prev, emotionsA: true }))

      try {
        const data = await getCourseEmotionsData(
          colegioId,
          courseAFilter,
          yearFilter,
          monthFilter,
          levelFilter !== "Todos" ? levelFilter : undefined,
        )

        setEmotionsDataCourseA(data)
        // Inicializar las emociones seleccionadas con todas las disponibles
        setSelectedEmotionsCourseA(data.map((item) => item.name))
      } catch (error) {
        console.error("Error loading emotions data for course A:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos de emociones para el Curso A.",
          variant: "destructive",
        })
      } finally {
        setIsLoading((prev) => ({ ...prev, emotionsA: false }))
      }
    }

    loadEmotionsData()
  }, [colegioId, courseAFilter, yearFilter, monthFilter, levelFilter, toast])

  // Cargar datos de emociones para el curso B
  useEffect(() => {
    async function loadEmotionsDataB() {
      // Solo cargar si tenemos todos los filtros necesarios
      if (!courseBFilter || !yearFilter || !monthFilter) return

      setIsLoading((prev) => ({ ...prev, emotionsB: true }))

      try {
        const data = await getCourseEmotionsData(
          colegioId,
          courseBFilter,
          yearFilter,
          monthFilter,
          levelFilter !== "Todos" ? levelFilter : undefined,
        )

        setEmotionsDataCourseB(data)
        // Inicializar las emociones seleccionadas con todas las disponibles
        setSelectedEmotionsCourseB(data.map((item) => item.name))
      } catch (error) {
        console.error("Error loading emotions data for course B:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos de emociones para el Curso B.",
          variant: "destructive",
        })
      } finally {
        setIsLoading((prev) => ({ ...prev, emotionsB: false }))
      }
    }

    loadEmotionsDataB()
  }, [colegioId, courseBFilter, yearFilter, monthFilter, levelFilter, toast])

  // Cargar datos de la línea de tiempo
  useEffect(() => {
    async function loadTimelineData() {
      // Solo cargar si tenemos todos los filtros necesarios
      if (!courseAFilter || !courseBFilter || !yearFilter || !monthFilter) return

      setIsLoading((prev) => ({ ...prev, timeline: true }))

      try {
        const data = await getAlertsTimelineData(
          colegioId,
          courseAFilter,
          courseBFilter,
          yearFilter,
          monthFilter,
          levelFilter !== "Todos" ? levelFilter : undefined,
        )

        setTimelineData(data)
      } catch (error) {
        console.error("Error loading timeline data:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos de la línea de tiempo.",
          variant: "destructive",
        })
      } finally {
        setIsLoading((prev) => ({ ...prev, timeline: false }))
      }
    }

    loadTimelineData()
  }, [colegioId, courseAFilter, courseBFilter, yearFilter, monthFilter, levelFilter, toast])

  // Funciones para manejar la selección de emociones
  const handleToggleEmotionCourseA = (emotion: string) => {
    if (selectedEmotionsCourseA.includes(emotion)) {
      setSelectedEmotionsCourseA(selectedEmotionsCourseA.filter((e) => e !== emotion))
    } else {
      setSelectedEmotionsCourseA([...selectedEmotionsCourseA, emotion])
    }
  }

  const handleToggleEmotionCourseB = (emotion: string) => {
    if (selectedEmotionsCourseB.includes(emotion)) {
      setSelectedEmotionsCourseB(selectedEmotionsCourseB.filter((e) => e !== emotion))
    } else {
      setSelectedEmotionsCourseB([...selectedEmotionsCourseB, emotion])
    }
  }

  // Función para manejar la selección de cursos en el gráfico de líneas
  const handleToggleCourse = (course: string) => {
    if (selectedCourses.includes(course)) {
      setSelectedCourses(selectedCourses.filter((c) => c !== course))
    } else {
      setSelectedCourses([...selectedCourses, course])
    }
  }

  // Función para descargar la comparación
  const handleDownloadComparison = async () => {
    try {
      // Aquí iría la lógica para descargar la comparación desde el backend
      const response = await fetch(
        `${API_BASE_URL}/api/comparativo/download?colegio_id=${colegioId}&curso_a_id=${courseAFilter}&curso_b_id=${courseBFilter}&year=${yearFilter}&month=${monthFilter}${levelFilter !== "Todos" ? `&nivel=${encodeURIComponent(levelFilter)}` : ""}`,
      )

      if (!response.ok) {
        throw new Error(`Error downloading comparison: ${response.status}`)
      }

      // Obtener el blob del archivo
      const blob = await response.blob()

      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `comparativo_${yearFilter}_${monthFilter}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)

      toast({
        title: "Éxito",
        description: "La comparación se ha descargado correctamente.",
      })
    } catch (error) {
      console.error("Error downloading comparison:", error)
      toast({
        title: "Error",
        description: "No se pudo descargar la comparación. Por favor, intente nuevamente.",
        variant: "destructive",
      })
    }
  }

  // Obtener los nombres de los cursos para mostrar en los títulos
  const getCourseNameById = (id: string): string => {
    const course = availableCourses.find((c) => c.id === id)
    return course ? course.name : "Curso no seleccionado"
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-3 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Comparativos</h2>
          <Button
            onClick={handleDownloadComparison}
            className="bg-blue-500 hover:bg-blue-600"
            disabled={
              isLoading.emotionsA || isLoading.emotionsB || isLoading.timeline || !courseAFilter || !courseBFilter
            }
          >
            {isLoading.emotionsA || isLoading.emotionsB || isLoading.timeline ? (
              <Loader2 className="h-4 w-4 animate-spin md:mr-2" />
            ) : (
              <Download className="h-4 w-4 md:mr-2" />
            )}
            <span className="hidden md:inline">Descargar comparación</span>
          </Button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <FilterDropdown
            label="Nivel"
            options={filterOptions.levels}
            value={levelFilter}
            onChange={setLevelFilter}
            disabled={isLoading.filters}
          />
          <FilterDropdown
            label="Curso A"
            options={availableCourses.map((c) => ({ value: c.id, label: c.name }))}
            value={courseAFilter}
            onChange={setCourseAFilter}
            disabled={isLoading.courses || availableCourses.length === 0}
          />
          <FilterDropdown
            label="Curso B"
            options={availableCourses.map((c) => ({ value: c.id, label: c.name }))}
            value={courseBFilter}
            onChange={setCourseBFilter}
            disabled={isLoading.courses || availableCourses.length === 0}
          />
          <FilterDropdown
            label="Año"
            options={filterOptions.years}
            value={yearFilter}
            onChange={setYearFilter}
            disabled={isLoading.filters || filterOptions.years.length === 0}
          />
          <FilterDropdown
            label="Mes"
            options={filterOptions.months}
            value={monthFilter}
            onChange={setMonthFilter}
            disabled={isLoading.filters || filterOptions.months.length === 0}
          />
        </div>

        {/* Gráficos de barras */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BarChartComparison
            title={getCourseNameById(courseAFilter)}
            initialData={emotionsDataCourseA}
            selectedEmotions={selectedEmotionsCourseA}
            onToggleEmotion={handleToggleEmotionCourseA}
            isLoading={isLoading.emotionsA}
          />
          <BarChartComparison
            title={getCourseNameById(courseBFilter)}
            initialData={emotionsDataCourseB}
            selectedEmotions={selectedEmotionsCourseB}
            onToggleEmotion={handleToggleEmotionCourseB}
            isLoading={isLoading.emotionsB}
          />
        </div>

        {/* Gráfico de líneas */}
        <div className="mb-6">
          <LineChartComparison
            title="Alertas totales"
            selectedCourses={selectedCourses}
            onToggleCourse={handleToggleCourse}
            timelineData={timelineData}
            courseAName={getCourseNameById(courseAFilter)}
            courseBName={getCourseNameById(courseBFilter)}
            isLoading={isLoading.timeline}
          />
        </div>
      </div>
    </AppLayout>
  )
}