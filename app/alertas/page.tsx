"use client"

import { DataTable } from "@/components/data-table"
import { FilterDropdown } from "@/components/filter-dropdown"
import { AppLayout } from "@/components/layout/app-layout"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { AlertCircle, RefreshCw } from "lucide-react"
import { type Alert, fetchAlerts } from "@/services/alerts-service"

export default function AlertsPage() {
  const router = useRouter()
  const searchParams = useSearchParams() // para la campanita: importante
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados para los filtros (solo para las columnas mostradas)
  const [typeFilter, setTypeFilter] = useState<string>("Todos")
  const [priorityFilter, setPriorityFilter] = useState<string>("Todos")
  const [statusFilter, setStatusFilter] = useState<string>("Todos")
  const [dateFilter, setDateFilter] = useState<string>("Todos")
  const [currentPage, setCurrentPage] = useState(1)

  // Cargar datos solo cuando se accede a la página
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        let data = await fetchAlerts()
        const params = Object.fromEntries(searchParams.entries())
        if(params?.notifications){
          data = data.filter(alert => alert.status === "Pendiente")
        }
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
  const getUniqueValues = (key: keyof Alert): string[] => {
    const values = alerts
      .map(alert => {
        const value = alert[key];
        // Asegurarse de manejar valores undefined o null
        if (value === undefined || value === null) return null;
        return String(value);
      })
      .filter((value): value is string => value !== null);
    
    // Eliminar duplicados y ordenar alfabéticamente
    const uniqueValues = Array.from(new Set(values)).sort();
    return ["Todos", ...uniqueValues];
  }

  const typeOptions = getUniqueValues("type")
  const priorityOptions = getUniqueValues("priority")
  const statusOptions = getUniqueValues("status")
  const dateOptions = ["Todos", "Hoy", "Ayer", "Esta semana", "Este mes"]

  // Filtrar los datos según los filtros seleccionados
  const filteredAlerts = useMemo(() => {
    // Restablecer a la primera página cuando cambian los filtros
    setCurrentPage(1);
    
    return alerts.filter((alert) => {
      // Aplicar filtro por tipo
      if (typeFilter !== "Todos" && alert.type !== typeFilter) return false;
      
      // Aplicar filtro por prioridad
      if (priorityFilter !== "Todos" && alert.priority !== priorityFilter) return false;
      
      // Aplicar filtro por estado
      if (statusFilter !== "Todos" && alert.status !== statusFilter) return false;
      
      // Aplicar filtro por fecha
      if (dateFilter !== "Todos" && alert.date) {
        try {
          const today = new Date();
          const alertDate = new Date(alert.date.split("/").reverse().join("-"));
          
          const isToday = alertDate.toDateString() === today.toDateString();
          
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          const isYesterday = alertDate.toDateString() === yesterday.toDateString();
          
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          const isThisWeek = alertDate >= startOfWeek && alertDate <= endOfWeek;
          
          const isThisMonth = alertDate.getMonth() === today.getMonth() && 
                            alertDate.getFullYear() === today.getFullYear();
          
          switch (dateFilter) {
            case "Hoy":
              if (!isToday) return false;
              break;
            case "Ayer":
              if (!isYesterday) return false;
              break;
            case "Esta semana":
              if (!isThisWeek) return false;
              break;
            case "Este mes":
              if (!isThisMonth) return false;
              break;
          }
        } catch (error) {
          console.error("Error al procesar fechas:", error);
          return false;
        }
      }
      
      return true;
    });
  }, [alerts, typeFilter, priorityFilter, statusFilter, dateFilter]);

  // Columnas para la tabla
  const columns = [
    { key: "student", title: "Alumno" },
    { key: "type", title: "Tipo de Alerta" },
    { key: "priority", title: "Prioridad" },
    { key: "status", title: "Estado" },
    { key: "date", title: "Fecha" },
    { key: "time", title: "Hora" },
  ]



  // Función para navegar a la vista detallada de la alerta
  const handleAlertClick = (alert: Alert) => {
    router.push(`/alertas/${alert.id}${searchParams.get('notifications') ? '?notifications=true' : ''}`)
  }

  // Renderizar celdas de la tabla
  const renderCell = (alert: Alert, column: { key: string; title: string }) => {
    switch (column.key) {
      case "student":
        return (
          <div
            className="flex items-center space-x-3 cursor-pointer text-center hover:text-blue-500"
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
            <span className="text-center">{alert?.student?.name}</span>
          </div>
        )
      case "type":
        return (
          <div className="flex justify-start w-full">
            <Badge
              className={`whitespace-nowrap px-3 py-1 ${
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
          <div className="flex justify-start w-full">
            <Badge
              variant="outline"
              className={`whitespace-nowrap px-3 py-1 text-center ${
                alert.priority === "Alta"
                  ? "border-red-500 text-red-500"
                  : alert.priority === "Media"
                    ? "border-yellow-500 text-yellow-500"
                    : "border-green-500 text-green-500"
              }`}
            >
              {alert.priority}
            </Badge>
          </div>
        )
      case "status":
        return (
          <div className="flex justify-start w-full">
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
        return <div className="text-left">{alert[column.key as keyof Alert] || 'N/A'}</div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <FilterDropdown label="Tipo" options={typeOptions} value={typeFilter} onChange={setTypeFilter} />
          <FilterDropdown
            label="Prioridad"
            options={priorityOptions}
            value={priorityFilter}
            onChange={setPriorityFilter}
          />
          <FilterDropdown label="Estado" options={statusOptions} value={statusFilter} onChange={setStatusFilter} />
          <FilterDropdown label="Fecha" options={dateOptions} value={dateFilter} onChange={setDateFilter} />
        </div>

        {/* Tabla de alertas */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredAlerts.length > 0 ? (
           <DataTable 
           columns={columns}
           data={filteredAlerts}
           renderCell={renderCell}
           currentPage={currentPage}
           onPageChange={setCurrentPage}
           pageSize={25}
           className="mt-4"
         />
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
