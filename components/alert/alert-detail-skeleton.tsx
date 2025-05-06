import { Skeleton } from "@/components/ui/skeleton"

export function AlertDetailSkeleton() {
  return (
    <div className="container mx-auto px-3 sm:px-6 py-8">
      {/* Skeleton para la información del alumno */}
      <div className="flex items-center mb-6">
        <Skeleton className="w-24 h-24 rounded-full mr-6 flex-shrink-0" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <Skeleton className="h-8 w-48 mb-6" />

      {/* Skeleton para el responsable actual */}
      <div className="mb-6">
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

      {/* Skeleton para la descripción de la alerta */}
      <div className="mb-6">
        <Skeleton className="h-6 w-56 mb-3" />
        <Skeleton className="h-20 w-full" />
      </div>

      {/* Skeleton para la bitácora de acciones */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>

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
      </div>
    </div>
  )
}
