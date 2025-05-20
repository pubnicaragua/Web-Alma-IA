"use client"

import { AddActionModal } from "@/components/alert/add-action-modal"
import { AlertDetailSkeleton } from "@/components/alert/alert-detail-skeleton"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useIsMobile } from "@/hooks/use-mobile"
import { fetchAlertById } from "@/services/alerts-service"
import { ArrowLeft, Lock } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

interface Action {
  fecha: string
  hora: string
  usuarioResponsable: string
  accionRealizada: string
  fechaCompromiso: string
  observaciones: string
}

export interface Alert {
  id: string
  student: {
    name: string
    course: string
    image: string
  }
  generationDate: string
  generationTime: string
  responsible: {
    name: string
    role: string
    image: string
  }
  isAnonymous: boolean
  description: string
  actions: Action[]
}

// Datos de ejemplo
const mockAlert: Alert = {
  id: '10000',
  student: {
    name: "Matías Ignacio Díaz",
    course: "7°A",
    image: "/young-man-city.png",
  },
  generationDate: "08/04/2025",
  generationTime: "08:10",
  responsible: {
    name: "Marcela Vidal",
    role: "Psicóloga Escolar",
    image: "/smiling-woman-garden.png",
  },
  isAnonymous: false,
  description:
    "El alumno indicó sentir enojo persistente durante su ingreso los últimos 3 días consecutivos. Señaló además una situación de conflicto no resuelta con un compañero de curso.",
  actions: [
    {
      fecha: "08/04/2025",
      hora: "08:12 AM",
      usuarioResponsable: "Prof. J. Rivera",
      accionRealizada: "Derivación a psicóloga escolar",
      fechaCompromiso: "09/04/2025",
      observaciones: "Se solicitó seguimiento a psicóloga",
    },
    {
      fecha: "08/04/2025",
      hora: "10:00 AM",
      usuarioResponsable: "Psic. Marcela Vidal",
      accionRealizada: "Primera revisión de alerta",
      fechaCompromiso: "10/04/2025",
      observaciones: "Agendada sesión para el día siguiente",
    },
    {
      fecha: "09/04/2025",
      hora: "08:45 AM",
      usuarioResponsable: "Psic. Marcela Vidal",
      accionRealizada: "Confirmación de asistencia a sesión",
      fechaCompromiso: "-",
      observaciones: "Alumno asistirá a las 10:30",
    },
    {
      fecha: "10/04/2025",
      hora: "11:30 AM",
      usuarioResponsable: "Psic. Marcela Vidal",
      accionRealizada: "Sesión realizada",
      fechaCompromiso: "-",
      observaciones: "Se acordó realizar seguimiento semanal",
    },
  ],
}

export default function AlertDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [alert, setAlert] = useState<Alert | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isMobile = useIsMobile()

  const loadAlert = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchAlertById(id)
      setAlert(data)
    } catch (err) {
      console.error("Error al cargar alertas:", err)
      setError((err as Error).message || 'error en la petición intente más tarde')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadAlert(id as string)
  }, [loadAlert])

  const handleAddAction = (newAction: {
    accionRealizada: string
    fechaCompromiso: string
    observaciones: string
  }) => {
    if (!alert) return

    const currentDate = new Date()
    const formattedDate = `${currentDate.getDate().toString().padStart(2, "0")}/${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${currentDate.getFullYear()}`
    const formattedTime = `${currentDate.getHours().toString().padStart(2, "0")}:${currentDate
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${currentDate.getHours() >= 12 ? "PM" : "AM"}`

    const action: Action = {
      fecha: formattedDate,
      hora: formattedTime,
      usuarioResponsable: "Psic. Marcela Vidal", // En un caso real, sería el usuario actual
      accionRealizada: newAction.accionRealizada,
      fechaCompromiso: newAction.fechaCompromiso || "-",
      observaciones: newAction.observaciones || "-",
    }

    setAlert({
      ...alert,
      actions: [...alert.actions, action],
    })
  }

  const handleGoBack = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <AppLayout>
        <AlertDetailSkeleton />
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-500">{error}</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (<>
    {alert ? <AppLayout>
      <div className="container mx-auto px-3 sm:px-6 py-8">
        {/* Botón Volver */}
        <div className="mb-6">
          <Button variant="outline" size="sm" onClick={handleGoBack} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>

        {/* Card de información del alumno */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Información del Alumno</CardTitle>
          </CardHeader>
          <CardContent>
            {alert.student && (
              <div className="flex items-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden mr-6 flex-shrink-0">
                  <Image
                    src={alert.student.image || "/placeholder.svg"}
                    alt={alert.student.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{alert.student.name}</h1>
                  <p className="text-xl text-gray-600">{alert.student.course}</p>
                  <p className="text-sm text-gray-500">
                    Fecha de generación: {alert.generationDate} - {alert.generationTime}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card de detalles de la alerta */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Detalles de la Alerta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Responsable actual */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Responsable Actual:</h3>
              <div className="flex items-center">
                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                  <Image
                    src={alert.responsible.image || "/placeholder.svg"}
                    alt={alert.responsible.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <span className="text-gray-700">
                  {alert.responsible.role} - {alert.responsible.name}
                </span>
              </div>
              {!alert.isAnonymous && (
                <div className="flex items-center mt-2 text-gray-600">
                  <Lock className="h-4 w-4 mr-1" />
                  <span className="text-sm">No es anónimo</span>
                </div>
              )}
            </div>

            {/* Descripción de la alerta */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Descripción de la alerta</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{alert.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Bitácora de acciones */}
        <Card className="mb-6">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Bitácora de acciones</CardTitle>
            <AddActionModal onAddAction={handleAddAction} isMobile={isMobile} />
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="bg-blue-300">
                    <th className="px-4 py-3 text-left font-medium text-white">Fecha</th>
                    <th className="px-4 py-3 text-left font-medium text-white">Hora</th>
                    <th className="px-4 py-3 text-left font-medium text-white">Usuario Responsable</th>
                    <th className="px-4 py-3 text-left font-medium text-white">Acción Realizada</th>
                    <th className="px-4 py-3 text-left font-medium text-white">Fecha de Compromiso</th>
                    <th className="px-4 py-3 text-left font-medium text-white">Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {alert.actions.map((action, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{action.fecha}</td>
                      <td className="px-4 py-3 text-sm">{action.hora}</td>
                      <td className="px-4 py-3 text-sm">{action.usuarioResponsable}</td>
                      <td className="px-4 py-3 text-sm">{action.accionRealizada}</td>
                      <td className="px-4 py-3 text-sm">{action.fechaCompromiso}</td>
                      <td className="px-4 py-3 text-sm">{action.observaciones}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout> : null}
  </>)
}
