"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { Bell, Mail, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { removeAuthToken } from "@/lib/api-config"
import { useToast } from "@/hooks/use-toast"
import { fetchProfileData, type ProfileResponse } from "@/services/profile-service"
import { Skeleton } from "@/components/ui/skeleton"
import { getNotificationCount } from "@/services/header-service"

interface HeaderProps {
  toggleSidebar?: () => void
}

export function Header({ toggleSidebar }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notificationCount, setNotificationCount] = useState(() => {
    // Inicializar desde localStorage si existe, de lo contrario 0
    if (typeof window !== 'undefined') {
      const storedCount = localStorage.getItem('notificationCount')
      return storedCount ? parseInt(storedCount, 10) : 0
    }
    return 0
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleBellClick = () => {
    if (notificationCount > 0) {
      router.push('/alertas?notifications=true')
      // Usamos window.location.pathname en lugar de usePathname
      // if (typeof window !== 'undefined' && window.location.pathname === '/alertas') {
      //   // Si ya estamos en la ruta /alertas, solo reiniciamos el contador
      //   setNotificationCount(0)
      //   // Marcamos las notificaciones como leídas en el localStorage
      //   localStorage.setItem('notificationsRead', 'true')
      //   localStorage.setItem('notificationCount', '0')
      // } else {
      //   // Si no estamos en /alertas, navegamos y luego reiniciamos el contador
      //   router.push('/alertas')
      //   setNotificationCount(0)
      //   // Marcamos las notificaciones como leídas en el localStorage
      //   localStorage.setItem('notificationsRead', 'true')
      //   localStorage.setItem('notificationCount', '0')
      // }
    }
  }

  useEffect(() => {
    loadUserProfile()
    loadNotifications()
  }, [])

  const loadUserProfile = async () => {
    try {
      setIsLoading(true)
      const data = await fetchProfileData()
      console.log(data)
      setProfileData(data)
      console.log("Perfil de usuario cargado:", data)
    } catch (error) {
      console.error("Error al cargar el perfil del usuario:", error)
      setProfileData(null)
    } finally {
      setIsLoading(false)
    }
  }


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    try {

      if (pathname !== '/select-school')
        router.push(`/alumnos?search=${searchTerm}`)
      else
        setIsSearching(true)


    } catch (error) {
      console.error('Error en la búsqueda:', error)
      toast({
        title: "Error",
        description: "No se pudo realizar la búsqueda. Por favor, intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
      setSearchTerm('')
    }
  }

  const loadNotifications = async () => {
    try {
      // Solo cargar notificaciones si no las hemos marcado como leídas
      if (typeof window !== 'undefined' && !localStorage.getItem('notificationsRead')) {
        const count = await getNotificationCount()
        console.log("Conteo de notificaciones cargado:", count)
        setNotificationCount(count)
        if (count > 0) {
          localStorage.setItem('notificationsRead', 'false')
          localStorage.setItem('notificationCount', count.toString())
        }
        // console.log("Conteo de notificaciones cargado:", count)
      }
    } catch (error) {
      console.error('Failed to load notifications:', error)
      setNotificationCount(0)
    }
  }



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
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated")
      localStorage.removeItem("selectedSchool")
      localStorage.removeItem("notificationsRead")
      localStorage.removeItem("notificationCount")
    }

    // Remove auth token
    removeAuthToken()

    // Show logout toast
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
      variant: "default",
    })

    // Redirigir al login
    router.push("/login")
  }

  // Obtener el nombre completo del usuario
  const getFullName = () => {
    if (!profileData) return "Usuario"

    const nombres = profileData.persona?.nombres || ""
    const apellidos = profileData.persona?.apellidos || ""

    if (nombres && apellidos) {
      return `${nombres} ${apellidos}`
    } else if (nombres) {
      return nombres
    } else if (apellidos) {
      return apellidos
    } else {
      // Si no hay nombres ni apellidos, intentar usar nombre_social
      return profileData.usuario?.nombre_social || "Usuario"
    }
  }

  // Obtener el rol del usuario
  const getUserRole = () => {
    return profileData?.rol?.nombre || "Usuario"
  }

  // Obtener la URL de la imagen del usuario
  const getUserImageUrl = () => {
    return profileData?.usuario?.url_foto_perfil || "/confident-businessman.png"
  }

  return (
    <header className="w-full relative h-[100px]">
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

      {/* Contenido del header - desplazado hacia arriba pero menos que antes */}
      <div
        className="relative z-10 w-full h-full flex items-center justify-between px-3 sm:px-6"
        style={{ transform: "translateY(-10%)" }}
      >
        <div className="flex items-center gap-4">
          {/* Botón de hamburguesa para móviles */}
          {toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className="text-white block md:hidden focus:outline-none p-2 ml-1"
              aria-label="Toggle navigation menu"
              type="button"
            >
              <Menu size={28} />
            </button>
          )}

          <Link href="/" className="flex items-center">
            <div className="h-10 w-auto mr-2">
              <Image src="/almaiaa.svg" alt="AlmaIA Logo" width={128} height={40} className="h-full w-auto" />
            </div>
          </Link>
        </div>

        {/* Barra de búsqueda - ahora visible en móvil */}
        <form onSubmit={handleSearch} className="relative w-40 sm:w-60 md:w-80">
          <button
            type="submit"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            disabled={isSearching}
          >
            {isSearching ? (
              <div className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
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
            )}
          </button>
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar alumno..."
            className="pl-8 border bg-white/90 rounded-md h-7 md:h-8 text-xs md:text-sm"
            disabled={isSearching}
          />

        </form>

        <div className="flex items-center space-x-4">
          <div
            className={`relative ${notificationCount > 0 ? 'cursor-pointer' : 'cursor-default'}`}
            onClick={handleBellClick}
          >
            <Bell className="text-white h-7 w-7 hidden sm:block" />
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </div>
          {/* <Mail className="text-white h-5 w-5 hidden sm:block" /> */}

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-3 focus:outline-none">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-white/30 flex-shrink-0">
                  {isLoading ? (
                    <Skeleton className="w-full h-full rounded-full" />
                  ) : (
                    <Image
                      src={getUserImageUrl() || "/placeholder.svg"}
                      alt="Perfil de usuario"
                      width={45}
                      height={45}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="text-white text-right hidden sm:block">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </>
                  ) : (
                    <>
                      <p className="text-base font-medium">{getFullName()}</p>
                      <p className="text-sm text-white/80">{getUserRole()}</p>
                    </>
                  )}
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
