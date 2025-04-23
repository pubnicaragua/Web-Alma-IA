import { User } from "lucide-react"

export function UserInfo() {
  return (
    <div className="border-t p-4">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
          <User className="h-5 w-5" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">Emilio Aguilera</p>
          <p className="text-xs text-gray-500">Rector</p>
        </div>
      </div>
    </div>
  )
}
