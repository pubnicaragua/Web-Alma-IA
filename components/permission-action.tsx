"use client"

import { ChevronRight } from "lucide-react"

interface PermissionActionProps {
  title: string
  onClick?: () => void
}

export function PermissionAction({ title, onClick }: PermissionActionProps) {
  return (
    <div className="border-b border-gray-200 py-3">
      <button className="flex items-center justify-between w-full text-left focus:outline-none" onClick={onClick}>
        <span className="text-gray-800">{title}</span>
        <ChevronRight className="h-5 w-5 text-gray-500" />
      </button>
    </div>
  )
}
