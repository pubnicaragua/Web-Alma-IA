"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
// Asegúrate de que la importación de AppLayout sea correcta
import { AppLayout } from "@/components/layout/app-layout"
import { StatCard } from "@/components/stat-card"
import { EmotionChart } from "@/components/emotion-chart"
import { DonutChart } from "@/components/donut-chart"
import { ImportantDates } from "@/components/important-dates"
import { RecentAlerts } from "@/components/recent-alerts"
import { colors } from "@/lib/colors"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [schoolName, setSchoolName] = useState("Colegio Santiago Apostol")

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
      count: 14,
      stats: [
        { label: "activos", value: "" },
        { label: "Inactivos", value: "40" },
        { label: "Frecuentes", value: "22" },
        { label: "Totales", value: "2390" },
      ],
      className: "bg-gray-600",
      textColor: "text-white",
    },
    {
      title: "SOS Alma",
      count: 14,
      stats: [
        { label: "nuevos", value: "" },
        { label: "Vencidos", value: "40" },
        { label: "Por vencer", value: "22" },
        { label: "Totales", value: "23" },
      ],
      className: "bg-red-500",
      textColor: "text-white",
    },
    {
      title: "Denuncias",
      count: 14,
      stats: [
        { label: "nuevos", value: "" },
        { label: "Vencidos", value: "40" },
        { label: "Por vencer", value: "22" },
        { label: "Totales", value: "23" },
      ],
      className: "bg-purple-600",
      textColor: "text-white",
    },
    {
      title: "Alertas Alma",
      count: 14,
      stats: [
        { label: "nuevos", value: "" },
        { label: "Vencidos", value: "40" },
        { label: "Por vencer", value: "22" },
        { label: "Totales", value: "23" },
      ],
      className: "bg-yellow-400",
      textColor: "text-white",
    },
  ]

  // Datos para el gráfico de emociones con valores fijos diferentes
  const emotionData = [
    { label: "Tristeza", value: 1500, color: colors.chart.blue },
    { label: "Felicidad", value: 3000, color: colors.chart.yellow },
    { label: "Estrés", value: 1000, color: colors.chart.gray },
    { label: "Ansias", value: 2500, color: colors.chart.orange },
    { label: "Enojo", value: 800, color: colors.chart.red },
    { label: "Otros", value: 2000, color: colors.chart.gray },
  ]

  // Datos para el gráfico circular
  const donutData = [
    { label: "10 Pendientes", value: 10, percentage: "22.8%", color: colors.chart.yellow },
    { label: "07 Nuevos", value: 7, percentage: "13.9%", color: colors.status.success },
    { label: "39 Atendidos", value: 39, percentage: "52.1%", color: colors.primary.main },
    { label: "05 Aplazados", value: 5, percentage: "11.2%", color: colors.chart.gray },
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
      <div className="container mx-auto px-6 py-8">
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
          <EmotionChart title="Media emocional General" data={emotionData} maxValue={5000} />
        </div>

        {/* Gráficos y datos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <EmotionChart title="Emociones" data={emotionData} maxValue={5000} />
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
