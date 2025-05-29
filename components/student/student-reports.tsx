import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { DataTable } from "@/components/data-table"

interface Report {
  fecha: string
  tipo: string
  resumen: string
  url_reporte: string
}

interface StudentReportsProps {
  reports: Report[]
}

export function StudentReports({ reports }: StudentReportsProps) {
  const columns = [
    { key: 'fecha', title: 'Fecha Generación', className: 'text-left' },
    { key: 'tipo', title: 'Tipo Informe', className: 'text-left' },
    { key: 'resumen', title: 'Resumen Informe', className: 'text-left' },
    { 
      key: 'accion', 
      title: 'Acción', 
      className: 'text-left',
    },
  ]

  const renderCell = (report: Report, column: { key: string; title: string }) => {
    switch (column.key) {
      case 'tipo':
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            {report.tipo}
          </span>
        )
      case 'accion':
        return (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 border border-gray-200"
            onClick={() => window.open(report.url_reporte, '_blank')}
          >
            <Download className="h-4 w-4" />
            Descargar
          </Button>
        )
      default:
        return <span className="text-sm">{report[column.key as keyof Report] as string}</span>
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Informes</h3>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto border border-gray-100">
        <DataTable
          columns={columns}
          data={reports}
          renderCell={renderCell}
          className="min-w-[640px]"
          pageSize={25}
        />
      </div>
    </div>
  )
}
