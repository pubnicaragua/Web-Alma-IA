import type React from "react"
import ProtectedRoute from "@/components/protected-route"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        <DesktopSidebar />
        <div className="flex-1 overflow-auto">
          <MobileSidebar />
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
