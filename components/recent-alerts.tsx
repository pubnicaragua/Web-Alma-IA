"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RecentAlertsSkeleton } from "./recent-alerts-skeleton"
import { type RecentAlert, fetchRecentAlerts } from "@/services/home-service"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "./pagination"

const PAGE_SIZE = 7 // numero de elementos por paginas


export function RecentAlerts() {
  const [alerts, setAlerts] = useState<RecentAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [dataPage, setDataPage] = useState<RecentAlert[]>([])

  useEffect(() => {
    const getAlerts = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Intentar obtener datos de la API
        const data = await fetchRecentAlerts()
        setAlerts(data)
        setDataPage(data.slice(0, PAGE_SIZE))
        setTotalPages(Math.ceil(data.length / PAGE_SIZE))
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

  // Limitar a mostrar solo los 5 elementos más recientes
  const limitedAlerts = alerts && alerts.length > 0 ? alerts.slice(0, 5) : []

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true, locale: es })
    } catch (error) {
      return "Fecha desconocida"
    }
  }

  // manejar paginacion
  const handlePageChange = (page: number) => {
    // console.log('HANDLEPAGECHANGE.......................',page)
    // console.log(alerts)
    setCurrentPage(page)
    const indexOfLastItem = page * PAGE_SIZE
    const indexOfFirstItem = indexOfLastItem - PAGE_SIZE
    // console.log('indexOfLastItem', indexOfLastItem)
    // console.log('indexOfFirstItem', indexOfFirstItem)
    const currentItems = alerts.slice(indexOfFirstItem, indexOfLastItem)
    console.log(currentItems)
    setDataPage(currentItems)
  }

  // Función para obtener el color de la prioridad
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
        <h1 className="rounded-md p-2 text-sm w-fit text-gray-500">Se visualizan los 10 últimos días</h1>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {dataPage.map((alert, index) => (
            <div key={alert.alumno_alerta_id || index}>
              <div className="flex items-center justify-between py-3">
                {/* Primera columna: Datos del alumno */}
                <div className="flex items-center gap-3 w-[45%]">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full flex-shrink-0">
                    <Image
                      src={alert.alumnos?.url_foto_perfil || "/diverse-students-studying.png"}
                      alt={`${alert.alumnos?.personas?.nombres || "Estudiante"}`}
                      fill
                      className="object-cover"
                    />
                  </div>
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

                {/* Segunda columna: Prioridad */}
                <div className="w-[25%] flex justify-center">
                  <Badge className={`text-xs text-white ${getPriorityColor(alert.alertas_prioridades?.nombre)}`}>
                    {alert.alertas_prioridades?.nombre || "Sin prioridad"}
                  </Badge>
                </div>

                {/* Tercera columna: Fecha */}
                <div className="text-xs text-gray-500 text-right w-[30%]">{formatDate(alert.fecha_generada)}</div>
              </div>
              {index < limitedAlerts.length - 1 && <div className="border-t border-gray-100"></div>}
            </div>
          ))}

          {limitedAlerts.length === 0 && <div className="py-4 text-center text-gray-500">No hay alertas recientes</div>}
        </div>
        <CardFooter>
          <div className="mt-6 flex justify-center">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>


        </CardFooter>
      </CardContent>
    </Card>
  )
}
