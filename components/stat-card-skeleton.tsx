export function StatCardSkeleton() {
  return (
    <div className="rounded-lg p-4 bg-gray-100 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="flex items-end gap-1 mb-2">
        <div className="h-12 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-12 mb-1"></div>
      </div>
      <div className="mt-2 space-y-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
