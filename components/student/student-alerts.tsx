"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { AddAlertModal } from "@/components/student/add-alert-modal"
import { DataTable } from "@/components/data-table"

interface Alert {
  fecha: string
  hora: string
  tipo: string
  estado: string
  prioridad: string
  responsable: string
}

interface StudentAlertsProps {
  alerts: Alert[]
}

export function StudentAlerts({ alerts: initialAlerts }: StudentAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)

  const columns = [
    { key: 'fecha', title: 'Fecha', className: 'text-center' },
    { key: 'hora', title: 'Hora', className: 'text-center' },
    { key: 'tipo', title: 'Tipo de alerta', className: 'text-center' },
    { key: 'estado', title: 'Estado', className: 'text-center' },
    { key: 'prioridad', title: 'Nivel de prioridad', className: 'text-center' },
    { key: 'responsable', title: 'Responsable actual', className: 'text-center' },
  ]

  const renderCell = (alert: Alert, column: { key: string; title: string }) => {
    switch (column.key) {
      case 'tipo':
        return (
          <div className="flex justify-center">
            <Badge
              className={
                alert.tipo === "SOS Alma"
                  ? "bg-red-500"
                  : alert.tipo === "Alerta amarilla"
                    ? "bg-yellow-400"
                    : alert.tipo === "Alerta Naranja"
                      ? "bg-orange-500"
                      : alert.tipo === "Denuncia"
                        ? "bg-purple-600"
                        : ""
              }
            >
              {alert.tipo}
            </Badge>
          </div>
        )
      case 'estado':
        return (
          <Badge
            variant="outline"
            className={
              alert.estado === "Pendiente"
                ? "border-red-500 text-red-500"
                : alert.estado === "En curso"
                  ? "border-blue-500 text-blue-500"
                  : "border-green-500 text-green-500"
            }
          >
            {alert.estado}
          </Badge>
        )
      case 'prioridad':
        return (
          <Badge
            variant="outline"
            className={
              alert.prioridad === "Alta"
                ? "border-red-500 text-red-500"
                : alert.prioridad === "Media"
                  ? "border-yellow-500 text-yellow-500"
                  : "border-green-500 text-green-500"
            }
          >
            {alert.prioridad}
          </Badge>
        )
      default:
        return <span className="text-sm">{alert[column.key as keyof Alert] as string}</span>
    }
  }

  const handleAddAlert = (newAlert: { tipo: string; descripcion: string; fecha: string }) => {
    const currentDate = new Date()
    const hora = `${currentDate.getHours().toString().padStart(2, "0")}:${currentDate.getMinutes().toString().padStart(2, "0")} ${currentDate.getHours() >= 12 ? "PM" : "AM"}`

    const alert: Alert = {
      fecha: newAlert.fecha,
      hora: hora,
      tipo: newAlert.tipo,
      estado: "Pendiente",
      prioridad: "Alta",
      responsable: "Enc. Convivencia",
    }

    setAlerts([alert, ...alerts])
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Alertas del alumno</h3>
        <AddAlertModal onAddAlert={handleAddAlert} />
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto border border-gray-100">
        <DataTable
          columns={columns}
          pageSize={25}
          data={alerts}
          renderCell={renderCell}
          className="min-w-[640px]"
        />
      </div>
    </div>
  )
}
