"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecentAlertsSkeleton } from "./recent-alerts-skeleton"
import { type RecentAlert, fetchRecentAlerts } from "@/services/home-service"

export function RecentAlerts() {
  const [alerts, setAlerts] = useState<RecentAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getAlerts = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Intentar obtener datos de la API
        const data = await fetchRecentAlerts()
        setAlerts(data)
      } catch (error) {
        console.error("Error al cargar alertas recientes:", error)
        setError("No se pudieron cargar las alertas recientes")

        // Usar datos de ejemplo cuando la API no está disponible
        setAlerts([
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
              name: "Martín Soto",
              image: "/young-man-city.png",
            },
            alertType: "Alerta Alma",
            date: "Abr 01 - 2024",
          },
          {
            student: {
              name: "Javiera Rojas",
              image: "/confident-businessman.png",
            },
            alertType: "Denuncia",
            date: "Mar 30 - 2024",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    getAlerts()
  }, [])

  if (isLoading) {
    return <RecentAlertsSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src={alert.student.image || "/placeholder.svg"}
                  alt={alert.student.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{alert.student.name}</h4>
                <p className="text-xs text-gray-500">{alert.alertType}</p>
              </div>
              <div className="text-xs text-gray-500">{alert.date}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
