"use client"

import { useState } from "react"
import type { Report } from "@/services/reports-service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Paperclip, ExternalLink, Filter } from "lucide-react"
import { Pagination } from "@/components/pagination"

interface ReportsListProps {
  reports: Report[]
}

export function ReportsList({ reports = [] }: ReportsListProps) {
  // Asegurarnos de que reports siempre sea un array
  const safeReports = Array.isArray(reports) ? reports : []

  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date-desc")
  const itemsPerPage = 5

  // Obtener tipos únicos para el filtro
  const uniqueTypes = Array.from(new Set(safeReports.map((report) => report.type)))

  // Obtener períodos únicos para el filtro
  const uniquePeriods = Array.from(new Set(safeReports.map((report) => report.evaluationPeriod)))

  // Filtrar informes
  const filteredReports = safeReports.filter((report) => {
    if (filter === "all") return true
    if (uniqueTypes.includes(filter)) return report.type === filter
    if (uniquePeriods.includes(filter)) return report.evaluationPeriod === filter
    return true
  })

  // Ordenar informes
  const sortedReports = [...filteredReports].sort((a, b) => {
    const dateA = new Date(a.date.split("/").reverse().join("-"))
    const dateB = new Date(b.date.split("/").reverse().join("-"))

    switch (sortBy) {
      case "date-asc":
        return dateA.getTime() - dateB.getTime()
      case "date-desc":
        return dateB.getTime() - dateA.getTime()
      case "type":
        return a.type.localeCompare(b.type)
      case "status":
        return a.status.localeCompare(b.status)
      default:
        return dateB.getTime() - dateA.getTime()
    }
  })

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedReports.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedReports.length / itemsPerPage)

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Abrir informe en nueva pestaña
  const openReport = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los informes</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="archived">Archivados</SelectItem>
              {uniqueTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
              {uniquePeriods.map((period) => (
                <SelectItem key={period} value={period}>
                  {period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Más recientes</SelectItem>
            <SelectItem value="date-asc">Más antiguos</SelectItem>
            <SelectItem value="type">Tipo</SelectItem>
            <SelectItem value="status">Estado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {currentItems.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">No se encontraron informes con los filtros seleccionados.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {currentItems.map((report) => (
            <Card key={report.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-medium">{report.type}</CardTitle>
                  <Badge style={{ backgroundColor: report.statusColor }}>{report.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Fecha:</span>
                    <span>{report.date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Período:</span>
                    <span>{report.evaluationPeriod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Creado por:</span>
                    <span>{report.createdBy}</span>
                  </div>
                  {report.observations && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-1">Observaciones:</p>
                      <p className="text-sm">{report.observations}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex items-center">
                  {report.attachments && report.attachments.length > 0 && (
                    <div className="flex items-center text-sm text-gray-500 mr-4">
                      <Paperclip className="h-4 w-4 mr-1" />
                      <span>{report.attachments.length} anexo(s)</span>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={() => openReport(report.reportUrl)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Ver informe
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  )
}
