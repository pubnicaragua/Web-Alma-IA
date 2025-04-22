import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  count: number
  stats: {
    label: string
    value: string | number
  }[]
  className?: string
  textColor?: string
}

export function StatCard({ title, count, stats, className, textColor = "text-white" }: StatCardProps) {
  return (
    <div className={cn("rounded-lg p-4", className)}>
      <h3 className={cn("font-medium mb-2", textColor)}>{title}</h3>
      <div className="flex items-end gap-1">
        <span className={cn("text-5xl font-bold", textColor)}>{count}</span>
        <span className={cn("text-sm mb-1", textColor)}>{stats[0]?.label === "nuevos" ? "nuevos" : "activos"}</span>
      </div>
      <div className="mt-2 space-y-1">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between">
            <span className={cn("text-xs", textColor)}>
              {stat.value} {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
