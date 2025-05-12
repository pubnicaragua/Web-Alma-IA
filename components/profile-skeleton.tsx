import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-3 sm:px-6 py-8">
      {/* Zona 1: Información de perfil principal */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-blue-200">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="flex flex-col items-center md:items-start">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Zona 2: Datos personales */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
          <Skeleton className="h-7 w-40 mb-4" />
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        </div>

        {/* Zona 3: Información de contacto */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
          <Skeleton className="h-7 w-48 mb-4" />
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Zona 4: Datos académicos */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-blue-200">
        <Skeleton className="h-7 w-40 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
      </div>

      {/* Zona 5: Permisos y accesos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Permisos */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
          <Skeleton className="h-7 w-40 mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        </div>

        {/* Acciones */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
          <Skeleton className="h-7 w-40 mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        </div>
      </div>

      {/* Zona 6: Botón de cerrar sesión */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
        <Skeleton className="h-14 w-full rounded-md" />
      </div>
    </div>
  )
}
