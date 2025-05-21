"use client"

import { Pagination } from "@/components/pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { APIReportGeneral, Report } from "@/services/reports-service"
import { ArrowDown, ExternalLink, FileText, Filter, Paperclip } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { DataTable } from "../data-table(2)"
import { Column } from "../data-table"

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

  const [currentPage, setCurrentPage] = useState(1)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterNivel, setFilterNivel] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date-desc")
  const [uniqueTypes, setUniqueTypes] = useState<string[]>(['all'])
  const [uniqueNivel, setUniqueNivel] = useState<string[]>(['all'])
  const [filteredReports, setFilteredReports] = useState<APIReportGeneral[]>([])

  const itemsPerPage = 5

  // const renderCell = (report: APIReportGeneral, column: { key: string; title: string }, index: number) => {
  //   switch (column.key) {
  //     case "informe_id":
  //     case "tipo":
  //     case "fecha_generacion":
  //     case "nivel":
  //     case "creado_por":
  //       return (
  //         <div
  //           className={`flex items-center space-x-3  hover:text-blue-500`}
  //         // onClick={() => handleStudentClick(student)}
  //         >
  //           <span>{column.key === 'fecha_generacion' ? new Date(report[column.key]).toLocaleDateString('ES-es') : String(report[column.key])}</span>
  //         </div>
  //       )
  //     case "url_reporte":
  //       return <div>
  //         <Link href={report[column.key]}
  //           target="_blank"
  //           className="px-3 py-2 text-white rounded-md bg-blue-500 flex justify-between"
  //         >
  //           <ArrowDown className="h-4 w-4" />
  //           Decargar
  //         </Link>
  //       </div>

  //   }
  // }

   const renderCell = (report: APIReportGeneral, column: Column, index?: number) => {
    switch (column.key) {
      // Para las columnas de texto simple
      case "informe_id":
      case "tipo":
      case "fecha_generacion":
      case "nivel":
      case "creado_por":
        return (
          <div
            className="flex items-center space-x-3 hover:text-blue-500"
          // onClick={() => handleStudentClick(report)} // Descomentado para implementar funcionalidad de clic
          >
            <span>
              {/* Formatea la fecha si es la columna de fecha_generacion, de lo contrario muestra el valor como texto */}
              {column.key === "fecha_generacion"
                ? new Date(report[column.key]).toLocaleDateString("es-ES")
                : String(report[column.key])}
            </span>
          </div>
        )

      // Para la columna de acciones (botón de descarga)
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

      // Caso por defecto para cualquier otra columna no especificada
      // default:
      //   return <span>{String(report[column.key]) || ""}</span>
    }
  }

  const handleFilterType = (type: string) => {
    setFilterType(type)
    console.log('handleFilterType:', type)
    // Obtener tipos únicos para el filtro
    // const TypesFiltered = Array.from(new Set(safeReports.map((report) => report.tipo)))
    // setUniqueTypes(TypesFiltered)
    const reportsFiltered = filteredReports.filter(report => report.tipo === type)
    setFilteredReports(reportsFiltered)
  }
  const handleFilterNivel = (nivel: string) => {
    setFilterNivel(nivel)

    // const NivelFiltered = Array.from(new Set(safeReports.map((report) => report.nivel)))
    // setUniqueNivel(NivelFiltered)
    const reportsFiltered = filteredReports.filter(report => report.nivel === nivel)
    setFilteredReports(reportsFiltered)
  }

  useEffect(() => {
    setFilteredReports(safeReports)

    const NivelFiltered = Array.from(new Set(safeReports.map((report) => report.nivel)))
    setUniqueNivel(NivelFiltered)
    const TypesFiltered = Array.from(new Set(safeReports.map((report) => report.tipo)))
    setUniqueTypes(TypesFiltered)
  }, [filterNivel, filterType])






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
          <Select value={filterNivel} onValueChange={handleFilterNivel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Nivel (todos)</SelectItem>
              {/* <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="archived">Archivados</SelectItem> */}
              {uniqueNivel.map((type, index) => (
                <SelectItem key={index} value={type}>
                  {type}
                </SelectItem>
              ))}
              {/* {uniqueNivel.map((period,index) => (
                <SelectItem key={index} value={period}>
                  {period}
                </SelectItem>
              ))}  */}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <Select value={filterType} onValueChange={handleFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">tipo (todos)</SelectItem>
              {/* <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="archived">Archivados</SelectItem> */}
              {uniqueTypes.map((type, index) => (
                <SelectItem key={index} value={type}>
                  {type}
                </SelectItem>
              ))}
              {/* {uniqueNivel.map((period,index) => (
                <SelectItem key={index} value={period}>
                  {period}
                </SelectItem>
              ))}  */}
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
          {/* {currentItems.map((report) => (
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
          ))} */}
            <DataTable columns={columns} data={filteredReports} renderCell={renderCell} />
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
