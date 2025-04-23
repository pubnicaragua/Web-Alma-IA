"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { FilterDropdown } from "@/components/filter-dropdown"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"

interface Alert {
  id: string
  student: {
    name: string
    image?: string
  }
  type: string
  priority: string
  classroom: string
  status: string
  responsible: string
  date: string
  time: string
}

export default function AlertsPage() {
  const router = useRouter()

  // Datos de ejemplo para las alertas
  const alertsData: Alert[] = [
    {
      id: "1",
      student: {
        name: "Carolina Espina",
        image: "/smiling-woman-garden.png",
      },
      type: "SOS Alma",
      priority: "Alta",
      classroom: "3°C",
      status: "Pendiente",
      responsible: "Enc. Convivencia",
      date: "08/04/2025",
      time: "8:02 AM",
    },
    {
      id: "2",
      student: {
        name: "Jorge Mendez",
        image: "/young-man-city.png",
      },
      type: "Amarilla",
      priority: "Med.",
      classroom: "7°A",
      status: "En curso",
      responsible: "Psic. Escolar",
      date: "08/04/2025",
      time: "8:10 AM",
    },
    {
      id: "3",
      student: {
        name: "Bruno Garay",
        image: "/young-man-city.png",
      },
      type: "Denuncia",
      priority: "Alta",
      classroom: "5°C",
      status: "Resuelta",
      responsible: "Dir. Académico",
      date: "07/04/2025",
      time: "9:15 AM",
    },
    {
      id: "4",
      student: {
        name: "Carolina Espina",
        image: "/smiling-woman-garden.png",
      },
      type: "Naranja",
      priority: "Alta",
      classroom: "2°B",
      status: "En curso",
      responsible: "Prof. J. Rivera",
      date: "07/04/2025",
      time: "7:15 AM",
    },
    {
      id: "5",
      student: {
        name: "Matías Ignacio Díaz",
        image: "/young-man-city.png",
      },
      type: "SOS Alma",
      priority: "Alta",
      classroom: "4°A",
      status: "Pendiente",
      responsible: "Enc. Convivencia",
      date: "06/04/2025",
      time: "10:45 AM",
    },
    {
      id: "6",
      student: {
        name: "Teresa Ulloa",
        image: "/smiling-woman-garden.png",
      },
      type: "Amarilla",
      priority: "Baja",
      classroom: "5°A",
      status: "Resuelta",
      responsible: "Prof. M. Soto",
      date: "05/04/2025",
      time: "2:30 PM",
    },
  ]

  // Estados para los filtros
  const [typeFilter, setTypeFilter] = useState<string>("Todos")
  const [priorityFilter, setPriorityFilter] = useState<string>("Todos")
  const [classroomFilter, setClassroomFilter] = useState<string>("Todos")
  const [statusFilter, setStatusFilter] = useState<string>("Todos")
  const [responsibleFilter, setResponsibleFilter] = useState<string>("Todos")
  const [dateFilter, setDateFilter] = useState<string>("Todos")

  // Opciones para los filtros
  const typeOptions = ["Todos", "SOS Alma", "Amarilla", "Naranja", "Denuncia"]
  const priorityOptions = ["Todos", "Alta", "Med.", "Baja"]
  const classroomOptions = ["Todos", "2°B", "3°C", "4°A", "5°A", "5°C", "7°A"]
  const statusOptions = ["Todos", "Pendiente", "En curso", "Resuelta"]
  const responsibleOptions = [
    "Todos",
    "Enc. Convivencia",
    "Psic. Escolar",
    "Dir. Académico",
    "Prof. J. Rivera",
    "Prof. M. Soto",
  ]
  const dateOptions = ["Todos", "Hoy", "Ayer", "Esta semana", "Este mes"]

  // Filtrar los datos según los filtros seleccionados
  const filteredAlerts = alertsData.filter((alert) => {
    return (
      (typeFilter === "Todos" || alert.type === typeFilter) &&
      (priorityFilter === "Todos" || alert.priority === priorityFilter) &&
      (classroomFilter === "Todos" || alert.classroom === classroomFilter) &&
      (statusFilter === "Todos" || alert.status === statusFilter) &&
      (responsibleFilter === "Todos" || alert.responsible === responsibleFilter) &&
      (dateFilter === "Todos" ||
        (dateFilter === "Hoy" && alert.date === "08/04/2025") ||
        (dateFilter === "Ayer" && alert.date === "07/04/2025"))
    )
  })

  // Columnas para la tabla
  const columns = [
    { key: "student", title: "Alumno" },
    { key: "type", title: "Tipo de Alerta" },
    { key: "priority", title: "Prioridad" },
    { key: "classroom", title: "Aula" },
    { key: "status", title: "Estado" },
    { key: "responsible", title: "Responsable" },
    { key: "date", title: "Fecha" },
    { key: "time", title: "Hora" },
  ]

  // Función para navegar a la vista detallada de la alerta
  const handleAlertClick = (alert: Alert) => {
    router.push(`/alertas/${alert.id}`)
  }

  // Renderizar celdas de la tabla
  const renderCell = (alert: Alert, column: { key: string; title: string }) => {
    switch (column.key) {
      case "student":
        return (
          <div
            className="flex items-center space-x-3 cursor-pointer hover:text-blue-500"
            onClick={() => handleAlertClick(alert)}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={alert.student.image || "/placeholder.svg"}
                alt={alert.student.name}
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <span>{alert.student.name}</span>
          </div>
        )
      case "type":
        return (
          <Badge
            className={
              alert.type === "SOS Alma"
                ? "bg-red-500"
                : alert.type === "Amarilla"
                  ? "bg-yellow-400"
                  : alert.type === "Naranja"
                    ? "bg-orange-500"
                    : alert.type === "Denuncia"
                      ? "bg-purple-600"
                      : ""
            }
          >
            {alert.type}
          </Badge>
        )
      case "priority":
        return (
          <Badge
            variant="outline"
            className={
              alert.priority === "Alta"
                ? "border-red-500 text-red-500"
                : alert.priority === "Med."
                  ? "border-yellow-500 text-yellow-500"
                  : "border-green-500 text-green-500"
            }
          >
            {alert.priority}
          </Badge>
        )
      case "status":
        return (
          <Badge
            variant="outline"
            className={
              alert.status === "Pendiente"
                ? "border-red-500 text-red-500"
                : alert.status === "En curso"
                  ? "border-blue-500 text-blue-500"
                  : "border-green-500 text-green-500"
            }
          >
            {alert.status}
          </Badge>
        )
      default:
        return alert[column.key as keyof Alert]
    }
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Alertas</h2>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <FilterDropdown label="Tipo" options={typeOptions} value={typeFilter} onChange={setTypeFilter} />
          <FilterDropdown
            label="Prioridad"
            options={priorityOptions}
            value={priorityFilter}
            onChange={setPriorityFilter}
          />
          <FilterDropdown
            label="Aula"
            options={classroomOptions}
            value={classroomFilter}
            onChange={setClassroomFilter}
          />
          <FilterDropdown label="Estado" options={statusOptions} value={statusFilter} onChange={setStatusFilter} />
          <FilterDropdown
            label="Responsable"
            options={responsibleOptions}
            value={responsibleFilter}
            onChange={setResponsibleFilter}
          />
          <FilterDropdown label="Fecha" options={dateOptions} value={dateFilter} onChange={setDateFilter} />
        </div>

        {/* Tabla de alertas */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <DataTable columns={columns} data={filteredAlerts} renderCell={renderCell} />
        </div>
      </div>
    </AppLayout>
  )
}
