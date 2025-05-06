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

      <div className="space-y-6">
        {alerts.map((alert, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
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
                "text-sm mx-2",
                alert.alertType === "SOS Alma"
                  ? "text-red-500"
                  : alert.alertType === "Denuncias"
                    ? "text-purple-500"
                    : alert.alertType === "IA"
                      ? "text-blue-500"
                      : "",
              )}
            >
              {alert.alertType}
            </span>

            <span className="text-sm text-gray-500">{alert.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
