"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function TeachersListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-1">
          <Skeleton className="h-5 w-24 mb-1" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-5 w-24 mb-1" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-5 w-24 mb-1" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
        
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border-b last:border-0">
            <div className="grid grid-cols-4 gap-4 items-center">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center pt-4">
        <Skeleton className="h-5 w-32" />
        <div className="flex space-x-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-9 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TeachersListSkeleton
