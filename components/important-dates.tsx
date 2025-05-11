"use client"

import { useState, useEffect } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
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
]

interface ImportantDatesProps {
  title: string
  initialData?: ImportantDate[]
}

export function ImportantDates({ title, initialData }: ImportantDatesProps) {
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
      <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-red-200">
        <div className="flex items-center mb-4">
          <AlertCircle className="mr-2 text-red-500" />
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={loadDates}
          className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Reintentar
        </button>
      </div>
    )
  }

  // Renderizar mensaje si no hay fechas
  if (!dates || dates.length === 0) {
    return (
      <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-blue-200">
        <h3 className="font-medium text-gray-800 mb-4">{title}</h3>
        <div className="text-gray-500 text-center py-10">No hay fechas importantes disponibles.</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-800">{title}</h3>
        {useFallback && (
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Datos de ejemplo</span>
        )}
      </div>
      <div className="space-y-4">
        {dates.map((date, index) => (
          <div key={index} className="flex justify-between">
            <span className="font-medium text-gray-800">{date.event}</span>
            <span className="text-sm text-gray-500">{date.dateRange}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
