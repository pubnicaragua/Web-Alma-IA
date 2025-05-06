"use client"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Bell, Mail, Menu } from "lucide-react"
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

  // Función para navegar al perfil del usuario
  const handleNavigateToProfile = () => {
    router.push("/perfil")
  }

  // Función para navegar a la selección de colegio
  const handleChangeSchool = () => {
    router.push("/select-school")
  }

  // Función para cerrar sesión
  const handleLogout = () => {
    // Eliminar datos de autenticación
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("selectedSchool")

    // Redirigir al login
    router.push("/login")
  }

  return (
    <header className="w-full relative h-[158px]">
      {/* Fondo SVG como imagen */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 158"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <g clipPath="url(#clip0_1640_1280)">
            <path
              d="M833.589 134.163C546.178 107.941 158.109 136.149 0 158V-62H1475V110.325C1380.95 129.196 1121 160.384 833.589 134.163Z"
              fill="#89C2F8"
            />
          </g>
          <defs>
            <clipPath id="clip0_1640_1280">
              <rect width="1440" height="158" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>

      {/* Contenido del header */}
      <div className="relative z-10 w-full h-full py-4 px-3 sm:px-6 flex items-center justify-between">
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
            <h1 className="text-3xl font-bold">
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
          <Input type="text" placeholder="Buscar" className="pl-10 border bg-white/90 rounded-md" />
        </div>

        <div className="flex items-center space-x-4">
          <Bell className="text-white h-5 w-5 hidden sm:block" />
          <Mail className="text-white h-5 w-5 hidden sm:block" />

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-3 focus:outline-none">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/30 flex-shrink-0">
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
                  <p className="text-xs text-white/80">Rector</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleNavigateToProfile}>Mi perfil</DropdownMenuItem>
              <DropdownMenuItem onClick={handleChangeSchool}>Cambiar colegio</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
