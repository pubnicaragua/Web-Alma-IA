"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { type RecentAlert, fetchRecentAlerts } from "@/services/home-service"

interface RecentAlertsProps {
  initialAlerts?: RecentAlert[]
}

export function RecentAlerts({ initialAlerts }: RecentAlertsProps) {
  const [alerts, setAlerts] = useState<RecentAlert[]>(initialAlerts || [])
  const [isLoading, setIsLoading] = useState(!initialAlerts)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Verificar si hay un token disponible
        const token = localStorage.getItem("auth_token")
        if (!token) {
          console.warn("No hay token de autenticación disponible para obtener alertas recientes")
        }

        const data = await fetchRecentAlerts()
        setAlerts(data)
      } catch (err) {
        console.error("Error loading recent alerts:", err)
        setError("No se pudieron cargar las alertas recientes")
      } finally {
        setIsLoading(false)
      }
    }

    // Si no tenemos alertas iniciales, cargarlas desde la API
    if (!initialAlerts) {
      loadAlerts()
    }
  }, [initialAlerts])

  return (
    <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-blue-200">
      <h3 className="font-medium text-gray-800 mb-2">Alertas recientes</h3>
      <p className="text-sm text-gray-500 mb-6">
        {alerts.length > 0 ? `${alerts.length} nuevas alertas este último mes` : "No hay alertas recientes"}
      </p>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 animate-pulse"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-500">{error}</div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200">
                  <Image
                    src={alert.student.image || "/placeholder.svg"}
                    alt={alert.student.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium">{alert.student.name}</span>
              </div>

              <span
                className={cn(
                  "text-sm font-semibold px-2.5 py-1 rounded-full",
                  alert.alertType === "SOS Alma"
                    ? "bg-red-100 text-red-700"
                    : alert.alertType === "Denuncias"
                      ? "bg-purple-100 text-purple-700"
                      : alert.alertType === "IA"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700",
                )}
              >
                {alert.alertType}
              </span>

              <span className="text-sm text-gray-500">{alert.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
