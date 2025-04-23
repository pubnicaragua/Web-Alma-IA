"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { AndroidNavMenu } from "@/components/android-nav-menu"
import { useIsMobile } from "@/hooks/use-mobile"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header toggleSidebar={toggleMobileMenu} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar para escritorio (siempre visible en md y superior) */}
        <DesktopSidebar className="hidden md:block" />

        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>

      {/* Menú para Android (solo en dispositivos móviles) */}
      {isMobile ? (
        <AndroidNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      ) : (
        <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  )
}
