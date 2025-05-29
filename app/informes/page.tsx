"use client"

import { useState, useEffect } from "react"
import { APIReportGeneral, fetchReports, type Report } from "@/services/reports-service"
import { ReportsList } from "@/components/report/reports-list"
import { ReportsSkeleton } from "@/components/report/reports-skeleton"
import { Button } from "@/components/ui/button"
import { PlusCircle, RefreshCw, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AppLayout } from "@/components/layout/app-layout"


export default function ReportsPage() {
  const [reports, setReports] = useState<APIReportGeneral[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const loadReports = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchReports()
      setReports(data || []) // Asegurarnos de que siempre sea un array
    } catch (err) {
      console.error("Error al cargar informes:", err)
      setError("No se pudieron cargar los informes. Por favor, intenta de nuevo.")
      toast({
        title: "Error",
        description: "No se pudieron cargar los informes. Se están mostrando datos de ejemplo.",
        variant: "destructive",
      })
      // Asegurarnos de que reports sea un array vacío en caso de error
      setReports([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  return (
    <AppLayout>
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Informes</h1>
            <p className="text-gray-500 mt-1">Gestiona y visualiza los informes de los alumnos</p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm" onClick={loadReports} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Nuevo informe
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error al cargar los informes</p>
              <p className="text-sm">{error}</p>
              <Button variant="link" className="text-red-700 p-0 h-auto text-sm mt-1" onClick={loadReports}>
                Intentar de nuevo
              </Button>
            </div>
          </div>
        )}

        {loading ? <ReportsSkeleton /> : <ReportsList reports={reports} />}
      </div>
    </AppLayout>
  )
}
