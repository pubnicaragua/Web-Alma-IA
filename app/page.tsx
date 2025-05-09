"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { StatCard } from "@/components/stat-card"
import { BarChartComparison } from "@/components/bar-chart-comparison"
import { DonutChart } from "@/components/donut-chart"
import { ImportantDates } from "@/components/important-dates"
import { RecentAlerts } from "@/components/recent-alerts"

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
        setSchoolName("Colegio San Pedro")
      } else if (selectedSchool === "2") {
        setSchoolName("Colegio San Luis")
      } else if (selectedSchool === "3") {
        setSchoolName("Colegio San Ignacio")
      } else if (selectedSchool === "4") {
        setSchoolName("Colegio San Rafael")
      } else if (selectedSchool === "5") {
        setSchoolName("Colegio San Carlos")
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
            selectedEmotions={selectedEmotionsGeneral}
            onToggleEmotion={handleToggleEmotionGeneral}
          />
        </div>

        {/* Gráficos y datos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BarChartComparison
            title="Emociones"
            selectedEmotions={selectedEmotions}
            onToggleEmotion={handleToggleEmotion}
          />
          <DonutChart />
        </div>

        {/* Fechas importantes y alertas recientes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ImportantDates />
          <RecentAlerts />
        </div>
      </div>
    </AppLayout>
  )
}
