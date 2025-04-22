import type React from "react"

interface ProfileSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function ProfileSection({ title, children, className = "" }: ProfileSectionProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
}
