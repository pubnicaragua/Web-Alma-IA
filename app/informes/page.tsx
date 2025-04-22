"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { FilterDropdown } from "@/components/filter-dropdown"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"

interface Report {
  id: string
  title: string
  type: string
  course: string
  date: string
  status: string
  author: string
}

export default function ReportsPage() {
  // Datos de ejemplo para los informes
  const reportsData: Report[] = [
    {
      id: "1",
      title: "Informe mensual de rendimiento",
      type: "Rendimiento",
      course: "4°A",
      date: "12/04/2025",
      status: "Completado",
      author: "Palomina Gutierrez",
    },
    {
      id: "2",
      title: "Informe de alertas activas",
      type: "Alertas",
      course: "2°A",
      date: "10/04/2025",
      status: "Completado",
      author: "Jorge Mendez",
    },
    {
      id: "3",
      title: "Informe de bienestar emocional",
      type: "Emocional",
      course: "5°C",
      date: "08/04/2025",
      status: "Completado",
      author: "Ana María López",
    },
    {
      id: "4",
      title: "Informe de asistencia trimestral",
      type: "Asistencia",
      course: "3°B",
      date: "05/04/2025",
      status: "Completado",
      author: "Roberto Sánchez",
    },
    {
      id: "5",
      title: "Informe de comportamiento",
      type: "Comportamiento",
      course: "1°A",
      date: "01/04/2025",
      status: "Completado",
      author: "Claudia Morales",
    },
    {
      id: "6",
      title: "Informe de evaluaciones",
      type: "Evaluaciones",
      course: "6°B",
      date: "28/03/2025",
      status: "Completado",
      author: "Matías Ignacio Díaz",
    },
  ]

  // Estados para los filtros
  const [typeFilter, setTypeFilter] = useState<string>("Todos")
  const [courseFilter, setCourseFilter] = useState<string>("Todos")
  const [dateFilter, setDateFilter] = useState<string>("Todos")
  const [statusFilter, setStatusFilter] = useState<string>("Todos")
  const [authorFilter, setAuthorFilter] = useState<string>("Todos")

  // Opciones para los filtros
  const typeOptions = ["Todos", "Rendimiento", "Alertas", "Emocional", "Asistencia", "Comportamiento", "Evaluaciones"]
  const courseOptions = ["Todos", "1°A", "2°A", "3°B", "4°A", "5°C", "6°B"]
  const dateOptions = ["Todos", "Última semana", "Último mes", "Último trimestre"]
  const statusOptions = ["Todos", "Completado", "En proceso", "Pendiente"]
  const authorOptions = [
    "Todos",
    "Palomina Gutierrez",
    "Jorge Mendez",
    "Ana María López",
    "Roberto Sánchez",
    "Claudia Morales",
    "Matías Ignacio Díaz",
  ]

  // Filtrar los datos según los filtros seleccionados
  const filteredReports = reportsData.filter((report) => {
    return (
      (typeFilter === "Todos" || report.type === typeFilter) &&
      (courseFilter === "Todos" || report.course === courseFilter) &&
      (statusFilter === "Todos" || report.status === statusFilter) &&
      (authorFilter === "Todos" || report.author === authorFilter) &&
      (dateFilter === "Todos" ||
        (dateFilter === "Última semana" && new Date(report.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
        (dateFilter === "Último mes" && new Date(report.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
        (dateFilter === "Último trimestre" && new Date(report.date) >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)))
    )
  })

  // Columnas para la tabla
  const columns = [
    { key: "title", title: "Título del informe" },
    { key: "type", title: "Tipo" },
    { key: "course", title: "Curso" },
    { key: "date", title: "Fecha" },
    { key: "status", title: "Estado" },
    { key: "author", title: "Autor" },
    { key: "actions", title: "Acciones" },
  ]

  // Renderizar celdas de la tabla
  const renderCell = (report: Report, column: { key: string; title: string }) => {
    switch (column.key) {
      case "title":
        return (
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-blue-500" />
            <span>{report.title}</span>
          </div>
        )
      case "status":
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              report.status === "Completado"
                ? "bg-green-100 text-green-800"
                : report.status === "En proceso"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {report.status}
          </span>
        )
      case "actions":
        return (
          <Button variant="outline" size="sm" className="flex items-center space-x-1">
            <Download className="h-4 w-4" />
            <span>Descargar</span>
          </Button>
        )
      default:
        return report[column.key as keyof Report]
    }
  }

  // Función para generar un nuevo informe
  const handleGenerateReport = () => {
    alert("Funcionalidad para generar un nuevo informe")
    // Aquí iría la lógica para abrir un modal o navegar a una página para generar un nuevo informe
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => {}} />
        <main className="flex-1 overflow-y-auto pb-10">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Informes</h2>
              <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleGenerateReport}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Generar informe
              </Button>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <FilterDropdown label="Tipo" options={typeOptions} value={typeFilter} onChange={setTypeFilter} />
              <FilterDropdown label="Curso" options={courseOptions} value={courseFilter} onChange={setCourseFilter} />
              <FilterDropdown label="Fecha" options={dateOptions} value={dateFilter} onChange={setDateFilter} />
              <FilterDropdown label="Estado" options={statusOptions} value={statusFilter} onChange={setStatusFilter} />
              <FilterDropdown label="Autor" options={authorOptions} value={authorFilter} onChange={setAuthorFilter} />
            </div>

            {/* Tabla de informes */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <DataTable columns={columns} data={filteredReports} renderCell={renderCell} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
