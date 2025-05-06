export function StudentSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Zona 1: Información principal del estudiante (skeleton) */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-blue-200">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-blue-100 bg-gray-200"></div>
          <div className="flex flex-col items-center md:items-start">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="flex gap-4">
              <div className="h-6 bg-gray-200 rounded-full w-24"></div>
              <div className="h-6 bg-gray-200 rounded-full w-32"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Zona 2: Pestañas de navegación (skeleton) */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-blue-200">
        <div className="bg-blue-100 w-full h-12 rounded-md mb-6"></div>

        {/* Zona 3: Contenido de las pestañas (skeleton) */}
        <div className="mt-6 bg-white rounded-lg p-4 border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Datos personales (skeleton) */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
              <div className="h-7 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="flex flex-col">
                  <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="flex flex-col">
                  <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>

            {/* Información de contacto (skeleton) */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
              <div className="h-7 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="h-5 w-5 bg-gray-200 rounded-full mr-3"></div>
                  <div className="flex flex-col">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-36"></div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="h-5 w-5 bg-gray-200 rounded-full mr-3"></div>
                  <div className="flex flex-col">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-36"></div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="h-5 w-5 bg-gray-200 rounded-full mr-3"></div>
                  <div className="flex flex-col">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-36"></div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="h-5 w-5 bg-gray-200 rounded-full mr-3"></div>
                  <div className="flex flex-col">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-36"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Apoderados (skeleton) */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-blue-200">
            <div className="h-7 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="bg-blue-300">
                    <th className="px-4 py-3 text-left font-medium text-white">Tipo</th>
                    <th className="px-4 py-3 text-left font-medium text-white">Nombre</th>
                    <th className="px-4 py-3 text-left font-medium text-white">Parentesco</th>
                    <th className="px-4 py-3 text-left font-medium text-white">Teléfono</th>
                    <th className="px-4 py-3 text-left font-medium text-white">RUT/DNI</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(3)].map((_, index) => (
                    <tr key={index} className="border-b-2 border-gray-100">
                      <td className="px-4 py-3">
                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-5 bg-gray-200 rounded w-36"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-5 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-5 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-5 bg-gray-200 rounded w-24"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
