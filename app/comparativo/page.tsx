"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { FilterDropdown } from "@/components/filter-dropdown"
import { BarChartComparison } from "@/components/bar-chart-comparison"
import { LineChartComparison } from "@/components/line-chart-comparison"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { colors } from "@/lib/colors"

export default function ComparativePage() {
  // Estados para los filtros
  const [levelFilter, setLevelFilter] = useState<string>("Todos")
  const [courseFilter, setCourseFilter] = useState<string>("Todos")
  const [yearFilter, setYearFilter] = useState<string>("2025")
  const [monthFilter, setMonthFilter] = useState<string>("Abril")

  // Opciones para los filtros
  const levelOptions = ["Todos", "Básico", "Medio"]
  const courseOptions = ["Todos", "3°B", "4°A", "5°A", "6°C", "1°A", "2°B"]
  const yearOptions = ["2023", "2024", "2025"]
  const monthOptions = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  // Datos para los gráficos de barras
  const emotionsDataCourseA = [
    { name: "Tristeza", value: 1500, color: colors.chart.blue },
    { name: "Felicidad", value: 3000, color: colors.chart.yellow },
    { name: "Estrés", value: 1000, color: colors.chart.gray },
    { name: "Ansiedad", value: 2500, color: colors.chart.orange },
    { name: "Enojo", value: 800, color: colors.chart.red },
    { name: "Otros", value: 2000, color: colors.chart.gray },
  ]

  const emotionsDataCourseB = [
    { name: "Tristeza", value: 1200, color: colors.chart.blue },
    { name: "Felicidad", value: 2800, color: colors.chart.yellow },
    { name: "Estrés", value: 1200, color: colors.chart.gray },
    { name: "Ansiedad", value: 2700, color: colors.chart.orange },
    { name: "Enojo", value: 1500, color: colors.chart.red },
    { name: "Otros", value: 1800, color: colors.chart.gray },
  ]

  // Datos para el gráfico de líneas
  const alertsData = [
    { month: "Ene", courseA: 1200, courseB: 1500 },
    { month: "Feb", courseA: 900, courseB: 1200 },
    { month: "Mar", courseA: 1500, courseB: 1000 },
    { month: "Abr", courseA: 2000, courseB: 1800 },
    { month: "May", courseA: 3000, courseB: 2500 },
    { month: "Jun", courseA: 2500, courseB: 2800 },
    { month: "Jul", courseA: 2800, courseB: 3200 },
  ]

  // Estados para las emociones seleccionadas
  const [selectedEmotionsCourseA, setSelectedEmotionsCourseA] = useState<string[]>([
    "Tristeza",
    "Felicidad",
    "Estrés",
    "Ansiedad",
    "Enojo",
    "Otros",
  ])

  const [selectedEmotionsCourseB, setSelectedEmotionsCourseB] = useState<string[]>([
    "Tristeza",
    "Felicidad",
    "Estrés",
    "Ansiedad",
    "Enojo",
    "Otros",
  ])

  // Estado para los cursos seleccionados en el gráfico de líneas
  const [selectedCourses, setSelectedCourses] = useState<string[]>(["courseA", "courseB"])

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
  const handleDownloadComparison = () => {
    alert("Descargando comparación...")
    // Aquí iría la lógica para descargar la comparación
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Comparativos</h2>
          <Button onClick={handleDownloadComparison} className="bg-blue-500 hover:bg-blue-600">
            <Download className="mr-2 h-4 w-4" />
            Descargar comparación
          </Button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <FilterDropdown label="Nivel" options={levelOptions} value={levelFilter} onChange={setLevelFilter} />
          <FilterDropdown label="Curso" options={courseOptions} value={courseFilter} onChange={setCourseFilter} />
          <FilterDropdown label="Año" options={yearOptions} value={yearFilter} onChange={setYearFilter} />
          <FilterDropdown label="Mes" options={monthOptions} value={monthFilter} onChange={setMonthFilter} />
        </div>

        {/* Gráficos de barras */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BarChartComparison
            title="Curso A"
            data={emotionsDataCourseA}
            selectedEmotions={selectedEmotionsCourseA}
            onToggleEmotion={handleToggleEmotionCourseA}
          />
          <BarChartComparison
            title="Curso B"
            data={emotionsDataCourseB}
            selectedEmotions={selectedEmotionsCourseB}
            onToggleEmotion={handleToggleEmotionCourseB}
          />
        </div>

        {/* Gráfico de líneas */}
        <div className="mb-6">
          <LineChartComparison
            title="Alertas totales"
            data={alertsData}
            selectedCourses={selectedCourses}
            onToggleCourse={handleToggleCourse}
          />
        </div>
      </div>
    </AppLayout>
  )
}
