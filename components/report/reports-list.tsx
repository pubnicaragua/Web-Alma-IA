"use client"

import { Pagination } from "@/components/pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { APIReportGeneral, Report } from "@/services/reports-service"
import { ArrowDown, ExternalLink, FileText, Filter, Paperclip } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { DataTable } from "../data-table"

interface ReportsListProps {
  reports: APIReportGeneral[]
}

// Columnas para la tabla
const columns = [
  { key: "informe_id", title: "id" },
  { key: "tipo", title: "Tipo" },
  { key: "nivel", title: "Nivel" },
  { key: "fecha_generacion", title: "Fecha de generación" },
  { key: "creado_por", title: "Generado por" },
  { key: "url_reporte", title: "Descargar Informe" },
]

export function ReportsList({ reports = [] }: ReportsListProps) {
  console.log(reports)
  // Asegurarnos de que reports siempre sea un array
  const safeReports = Array.isArray(reports) ? reports : []

  // Estados para filtros y paginación
  const [filteredReports, setFilteredReports] = useState<APIReportGeneral[]>([])
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([])
  const [uniqueNiveles, setUniqueNiveles] = useState<string[]>([])
  const [filterType, setFilterType] = useState<string>("all")
  const [filterNivel, setFilterNivel] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date-desc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25

  interface Column {
    key: string
    title: string
    className?: string
  }

  // Función para renderizar las celdas de la tabla
  const renderCell = (report: APIReportGeneral, column: Column, index?: number) => {
    switch (column.key) {
      case "informe_id":
      case "tipo":
      case "fecha_generacion":
      case "nivel":
      case "creado_por":
        return (
          <div className="flex items-center space-x-3 hover:text-blue-500">
            <span>
              {column.key === "fecha_generacion"
                ? new Date(report[column.key]).toLocaleDateString("es-ES")
                : String(report[column.key])}
            </span>
          </div>
        )

      case "url_reporte":
        return (
          <div>
            <Link
              href={report[column.key]}
              target="_blank"
              className="px-3 py-2 text-white rounded-md bg-blue-500 flex items-center space-x-2"
            >
              <ArrowDown className="h-4 w-4" />
              <span>Descargar</span>
            </Link>
          </div>
        )
    }
  }

  // Efecto para inicializar los filtros únicos
  useEffect(() => {
    if (safeReports.length > 0) {
      // Obtener tipos y niveles únicos para los filtros
      const tiposUnicos = Array.from(new Set(safeReports.map(report => report.tipo))).filter(Boolean) as string[]
      const nivelesUnicos = Array.from(new Set(safeReports.map(report => report.nivel))).filter(Boolean) as string[]
      
      setUniqueTypes([...tiposUnicos])
      setUniqueNiveles([...nivelesUnicos])
      
      // Aplicar filtros iniciales
      applyFilters(safeReports, filterType, filterNivel, sortBy)
    }
  }, [safeReports])

  // Función para aplicar los filtros
  const applyFilters = useCallback((reports: APIReportGeneral[], type: string, nivel: string, sort: string) => {
    let result = [...reports]

    // Aplicar filtros
    if (type !== 'all') {
      result = result.filter(report => report.tipo === type)
    }
    if (nivel !== 'all') {
      result = result.filter(report => report.nivel === nivel)
    }

    // Ordenar
    result.sort((a, b) => {
      const dateA = new Date(a.fecha_generacion).getTime()
      const dateB = new Date(b.fecha_generacion).getTime()
      return sort === 'date-asc' ? dateA - dateB : dateB - dateA
    })

    setFilteredReports(result)
    setCurrentPage(1) // Resetear a la primera página al cambiar filtros
  }, [])

  
  // Manejadores de cambio de filtros
  const handleFilterType = (type: string) => {
    setFilterType(type)
    applyFilters(safeReports, type, filterNivel, sortBy)
  }
  
  const handleFilterNivel = (nivel: string) => {
    setFilterNivel(nivel)
    applyFilters(safeReports, filterType, nivel, sortBy)
  }
  
  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    applyFilters(safeReports, filterType, filterNivel, sort)
  }






  // Ordenar informes
  const sortedReports = [...filteredReports].sort((a, b) => {
    const dateA = new Date(a.fecha_creacion)
    const dateB = new Date(b.fecha_creacion)

    switch (sortBy) {
      case "date-asc":
        return dateA.getTime() - dateB.getTime()
      case "date-desc":
        return dateB.getTime() - dateA.getTime()
      // case "type":
      //   return a.type.localeCompare(b.type)
      // case "status":
      //   return a.status.localeCompare(b.status)
      default:
        return dateB.getTime() - dateA.getTime()
    }
  })

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Abrir informe en nueva pestaña
  const openReport = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <div className="space-y-6">
      {/* Sección de Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Filter className="h-4 w-4" />
            <span>Filtrar por:</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por Nivel */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
              <Select value={filterNivel} onValueChange={handleFilterNivel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {uniqueNiveles.map((nivel, index) => (
                    <SelectItem key={`nivel-${index}`} value={nivel}>
                      {nivel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Filtro por Tipo */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <Select value={filterType} onValueChange={handleFilterType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {uniqueTypes.map((tipo, index) => (
                    <SelectItem key={`tipo-${index}`} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Ordenar por fecha */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por fecha</label>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar orden" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Más recientes primero</SelectItem>
                  <SelectItem value="date-asc">Más antiguos primero</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <DataTable 
          columns={columns} 
          data={filteredReports.slice(
            (currentPage - 1) * itemsPerPage, 
            currentPage * itemsPerPage
          )} 
          renderCell={renderCell} 
        />
        
        {filteredReports.length > itemsPerPage && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, filteredReports.length)}-
              {Math.min(currentPage * itemsPerPage, filteredReports.length)} de {filteredReports.length} informes
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="px-3 py-1 text-sm font-medium">
                Página {currentPage} de {Math.ceil(filteredReports.length / itemsPerPage)}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(p + 1, Math.ceil(filteredReports.length / itemsPerPage)))}
                disabled={currentPage * itemsPerPage >= filteredReports.length}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
