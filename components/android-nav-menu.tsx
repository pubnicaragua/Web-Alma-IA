"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Users, Bell, BarChart2, FileText, User, Settings, ChevronDown, School, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AndroidNavMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function AndroidNavMenu({ isOpen, onClose }: AndroidNavMenuProps) {
  const pathname = usePathname()
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Cerrar el menú cuando cambia la ruta
  React.useEffect(() => {
    if (isOpen && pathname) {
      onClose()
    }
  }, [pathname, isOpen, onClose])

  // Cerrar el menú cuando se hace clic fuera de él
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && isOpen) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Bloquear el scroll cuando el menú está abierto
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay oscuro */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Menú de navegación */}
      <div
        ref={menuRef}
        className="relative w-[85%] max-w-[320px] bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-out"
        style={{
          animation: isOpen ? "scaleIn 0.2s ease-out forwards" : "none",
        }}
      >
        {/* Header del menú */}
        <div className="flex items-center justify-between p-4 border-b bg-primary">
          <div className="flex items-center">
            <School className="h-6 w-6 text-white mr-2" />
            <h2 className="text-xl font-bold text-white">Alma IA</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white hover:bg-white/20 focus:outline-none"
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido del menú */}
        <div className="max-h-[70vh] overflow-y-auto p-2">
          <nav>
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors",
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
                <details className={cn(pathname?.startsWith("/configuracion") && "open")}>
                  <summary
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between rounded-md px-4 py-3 text-sm font-medium transition-colors list-none",
                      pathname?.startsWith("/configuracion")
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    <div className="flex items-center">
                      <Settings className="mr-3 h-5 w-5" />
                      Configuración
                    </div>
                    <ChevronDown className="h-4 w-4 transition-transform ui-open:rotate-180" />
                  </summary>
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
                </details>
              </li>

              {/* Administrative Submenu */}
              <li>
                <details className={cn(pathname?.startsWith("/administrativo") && "open")}>
                  <summary
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between rounded-md px-4 py-3 text-sm font-medium transition-colors list-none",
                      pathname?.startsWith("/administrativo")
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    <div className="flex items-center">
                      <School className="mr-3 h-5 w-5" />
                      Administrativo
                    </div>
                    <ChevronDown className="h-4 w-4 transition-transform ui-open:rotate-180" />
                  </summary>
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
                </details>
              </li>
            </ul>
          </nav>
        </div>

        {/* Footer del menú */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
              <User className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Emilio Aguilera</p>
              <p className="text-xs text-gray-500">Rector</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
