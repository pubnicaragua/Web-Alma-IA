"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecentAlertsSkeleton } from "./recent-alerts-skeleton"
import { type RecentAlert, fetchRecentAlerts } from "@/services/home-service"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation" // <-- correcto para App Router

export function RecentAlerts() {
  const [alerts, setAlerts] = useState<RecentAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    const getAlerts = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const data = await fetchRecentAlerts()
        setAlerts(data)
      } catch (error) {
        console.error("Error al cargar alertas recientes:", error)
        setError("No se pudieron cargar las alertas recientes")
      } finally {
        setIsLoading(false)
      }
    }

    getAlerts()
  }, [])

  if (isLoading) {
    return <RecentAlertsSkeleton />
  }

  const limitedAlerts = alerts.slice(0, 5)

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true, locale: es })
    } catch (error) {
      return "Fecha desconocida"
    }
  }

  const handleAlertClick = (alertId: number) => {
    router.push(`/alertas/${alertId}`)
  }

  const getPriorityColor = (priority: string | undefined) => {
    if (!priority) return "bg-gray-200"
    switch (priority.toLowerCase()) {
      case "alta":
        return "bg-red-500 hover:bg-red-600"
      case "media":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "baja":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-gray-200 hover:bg-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {limitedAlerts.map((alert, index) => (
            <div key={alert.alumno_alerta_id || index} onClick={() => handleAlertClick(alert.alumno_alerta_id)}>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3 w-[45%]">
                  {isClient && (
                    <div className="relative h-10 w-10 overflow-hidden rounded-full flex-shrink-0">
                      <Image
                        src={alert.alumnos?.url_foto_perfil || "/diverse-students-studying.png"}
                        alt={`${alert.alumnos?.personas?.nombres || "Estudiante"}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium truncate">
                      {alert.alumnos?.personas
                        ? `${alert.alumnos.personas.nombres} ${alert.alumnos.personas.apellidos}`
                        : "Estudiante"}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">
                      {alert.alertas_tipos?.nombre || "Alerta"}
                      {alert.alertas_origenes?.nombre && ` - ${alert.alertas_origenes.nombre}`}
                    </p>
                  </div>
                </div>

                <div className="w-[25%] flex justify-center">
                  <Badge className={`text-xs text-white ${getPriorityColor(alert.alertas_prioridades?.nombre)}`}>
                    {alert.alertas_prioridades?.nombre || "Sin prioridad"}
                  </Badge>
                </div>

                <div className="text-xs text-gray-500 text-right w-[30%]">
                  {isClient ? formatDate(alert.fecha_generada) : ""}
                </div>
              </div>
              {index < limitedAlerts.length - 1 && <div className="border-t border-gray-100"></div>}
            </div>
          ))}

          {limitedAlerts.length === 0 && (
            <div className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-100 text-lg font-medium text-center py-6 px-4 rounded-md">
              No hay alertas recientes disponibles.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
