export function DonutChartSkeleton() {
  return (
    <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-blue-200 animate-pulse">
      <div className="flex items-center mb-4">
        <div className="w-5 h-5 bg-gray-200 rounded-full mr-2"></div>
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
      </div>
      <div className="flex justify-center items-center">
        <div className="w-48 h-48 rounded-full bg-gray-200"></div>
      </div>
      <div className="mt-4 space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center">
            <div className="w-3 h-3 bg-gray-200 rounded-full mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
