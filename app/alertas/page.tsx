"use client"

import { DataTable } from "@/components/data-table(2)"
import { FilterDropdown } from "@/components/filter-dropdown"
import { AppLayout } from "@/components/layout/app-layout"
import { Badge } from "@/components/ui/badge"
import { type Alert, fetchAlerts } from "@/services/alerts-service"
import { AlertCircle, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AlertsPage() {
  const router = useRouter()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados para los filtros
  const [typeFilter, setTypeFilter] = useState<string>("Todos")
  const [priorityFilter, setPriorityFilter] = useState<string>("Todos")
  const [classroomFilter, setClassroomFilter] = useState<string>("Todos")
  const [statusFilter, setStatusFilter] = useState<string>("Todos")
  const [responsibleFilter, setResponsibleFilter] = useState<string>("Todos")
  const [dateFilter, setDateFilter] = useState<string>("Todos")

  // Cargar datos solo cuando se accede a la página
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchAlerts()
        setAlerts(data)
      } catch (err) {
        console.error("Error al cargar alertas:", err)
        setError("No se pudieron cargar las alertas. Intente nuevamente.")
      } finally {
        setIsLoading(false)
      }
    }

    loadAlerts()
  }, [])

  // Generar opciones para los filtros basadas en los datos
  const getUniqueValues = (key: keyof Alert | ((alert: Alert) => string)): string[] => {
    const getValue = typeof key === "function" ? key : (alert: Alert) => alert[key] as string
    const uniqueValues = new Set(alerts.map(getValue))
    return ["Todos", ...Array.from(uniqueValues)]
  }

  const typeOptions = getUniqueValues("type")
  const priorityOptions = getUniqueValues("priority")
  const classroomOptions = getUniqueValues("classroom")
  const statusOptions = getUniqueValues("status")
  const responsibleOptions = getUniqueValues("responsible")
  const dateOptions = ["Todos", "Hoy", "Ayer", "Esta semana", "Este mes"]

  // Filtrar los datos según los filtros seleccionados
  const filteredAlerts = alerts.filter((alert) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const alertDate = new Date(alert.date.split("/").reverse().join("-"))

    const isToday = alertDate.toDateString() === today.toDateString()
    const isYesterday = alertDate.toDateString() === yesterday.toDateString()

    const isThisWeek = (() => {
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      return alertDate >= startOfWeek && alertDate <= endOfWeek
    })()

    const isThisMonth = alertDate.getMonth() === today.getMonth() && alertDate.getFullYear() === today.getFullYear()

    return (
      (typeFilter === "Todos" || alert.type === typeFilter) &&
      (priorityFilter === "Todos" || alert.priority === priorityFilter) &&
      (classroomFilter === "Todos" || alert.classroom === classroomFilter) &&
      (statusFilter === "Todos" || alert.status === statusFilter) &&
      (responsibleFilter === "Todos" || alert.responsible === responsibleFilter) &&
      (dateFilter === "Todos" ||
        (dateFilter === "Hoy" && isToday) ||
        (dateFilter === "Ayer" && isYesterday) ||
        (dateFilter === "Esta semana" && isThisWeek) ||
        (dateFilter === "Este mes" && isThisMonth))
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
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={alert.student?.avatar || "/placeholder.svg"}
                alt={alert.student?.name || 'image'}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <span>{alert?.student?.name}</span>
          </div>
        )
      case "type":
        return (
          <div className="flex justify-center w-full">
            <Badge
              className={`whitespace-nowrap px-3 py-1 text-center ${
                alert.type === "SOS Alma" || alert.type === "Rendimiento Académico"
                  ? "bg-red-500"
                  : alert.type === "Amarilla" || alert.type === "Asistencia"
                    ? "bg-yellow-400"
                    : alert.type === "Naranja" || alert.type === "Comportamiento"
                      ? "bg-orange-500"
                      : alert.type === "Denuncia"
                        ? "bg-purple-600"
                        : "bg-blue-500"
              }`}
            >
              {alert.type}
            </Badge>
          </div>
        )
      case "priority":
        return (
          <div className="flex justify-center w-full">
            <Badge
              variant="outline"
              className={`whitespace-nowrap px-3 py-1 text-center ${
                alert.priority === "Alta"
                  ? "border-red-500 text-red-500"
                  : alert.priority === "Media"
                    ? "border-yellow-500 text-yellow-500"
                    : "border-green-500 text-green-500"
              }`}
              style={{ borderColor: alert.priorityColor, color: alert.priorityColor }}
            >
              {alert.priority}
            </Badge>
          </div>
        )
      case "status":
        return (
          <div className="flex justify-center w-full">
            <Badge
              variant="outline"
              className={`whitespace-nowrap px-3 py-1 text-center ${
                alert.status === "Pendiente"
                  ? "border-red-500 text-red-500"
                  : alert.status === "En curso"
                    ? "border-blue-500 text-blue-500"
                    : "border-green-500 text-green-500"
              }`}
            >
              {alert.status}
            </Badge>
          </div>
        )
      default:
        return <div className="text-center">{alert[column.key as keyof Alert]}</div>
    }
  }

  // Renderizar mensaje de carga
  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-2 sm:px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Alertas</h2>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando alertas...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  // Renderizar mensaje de error
  if (error) {
    return (
      <AppLayout>
        <div className="container mx-auto px-2 sm:px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Alertas</h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-center mb-4 text-red-500">
              <AlertCircle className="w-8 h-8 mr-2" />
              <h3 className="text-xl font-medium">Error</h3>
            </div>
            <p className="text-gray-600 text-center mb-6">{error}</p>
            <div className="flex justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Reintentar
              </button>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-2 sm:px-6 py-8">
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
          {filteredAlerts.length > 0 ? (
            <DataTable columns={columns} data={filteredAlerts} renderCell={renderCell} />
          ) : (
            <div className="p-8 text-center text-gray-500">
              No se encontraron alertas que coincidan con los filtros seleccionados.
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
