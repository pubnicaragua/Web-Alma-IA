"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function SchoolCardSkeleton() {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-100 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between">
        <div className="flex items-center w-full sm:w-auto mb-3 sm:mb-0">
          <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg mr-3 sm:mr-4" />
          <Skeleton className="h-6 w-48" />
        </div>
        
        <div className="flex flex-wrap gap-3 sm:gap-0 sm:flex-nowrap sm:items-center sm:space-x-6 w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
      <Skeleton className="absolute right-0 top-0 bottom-0 w-1" />
    </div>
  )
}
