"use client"

import { useState, useEffect } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchImportantDates, type ImportantDate } from "@/services/home-service"
import { useToast } from "@/hooks/use-toast"
import { ImportantDatesSkeleton } from "./important-dates-skeleton"

// Datos de ejemplo para usar cuando la API no está disponible
const FALLBACK_DATA: ImportantDate[] = [
  {
    event: "Reunión de Apoderados",
    dateRange: "May 15 - 2024",
  },
  {
    event: "Feriado Nacional",
    dateRange: "May 21 - 2024",
  },
  {
    event: "Semana de Evaluaciones",
    dateRange: "Jun 05 - Jun 09, 2024",
  },
  {
    event: "Vacaciones de Invierno",
    dateRange: "Jul 10 - Jul 25, 2024",
  },
  {
    event: "Día del Profesor",
    dateRange: "Oct 16 - 2024",
  },
  {
    event: "Fiestas Patrias",
    dateRange: "Sep 18 - Sep 19, 2024",
  },
  {
    event: "Ceremonia de Graduación",
    dateRange: "Dic 15 - 2024",
  },
]

interface ImportantDatesProps {
  title?: string
  initialData?: ImportantDate[]
}

export function ImportantDates({ title = "Fechas importantes", initialData }: ImportantDatesProps) {
  const [dates, setDates] = useState<ImportantDate[]>(initialData || [])
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)
  const [useFallback, setUseFallback] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!initialData) {
      loadDates()
    }
  }, [initialData])

  const loadDates = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setUseFallback(false)

      try {
        const data = await fetchImportantDates()
        setDates(data)
        console.log("Fechas importantes cargadas correctamente:", data)
      } catch (err) {
        console.error("Error al cargar fechas importantes desde la API:", err)

        // Usar datos de ejemplo en caso de error
        console.log("Usando datos de ejemplo para fechas importantes")
        setDates(FALLBACK_DATA)
        setUseFallback(true)

        // Mostrar notificación de advertencia
        toast({
          title: "Usando datos de ejemplo",
          description: "No se pudieron cargar las fechas importantes desde el servidor. Mostrando datos de ejemplo.",
          variant: "warning",
        })
      }
    } catch (err) {
      console.error("Error crítico al cargar fechas importantes:", err)
      setError("No se pudieron cargar las fechas importantes. Intente nuevamente.")

      // Mostrar notificación de error
      toast({
        title: "Error al cargar datos",
        description: "No se pudieron cargar las fechas importantes. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Renderizar esqueleto durante la carga
  if (isLoading) {
    return <ImportantDatesSkeleton />
  }

  // Renderizar mensaje de error
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={loadDates}
              className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Reintentar
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Renderizar mensaje si no hay fechas
  if (!dates || dates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-500 text-center py-10">No hay fechas importantes disponibles.</div>
        </CardContent>
      </Card>
    )
  }

  // Limitar a mostrar solo los 7 elementos más recientes
  const limitedDates = dates.slice(0, 7)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {limitedDates.map((date, index) => (
            <div key={index}>
              <div className="flex justify-between py-3">
                <span className="font-medium text-gray-800">{date.event}</span>
                <span className="text-sm text-gray-500">{date.dateRange}</span>
              </div>
              {index < limitedDates.length - 1 && <div className="border-t border-gray-100"></div>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
