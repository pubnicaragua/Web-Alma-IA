"use client"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Bell, Mail, LogOut, School, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  toggleSidebar?: () => void
}

export function Header({ toggleSidebar }: HeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    // Eliminar datos de autenticación
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("selectedSchool")

    // Redirigir al login
    router.push("/login")
  }

  const handleChangeSchool = () => {
    // Redirigir a la selección de colegio
    router.push("/select-school")
  }

  return (
    <div className="w-full bg-primary">
      {/* Contenido del header */}
      <div className="w-full py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Botón de hamburguesa para móviles */}
          {toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className="text-white block md:hidden focus:outline-none"
              aria-label="Toggle navigation menu"
              type="button"
            >
              <Menu size={24} />
            </button>
          )}

          <Link href="/" className="flex items-center">
            <h1 className="text-4xl font-bold">
              <span className="text-white">Alma</span>
              <span className="text-pink-400">IA</span>
            </h1>
          </Link>
        </div>

        <div className="relative w-80 hidden md:block">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <Input type="text" placeholder="Buscar" className="pl-10 bg-white/90 border-0 rounded-md" />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-white/10">
            <Image
              src="/chilean-flag-waving.png"
              alt="Bandera de Chile"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          <Bell className="text-white h-5 w-5 hidden sm:block" />
          <Mail className="text-white h-5 w-5 hidden sm:block" />

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-3 focus:outline-none">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10">
                  <Image
                    src="/confident-businessman.png"
                    alt="Perfil de usuario"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-white text-right hidden sm:block">
                  <p className="text-sm font-medium">Emilio Aguilera</p>
                  <p className="text-xs">Rector</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <Link href="/perfil">
                <DropdownMenuItem>Mi perfil</DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={handleChangeSchool}>
                <School className="mr-2 h-4 w-4" />
                <span>Cambiar colegio</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
