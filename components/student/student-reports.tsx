import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface Report {
  fecha: string
  tipo: string
  resumen: string
}

interface StudentReportsProps {
  reports: Report[]
}

export function StudentReports({ reports }: StudentReportsProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Informes</h3>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto border border-gray-100">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-blue-300">
              <th className="px-4 py-3 text-left font-medium text-white">Fecha Generación</th>
              <th className="px-4 py-3 text-left font-medium text-white">Tipo Informe</th>
              <th className="px-4 py-3 text-left font-medium text-white">Resumen Informe</th>
              <th className="px-4 py-3 text-left font-medium text-white">Estado</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{report.fecha}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {report.tipo}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{report.resumen}</td>
                <td className="px-4 py-3 text-sm">
                  <Button variant="outline" size="sm" className="flex items-center gap-1 border border-gray-200">
                    <Download className="h-4 w-4" />
                    Descargar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
