import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function ReportsSkeleton() {
  // Crear un array de 5 elementos para mostrar 5 esqueletos
  const skeletons = Array.from({ length: 5 }, (_, i) => i)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div className="h-10 w-[180px] bg-gray-200 animate-pulse rounded-md"></div>
        <div className="h-10 w-[180px] bg-gray-200 animate-pulse rounded-md"></div>
      </div>

      <div className="grid gap-4">
        {skeletons.map((index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 w-20 bg-gray-200 animate-pulse rounded-full"></div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-40 bg-gray-200 animate-pulse rounded"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                </div>
                <div className="mt-2">
                  <div className="h-4 w-28 bg-gray-200 animate-pulse rounded mb-1"></div>
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-8 w-28 bg-gray-200 animate-pulse rounded"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
