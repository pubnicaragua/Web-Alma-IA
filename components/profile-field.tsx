interface ProfileFieldProps {
  label: string
  value: string | number
}

export function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-100 pb-3">
      <span className="text-gray-600 font-medium w-48 mb-1 sm:mb-0">{label}:</span>
      <span className="text-gray-800">{value}</span>
    </div>
  )
}
