'use client'

import { Suspense } from "react"
import { Header } from "@/components/header"
import { NavigationMenu } from "@/components/navigation-menu"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { AndroidNavMenu } from "@/components/android-nav-menu"
import { useIsMobile } from "@/hooks/use-mobile"
import { StudentsContent } from "@/components/students/student-component"
import { useState } from "react"

export default function StudentsPage() {
  const isMobile = useIsMobile()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={toggleMobileMenu} />

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:block w-64 border-r border-gray-200">
          <div className="h-12 border-b"></div>
          <NavigationMenu />
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <h2 className="text-2xl font-bold mb-6">Alumnos</h2>

          <Suspense fallback={<div>Cargando búsqueda...</div>}>
            <StudentsContent />
          </Suspense>
        </main>
      </div>

      {isMobile
        ? <AndroidNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        : <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />}
    </div>
  )
}
