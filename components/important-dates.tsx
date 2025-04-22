interface ImportantDatesProps {
  dates: {
    event: string
    dateRange: string
  }[]
}

export function ImportantDates({ dates }: ImportantDatesProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="font-medium text-gray-800 mb-4">Fechas Importantes</h3>

      <div className="space-y-3">
        {dates.map((date, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
            <span className="text-sm text-gray-700">{date.event}</span>
            <span className="text-sm text-gray-500">{date.dateRange}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
