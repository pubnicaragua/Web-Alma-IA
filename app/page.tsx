"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { StatCard } from "@/components/stat-card"
import { BarChartComparison } from "@/components/bar-chart-comparison"
import { DonutChart } from "@/components/donut-chart"
import { ImportantDates } from "@/components/important-dates"
import { RecentAlerts } from "@/components/recent-alerts"
import { isAuthenticated } from "@/lib/api-config"
import { type CardData, fetchCardData } from "@/services/home-service"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [cardData, setCardData] = useState<CardData | null>(null)
  const [cardError, setCardError] = useState<string | null>(null)
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
    console.log("Home: Inicializando página principal")

    // Verificar autenticación
    if (!isAuthenticated()) {
      console.log("Home: Usuario no autenticado, redirigiendo a /login")
      router.push("/login")
      return
    }

    // Si no hay colegio seleccionado, establecer uno por defecto
    if (!localStorage.getItem("selectedSchool")) {
      localStorage.setItem("selectedSchool", "1")
    }

    // Cargar el nombre del colegio según el ID seleccionado
    const selectedSchool = localStorage.getItem("selectedSchool")
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

    // Cargar datos de las tarjetas
    const loadCardData = async () => {
      try {
        setCardError(null)
        const data = await fetchCardData()
        setCardData(data)
      } catch (error) {
        console.error("Error al cargar datos de tarjetas:", error)
        setCardError("No se pudieron cargar los datos de las tarjetas")
        toast({
          title: "Error al cargar datos",
          description: "No se pudieron cargar los datos de las tarjetas. Por favor, intente de nuevo.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadCardData()

    console.log("Home: Página principal inicializada correctamente")
  }, [router, toast]) // Dependencias: router y toast

  // Datos para las tarjetas de estadísticas
  const getStatCards = () => {
    if (!cardData) return []

    return [
      {
        title: "Alumnos",
        count: cardData.alumnos.activos,
        stats: [
          { label: "Inactivos", value: cardData.alumnos.inactivos.toString() },
          { label: "Frecuentes", value: cardData.alumnos.frecuentes.toString() },
          { label: "Totales", value: cardData.alumnos.totales.toString() },
        ],
        className: "bg-gray-700", // Más intenso
        textColor: "text-white",
      },
      {
        title: "SOS Alma",
        count: cardData.sos_alma.activos,
        stats: [
          { label: "Vencidos", value: cardData.sos_alma.vencidos.toString() },
          { label: "Por vencer", value: cardData.sos_alma.por_vencer.toString() },
          { label: "Totales", value: cardData.sos_alma.totales.toString() },
        ],
        className: "bg-red-600", // Más intenso
        textColor: "text-white",
      },
      {
        title: "Denuncias",
        count: cardData.denuncias.activos,
        stats: [
          { label: "Vencidos", value: cardData.denuncias.vencidos.toString() },
          { label: "Por vencer", value: cardData.denuncias.por_vencer.toString() },
          { label: "Totales", value: cardData.denuncias.totales.toString() },
        ],
        className: "bg-purple-700", // Más intenso
        textColor: "text-white",
      },
      {
        title: "Alertas Alma",
        count: cardData.alertas_alma.activos,
        stats: [
          { label: "Vencidos", value: cardData.alertas_alma.vencidos.toString() },
          { label: "Por vencer", value: cardData.alertas_alma.por_vencer.toString() },
          { label: "Totales", value: cardData.alertas_alma.totales.toString() },
        ],
        className: "bg-yellow-500", // Más intenso
        textColor: "text-white",
      },
    ]
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-2 sm:px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-gray-500">Cargando datos...</div>
          </div>
        </div>
      </AppLayout>
    )
  }

  const statCards = getStatCards()

  return (
    <AppLayout>
      <div className="container mx-auto px-2 sm:px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{schoolName}</h2>

        {/* Tarjetas de estadísticas */}
        {cardError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8">
            <p>{cardError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : (
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
        )}

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
          <ImportantDates title="Fechas importantes" />
          <RecentAlerts />
        </div>
      </div>
    </AppLayout>
  )
}
