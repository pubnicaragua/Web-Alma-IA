"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Users,
  Bell,
  BarChart2,
  FileText,
  User,
  Settings,
  ChevronDown,
  ChevronRight,
  School,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)

  // Cerrar el sidebar cuando cambia la ruta
  useEffect(() => {
    if (isOpen) {
      onClose()
    }
  }, [pathname, isOpen, onClose])

  // Prevenir el scroll del body cuando el sidebar está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const isActive = (path: string) => {
    if (path === "/") return pathname === path
    return pathname?.startsWith(path)
  }

  const menuItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Alumnos", href: "/alumnos", icon: Users },
    { name: "Alertas", href: "/alertas", icon: Bell },
    { name: "Comparativo", href: "/comparativo", icon: BarChart2 },
    { name: "Informes", href: "/informes", icon: FileText },
    { name: "Perfil", href: "/perfil", icon: User },
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Overlay para cerrar el sidebar */}
      <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} aria-hidden="true" />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg md:hidden">
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Link href="/" className="flex items-center">
            <School className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-bold text-primary">Alma IA</h2>
          </Link>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Cerrar menú">
            <X size={24} />
          </button>
        </div>

        <nav className="h-[calc(100%-4rem)] overflow-y-auto p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.href) ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100",
                  )}
                  onClick={onClose}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}

            {/* Settings Submenu */}
            <li>
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  settingsOpen || pathname?.startsWith("/configuracion")
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100",
                )}
              >
                <div className="flex items-center">
                  <Settings className="mr-3 h-5 w-5" />
                  Configuración
                </div>
                {settingsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>

              {settingsOpen && (
                <ul className="mt-1 space-y-1 pl-10">
                  <li>
                    <Link
                      href="/configuracion/preguntas"
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive("/configuracion/preguntas")
                          ? "bg-primary/80 text-white"
                          : "text-gray-700 hover:bg-gray-100",
                      )}
                      onClick={onClose}
                    >
                      <FileText className="mr-3 h-4 w-4" />
                      Preguntas
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Administrative Submenu */}
            <li>
              <button
                onClick={() => setAdminOpen(!adminOpen)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  adminOpen || pathname?.startsWith("/administrativo")
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100",
                )}
              >
                <div className="flex items-center">
                  <School className="mr-3 h-5 w-5" />
                  Administrativo
                </div>
                {adminOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>

              {adminOpen && (
                <ul className="mt-1 space-y-1 pl-10">
                  <li>
                    <Link
                      href="/administrativo/docentes"
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive("/administrativo/docentes")
                          ? "bg-primary/80 text-white"
                          : "text-gray-700 hover:bg-gray-100",
                      )}
                      onClick={onClose}
                    >
                      <School className="mr-3 h-4 w-4" />
                      Docentes
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>

          <div className="mt-6 border-t pt-4">
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
        </nav>
      </div>
    </>
  )
}
