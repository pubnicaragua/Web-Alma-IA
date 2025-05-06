"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { StatCard } from "@/components/stat-card"
import { BarChartComparison } from "@/components/bar-chart-comparison"
import { DonutChart } from "@/components/donut-chart"
import { ImportantDates } from "@/components/important-dates"
import { RecentAlerts } from "@/components/recent-alerts"
import { themeColors } from "@/lib/theme-colors"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [schoolName, setSchoolName] = useState("Colegio Santiago Apostol")
  const [selectedEmotionsGeneral, setSelectedEmotionsGeneral] = useState<string[]>([
    "Tristeza",
    "Felicidad",
    "Estrés",
    "Ansiedad",
    "Enojo",
    "Otros",
  ])
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([
    "Tristeza",
    "Felicidad",
    "Estrés",
    "Ansiedad",
    "Enojo",
    "Otros",
  ])

  // Funciones para manejar la selección de emociones
  const handleToggleEmotionGeneral = (emotion: string) => {
    if (selectedEmotionsGeneral.includes(emotion)) {
      setSelectedEmotionsGeneral(selectedEmotionsGeneral.filter((e) => e !== emotion))
    } else {
      setSelectedEmotionsGeneral([...selectedEmotionsGeneral, emotion])
    }
  }

  const handleToggleEmotion = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter((e) => e !== emotion))
    } else {
      setSelectedEmotions([...selectedEmotions, emotion])
    }
  }

  useEffect(() => {
    // Comprobar si el usuario está autenticado
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const selectedSchool = localStorage.getItem("selectedSchool")

    if (isAuthenticated !== "true") {
      // Si no está autenticado, redirigir al login
      router.push("/login")
    } else if (!selectedSchool) {
      // Si no ha seleccionado un colegio, redirigir a la selección
      router.push("/select-school")
    } else {
      // Si está autenticado y ha seleccionado un colegio, mostrar el dashboard
      // Aquí podríamos cargar el nombre del colegio según el ID seleccionado
      if (selectedSchool === "1") {
        setSchoolName("Colegio San Pedrito (Azul)")
      } else if (selectedSchool === "2") {
        setSchoolName("Colegio San Pedrito (Verde)")
      } else if (selectedSchool === "3") {
        setSchoolName("Colegio San Pedrito (Naranja)")
      } else if (selectedSchool === "4") {
        setSchoolName("Colegio San Pedrito (Rosa)")
      } else if (selectedSchool === "5") {
        setSchoolName("Colegio San Pedrito (Celeste)")
      }

      setIsLoading(false)
    }
  }, [router])

  // Datos para las tarjetas de estadísticas
  const statCards = [
    {
      title: "Alumnos",
      count: 637,
      stats: [
        { label: "Inactivos", value: "19" },
        { label: "Frecuentes", value: "510" },
        { label: "Totales", value: "733" },
      ],
      className: "bg-gray-700", // Más intenso
      textColor: "text-white",
    },
    {
      title: "SOS Alma",
      count: 5,
      stats: [
        { label: "Vencidos", value: "0" },
        { label: "Por vencer", value: "2" },
        { label: "Totales", value: "13" },
      ],
      className: "bg-red-600", // Más intenso
      textColor: "text-white",
    },
    {
      title: "Denuncias",
      count: 19,
      stats: [
        { label: "Vencidos", value: "0" },
        { label: "Por vencer", value: "3" },
        { label: "Totales", value: "24" },
      ],
      className: "bg-purple-700", // Más intenso
      textColor: "text-white",
    },
    {
      title: "Alertas Alma",
      count: 57,
      stats: [
        { label: "Vencidos", value: "0" },
        { label: "Por vencer", value: "6" },
        { label: "Totales", value: "82" },
      ],
      className: "bg-yellow-500", // Más intenso
      textColor: "text-white",
    },
  ]

  // Datos para el gráfico de emociones con valores fijos diferentes
  const emotionData = [
    { name: "Tristeza", value: 1500, color: themeColors.chart.blue },
    { name: "Felicidad", value: 3000, color: themeColors.chart.yellow },
    { name: "Estrés", value: 1000, color: themeColors.chart.gray },
    { name: "Ansiedad", value: 2500, color: themeColors.chart.orange },
    { name: "Enojo", value: 800, color: themeColors.chart.red },
    { name: "Otros", value: 2000, color: themeColors.chart.purple },
  ]

  // Datos para el gráfico de emociones general (con valores ligeramente diferentes)
  const emotionDataGeneral = [
    { name: "Tristeza", value: 2000, color: themeColors.chart.blue },
    { name: "Felicidad", value: 4000, color: themeColors.chart.yellow },
    { name: "Estrés", value: 1800, color: themeColors.chart.gray },
    { name: "Ansiedad", value: 3200, color: themeColors.chart.orange },
    { name: "Enojo", value: 1200, color: themeColors.chart.red },
    { name: "Otros", value: 2800, color: themeColors.chart.purple },
  ]

  // Datos para el gráfico circular
  const donutData = [
    { label: "10 Pendientes", value: 10, percentage: "22.8%", color: themeColors.chart.yellow },
    { label: "07 Nuevos", value: 7, percentage: "13.9%", color: themeColors.status.success },
    { label: "39 Atendidos", value: 39, percentage: "52.1%", color: themeColors.primary.main },
    { label: "05 Aplazados", value: 5, percentage: "11.2%", color: themeColors.chart.purple },
  ]

  // Datos para las fechas importantes
  const importantDates = [
    { event: "Pruebas Parciales", dateRange: "Abr 02 - Abr 07" },
    { event: "Reunión de Apoderados", dateRange: "Abr 02 - Abr 07" },
    { event: "Matrícula 2025", dateRange: "Abr 02 - Abr 07" },
    { event: "Semana santa", dateRange: "Abr 02 - Abr 07" },
    { event: "Pruebas Parciales", dateRange: "Abr 02 - Abr 07" },
    { event: "Pruebas Parciales", dateRange: "Abr 02 - Abr 07" },
    { event: "Pruebas Parciales", dateRange: "Abr 02 - Abr 07" },
  ]

  // Datos para las alertas recientes
  const recentAlerts = [
    {
      student: {
        name: "Carolina Espina",
        image: "/smiling-woman-garden.png",
      },
      alertType: "SOS Alma",
      date: "Abr 02 - 2024",
    },
    {
      student: {
        name: "Jaime Brito",
        image: "/young-man-city.png",
      },
      alertType: "Denuncias",
      date: "Mar 29 - 2024",
    },
    {
      student: {
        name: "Teresa Ulloa",
        image: "/smiling-woman-garden.png",
      },
      alertType: "IA",
      date: "Mar 27 - 2024",
    },
    {
      student: {
        name: "Carlos Araneda",
        image: "/young-man-city.png",
      },
      alertType: "SOS Alma",
      date: "Mar 26 - 2024",
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-400 flex justify-center items-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-2 sm:px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{schoolName}</h2>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <StatCard
              key={index}
              title={card.title}
              count={card.count}
              stats={card.stats}
              className={card.className}
              textColor={card.textColor}
            />
          ))}
        </div>

        {/* Media emocional General */}
        <div className="mb-8">
          <BarChartComparison
            title="Media emocional General"
            data={emotionDataGeneral}
            selectedEmotions={selectedEmotionsGeneral}
            onToggleEmotion={handleToggleEmotionGeneral}
          />
        </div>

        {/* Gráficos y datos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BarChartComparison
            title="Emociones"
            data={emotionData}
            selectedEmotions={selectedEmotions}
            onToggleEmotion={handleToggleEmotion}
          />
          <DonutChart data={donutData} />
        </div>

        {/* Fechas importantes y alertas recientes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ImportantDates dates={importantDates} />
          <RecentAlerts alerts={recentAlerts} />
        </div>
      </div>
    </AppLayout>
  )
}
