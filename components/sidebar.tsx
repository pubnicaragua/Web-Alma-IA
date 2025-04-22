"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutGrid,
  Users,
  Bell,
  FileText,
  BarChart2,
  Shield,
  Settings,
  ChevronRight,
  ChevronDown,
  UserCog,
  HelpCircle,
  X,
} from "lucide-react"

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  href?: string
  hasSubmenu?: boolean
  isActive?: boolean
  isOpen?: boolean
  onClick?: () => void
  children?: React.ReactNode
}

function SidebarItem({ icon, label, href = "#", hasSubmenu, isActive, isOpen, onClick, children }: SidebarItemProps) {
  const pathname = usePathname()
  const active = isActive !== undefined ? isActive : pathname === href

  if (hasSubmenu) {
    return (
      <div className="space-y-1">
        <button
          onClick={onClick}
          className={`flex items-center justify-between w-full p-2 rounded-md ${
            active ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center">
            <span className="mr-3 text-gray-700">{icon}</span>
            <span className="text-gray-700">{label}</span>
          </div>
          {isOpen ? (
            <ChevronDown size={16} className="text-gray-500" />
          ) : (
            <ChevronRight size={16} className="text-gray-500" />
          )}
        </button>
        {isOpen && <div className="pl-10 space-y-1">{children}</div>}
      </div>
    )
  }

  return (
    <Link
      href={href}
      className={`flex items-center justify-between p-2 rounded-md ${
        active ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center">
        <span className="mr-3 text-gray-700">{icon}</span>
        <span className="text-gray-700">{label}</span>
      </div>
    </Link>
  )
}

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [adminOpen, setAdminOpen] = useState(pathname?.startsWith("/administrativo"))
  const [configOpen, setConfigOpen] = useState(pathname?.startsWith("/configuracion"))
  const [isMobile, setIsMobile] = useState(false)

  // Detectar si estamos en un dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px es el breakpoint para md en Tailwind
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Clases para el sidebar basadas en si está abierto o no en móvil
  const sidebarClasses = `bg-white h-screen p-4 border-r overflow-y-auto transition-all duration-300 ${
    isMobile ? (isOpen ? "fixed top-0 left-0 w-64 z-50 shadow-lg" : "fixed top-0 -left-64 w-64 z-50") : "w-64"
  }`

  return (
    <>
      {/* Overlay para cerrar el sidebar en móvil */}
      {isMobile && isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>}

      <div className={sidebarClasses}>
        {isMobile && isOpen && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="Close navigation menu"
          >
            <X size={24} />
          </button>
        )}

        <nav className="space-y-2 mt-4">
          <SidebarItem icon={<LayoutGrid size={20} />} label="General" href="/" />
          <SidebarItem icon={<Users size={20} />} label="Alumnos" href="/alumnos" />
          <SidebarItem icon={<Bell size={20} />} label="Alertas" href="/alertas" />
          <SidebarItem icon={<FileText size={20} />} label="Informes" href="/informes" />
          <SidebarItem icon={<BarChart2 size={20} />} label="Comparativo" href="/comparativo" />

          <SidebarItem
            icon={<Shield size={20} />}
            label="Administrativo"
            hasSubmenu
            isActive={pathname?.startsWith("/administrativo")}
            isOpen={adminOpen}
            onClick={() => setAdminOpen(!adminOpen)}
          >
            <SidebarItem
              icon={<UserCog size={18} />}
              label="Docentes"
              href="/administrativo/docentes"
              isActive={pathname === "/administrativo/docentes"}
            />
          </SidebarItem>

          <SidebarItem
            icon={<Settings size={20} />}
            label="Configuración"
            hasSubmenu
            isActive={pathname?.startsWith("/configuracion")}
            isOpen={configOpen}
            onClick={() => setConfigOpen(!configOpen)}
          >
            <SidebarItem
              icon={<HelpCircle size={18} />}
              label="Preguntas"
              href="/configuracion/preguntas"
              isActive={pathname === "/configuracion/preguntas"}
            />
          </SidebarItem>
        </nav>
      </div>
    </>
  )
}
