interface ProfileFieldProps {
  label: string;
  value: string | number;
}

export function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-100 py-3 gap-2">
      <span className="text-gray-600 font-medium min-w-[120px] sm:w-48">
        {label}:
      </span>
      <span className="text-gray-800 break-words flex-1 min-w-0">
        {value || "-"}
      </span>
    </div>
  );
}
