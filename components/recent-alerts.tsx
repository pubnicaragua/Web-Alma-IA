import Image from "next/image"
import { cn } from "@/lib/utils"

interface RecentAlertsProps {
  alerts: {
    student: {
      name: string
      image: string
    }
    alertType: string
    date: string
  }[]
}

export function RecentAlerts({ alerts }: RecentAlertsProps) {
  return (
    <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-blue-200">
      <h3 className="font-medium text-gray-800 mb-2">Alertas recientes</h3>
      <p className="text-sm text-gray-500 mb-6">5 nuevas alertas este último mes</p>

      <div className="grid grid-cols-1 gap-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <div className="flex items-center space-x-3 w-1/3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200">
                <Image
                  src={alert.student.image || "/placeholder.svg"}
                  alt={alert.student.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium">{alert.student.name}</span>
            </div>

            <span
              className={cn(
                "text-sm font-semibold px-2.5 py-1 rounded-full w-1/3 text-center",
                alert.alertType === "SOS Alma"
                  ? "bg-red-100 text-red-700"
                  : alert.alertType === "Denuncias"
                    ? "bg-purple-100 text-purple-700"
                    : alert.alertType === "IA"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700",
              )}
            >
              {alert.alertType}
            </span>

            <span className="text-sm text-gray-500 w-1/3 text-right">{alert.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
