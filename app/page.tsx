"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { StatCard } from "@/components/stat-card"
import { StatCardSkeleton } from "@/components/stat-card-skeleton"
import { BarChartComparison } from "@/components/bar-chart-comparison"
import { BarChartSkeleton } from "@/components/bar-chart-skeleton"
import { DonutChart } from "@/components/donut-chart"
import { DonutChartSkeleton } from "@/components/donut-chart-skeleton"
import { ImportantDates } from "@/components/important-dates"
import { ImportantDatesSkeleton } from "@/components/important-dates-skeleton"
import { RecentAlerts } from "@/components/recent-alerts"
import { RecentAlertsSkeleton } from "@/components/recent-alerts-skeleton"
import { isAuthenticated, removeAuthToken, fetchWithAuth } from "@/lib/api-config"
import { type CardData, fetchCardData } from "@/services/home-service"
import { useToast } from "@/hooks/use-toast"
import { getSchoolById } from "@/services/school-service"

export default function Home() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [cardData, setCardData] = useState<CardData | null>(null)
  const [cardError, setCardError] = useState<string | null>(null)
  const [tokenExpired, setTokenExpired] = useState(false)
  const [schoolName, setSchoolName] = useState("")
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

  // Función para manejar token expirado
  const handleTokenExpired = () => {
    setTokenExpired(true)
    removeAuthToken()
    toast({
      title: "Sesión expirada",
      description: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
      variant: "destructive",
    })
    // Redirigir después de un breve retraso para que el usuario pueda ver la notificación
    setTimeout(() => {
      router.push("/login")
    }, 2000)
  }

  useEffect(() => {
    console.log("Home: Inicializando página principal")

    // Verificar autenticación
    if (!isAuthenticated()) {
      console.log("Home: Usuario no autenticado, redirigiendo a /login")
      router.push("/login")
      return
    }

    // Verificar si hay un colegio seleccionado
    const loadSchool = async()=>{
      const selectedSchool = localStorage.getItem("selectedSchool")
      console.log("Home: Colegio seleccionado:", selectedSchool)
    if (!selectedSchool) {
      console.log("Home: No hay colegio seleccionado, redirigiendo a /select-school")
      router.push("/select-school")
      return
    }

    // cargar colegio seleccionado
    const school = await getSchoolById(selectedSchool)
    if (school) {
      setSchoolName(school.name)
    }
    else {
      console.log("Home: No se encontró el colegio seleccionado")
      router.push("/select-school")
      return
    }

    }
    // Cargar datos de las tarjetas
    const loadCardData = async () => {
      try {
        setCardError(null)
        const data = await fetchCardData()
        setCardData(data)
      } catch (error: any) {
        console.error("Error al cargar datos de tarjetas:", error)
        // Verificar si el error es por token expirado (401 Unauthorized)
        if (error.status === 401 || error.message?.includes("401") || error.message?.includes("unauthorized")) {
          handleTokenExpired()
          return
        }
        setCardError("No se pudieron cargar los datos de las tarjetas")
        toast({
          title: "Error al cargar datos",
          description: "No se pudieron cargar los datos de las tarjetas. Por favor, intente de nuevo.",
          variant: "destructive",
        })
      } finally {
        if (!tokenExpired) {
          setIsLoading(false)
        }
      }
    }

    loadSchool()
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

  // Renderizar skeletons durante la carga
  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-2 sm:px-6 py-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          {/* Skeleton para tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
          {/* Skeleton para Media emocional General */}
          <div className="mb-8">
            <BarChartSkeleton />
          </div>
          {/* Skeletons para gráficos y datos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <BarChartSkeleton />
            <DonutChartSkeleton />
          </div>
          {/* Skeletons para fechas importantes y alertas recientes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ImportantDatesSkeleton />
            <RecentAlertsSkeleton />
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