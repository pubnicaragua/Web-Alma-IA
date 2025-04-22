interface ProfileFieldProps {
  label: string
  value: string | number
}

export function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center">
      <span className="text-gray-600 font-medium w-48">{label}:</span>
      <span className="text-gray-800">{value}</span>
    </div>
  )
}
