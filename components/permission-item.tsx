"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface PermissionItemProps {
  title: string
  expanded?: boolean
}

export function PermissionItem({ title, expanded = false }: PermissionItemProps) {
  const [isExpanded, setIsExpanded] = useState(expanded)

  return (
    <div className="border-b border-gray-200 py-3">
      <button
        className="flex items-center justify-between w-full text-left focus:outline-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-gray-800">{title}</span>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
    </div>
  )
}
