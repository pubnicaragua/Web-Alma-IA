import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function AlertDetailSkeleton() {
  return (
    <div className="container mx-auto px-3 sm:px-6 py-8">
      {/* Botón Volver */}
      <div className="mb-6">
        <Button variant="outline" size="sm" className="flex items-center gap-1" disabled>
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </div>

      {/* Card de información del alumno */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Skeleton className="w-24 h-24 rounded-full mr-6 flex-shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de detalles de la alerta */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Responsable actual */}
          <div>
            <Skeleton className="h-6 w-40 mb-3" />
            <div className="flex items-center">
              <Skeleton className="w-10 h-10 rounded-full mr-3 flex-shrink-0" />
              <Skeleton className="h-5 w-56" />
            </div>
            <div className="flex items-center mt-2">
              <Skeleton className="h-4 w-4 mr-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Descripción de la alerta */}
          <div>
            <Skeleton className="h-6 w-56 mb-3" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Bitácora de acciones */}
      <Card className="mb-6">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-xl">
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <Skeleton className="h-9 w-32" />
        </CardHeader>
        <CardContent>
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            <div className="w-full min-w-[640px]">
              {/* Encabezado de la tabla */}
              <div className="bg-blue-300 px-4 py-3 flex">
                <Skeleton className="h-6 w-1/6 mr-2" />
                <Skeleton className="h-6 w-1/6 mr-2" />
                <Skeleton className="h-6 w-1/6 mr-2" />
                <Skeleton className="h-6 w-1/6 mr-2" />
                <Skeleton className="h-6 w-1/6 mr-2" />
                <Skeleton className="h-6 w-1/6" />
              </div>

              {/* Filas de la tabla */}
              {[...Array(4)].map((_, index) => (
                <div key={index} className="border-b border-gray-100 px-4 py-3 flex">
                  <Skeleton className="h-5 w-1/6 mr-2" />
                  <Skeleton className="h-5 w-1/6 mr-2" />
                  <Skeleton className="h-5 w-1/6 mr-2" />
                  <Skeleton className="h-5 w-1/6 mr-2" />
                  <Skeleton className="h-5 w-1/6 mr-2" />
                  <Skeleton className="h-5 w-1/6" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
