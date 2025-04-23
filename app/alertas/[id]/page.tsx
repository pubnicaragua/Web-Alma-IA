"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { AppLayout } from "@/components/layout/app-layout"
import { AddActionModal } from "@/components/alert/add-action-modal"
import { Lock } from "lucide-react"

interface Action {
  fecha: string
  hora: string
  usuarioResponsable: string
  accionRealizada: string
  fechaCompromiso: string
  observaciones: string
}

interface Alert {
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

export default function AlertDetailPage() {
  const { id } = useParams()
  const [alert, setAlert] = useState<Alert | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulación de carga de datos de la alerta
    const fetchAlert = async () => {
      // En un caso real, aquí se haría una petición a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Datos de ejemplo
      const mockAlert: Alert = {
        id: id as string,
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

      setAlert(mockAlert)
      setIsLoading(false)
    }

    fetchAlert()
  }, [id])

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

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-500">Cargando información de la alerta...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!alert) {
    return (
      <AppLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-500">No se encontró información de la alerta</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Información del alumno */}
        {alert.student && (
          <div className="flex items-center mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden mr-6">
              <Image
                src={alert.student.image || "/placeholder.svg"}
                alt={alert.student.name}
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{alert.student.name}</h1>
              <p className="text-xl text-gray-600">{alert.student.course}</p>
              <p className="text-sm text-gray-500">
                Fecha de generación: {alert.generationDate} - {alert.generationTime}
              </p>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Alerta del alumno</h2>

        {/* Responsable actual */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Responsable Actual:</h3>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
              <Image
                src={alert.responsible.image || "/placeholder.svg"}
                alt={alert.responsible.name}
                width={40}
                height={40}
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
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Descripción de la alerta</h3>
          <p className="text-gray-700">{alert.description}</p>
        </div>

        {/* Bitácora de acciones */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Bitácora de acciones</h3>
            <AddActionModal onAddAction={handleAddAction} />
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full">
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
        </div>
      </div>
    </AppLayout>
  )
}
