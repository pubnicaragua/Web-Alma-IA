export function StudentSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Zona 1: Información principal del estudiante */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 border border-blue-200">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-blue-100 bg-gray-200"></div>
          <div className="flex flex-col items-center md:items-start">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="flex gap-4">
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              <div className="h-6 bg-gray-200 rounded-full w-32"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Zona 2: Pestañas de navegación */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-blue-200">
        <div className="bg-blue-100 w-full flex justify-start overflow-x-auto p-1 rounded-md">
          <div className="bg-blue-500 text-white rounded px-4 py-2 flex items-center mr-2">
            <div className="w-4 h-4 mr-2 rounded-full bg-white/30"></div>
            <div className="h-4 bg-white/30 rounded w-16"></div>
          </div>
          <div className="bg-transparent rounded px-4 py-2 flex items-center mr-2">
            <div className="w-4 h-4 mr-2 rounded-full bg-gray-400/30"></div>
            <div className="h-4 bg-gray-400/30 rounded w-20"></div>
          </div>
          <div className="bg-transparent rounded px-4 py-2 flex items-center mr-2">
            <div className="w-4 h-4 mr-2 rounded-full bg-gray-400/30"></div>
            <div className="h-4 bg-gray-400/30 rounded w-24"></div>
          </div>
          <div className="bg-transparent rounded px-4 py-2 flex items-center">
            <div className="w-4 h-4 mr-2 rounded-full bg-gray-400/30"></div>
            <div className="h-4 bg-gray-400/30 rounded w-28"></div>
          </div>
        </div>

        {/* Zona 3: Contenido de las pestañas */}
        <div className="mt-6 bg-white rounded-lg p-4 border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Datos personales */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-blue-200">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
                <div className="w-5 h-5 mr-2 rounded-full bg-blue-500"></div>
                <div className="h-6 bg-gray-200 rounded w-40"></div>
              </div>
              <div className="space-y-3">
                <div className="flex flex-col">
                  <div className="h-4 bg-gray-200 rounded w-36 mb-1"></div>
                  <div className="h-5 bg-gray-200 rounded w-28"></div>
                </div>
                <div className="flex flex-col">
                  <div className="h-4 bg-gray-200 rounded w-40 mb-1"></div>
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="flex flex-col">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-5 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-blue-200">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
                <div className="w-5 h-5 mr-2 rounded-full bg-blue-500"></div>
                <div className="h-6 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-5 h-5 rounded-full bg-blue-500 mr-3"></div>
                    <div className="flex flex-col">
                      <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                      <div className="h-5 bg-gray-200 rounded w-36"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Apoderados */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-8 border border-blue-200">
            <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
              <div className="w-5 h-5 mr-2 rounded-full bg-blue-500"></div>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="bg-blue-300">
                    <th className="px-4 py-3 text-left">
                      <div className="h-5 bg-white/30 rounded w-16"></div>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <div className="h-5 bg-white/30 rounded w-24"></div>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <div className="h-5 bg-white/30 rounded w-28"></div>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <div className="h-5 bg-white/30 rounded w-20"></div>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <div className="h-5 bg-white/30 rounded w-24"></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((row) => (
                    <tr key={row} className="border-b-2 border-gray-100">
                      <td className="px-4 py-3">
                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-5 bg-gray-200 rounded w-32"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-5 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-5 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-5 bg-gray-200 rounded w-28"></div>
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
