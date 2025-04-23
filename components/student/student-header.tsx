"use client"

import { useState } from "react"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface StudentHeaderProps {
  student: {
    name: string
    grade: string
    status: "good" | "warning" | "danger"
    statusText: string
    photoUrl: string
  }
}

export function StudentHeader({ student }: StudentHeaderProps) {
  const [showOptions, setShowOptions] = useState(false)
  const isMobile = useIsMobile()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-500 hover:bg-green-600"
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "danger":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-shrink-0">
          <img
            src={student.photoUrl || "/placeholder.svg"}
            alt={student.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
          />
        </div>
        <div className="flex-grow">
          <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
          <p className="text-gray-500">{student.grade}</p>
        </div>
        <div className="flex flex-col sm:items-end">
          <button
            className={`${getStatusColor(
              student.status,
            )} text-white font-medium rounded-full px-4 py-2 flex items-center justify-center gap-2 transition-colors`}
            onClick={() => setShowOptions(!showOptions)}
          >
            {isMobile ? (
              <Check className="w-5 h-5" />
            ) : (
              <>
                {student.statusText}
                {showOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </>
            )}
          </button>
          {showOptions && (
            <div className="absolute mt-2 bg-white rounded-md shadow-lg z-10 right-6 sm:right-auto">
              <div className="py-1">
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Bien
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Alerta
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Peligro
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
