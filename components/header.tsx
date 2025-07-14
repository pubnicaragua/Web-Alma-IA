"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { removeAuthToken } from "@/lib/api-config";
import { useToast } from "@/hooks/use-toast";
import {
  fetchProfileData,
  type ProfileResponse,
} from "@/services/profile-service";
import { Skeleton } from "@/components/ui/skeleton";
import { getNotificationCount } from "@/services/header-service";

interface HeaderProps {
  toggleSidebar?: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [dataSchool, setDataSchool] = useState<any>({});

  const handleBellClick = () => {
    if (notificationCount > 0) {
      router.push("/alertas?notifications=true");
    }
  };

  useEffect(() => {
    setIsClient(true);
    loadUserProfile();
    loadNotifications();
    // Acceder a localStorage solo después de verificar que estamos en el cliente
    const schoolData =
      typeof window !== "undefined" ? localStorage.getItem("schoolData") : null;
    setDataSchool(schoolData ? JSON.parse(schoolData) : {});
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const data = await fetchProfileData();
      setProfileData(data);
    } catch (error) {
      console.error("Error al cargar el perfil del usuario:", error);
      setProfileData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      if (pathname !== "/select-school")
        router.push(`/alumnos?search=${searchTerm}`);
      else setIsSearching(true);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      toast({
        title: "Error",
        description:
          "No se pudo realizar la búsqueda. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
      setSearchTerm("");
    }
  };

  const loadNotifications = async () => {
    try {
      const count = await getNotificationCount();
      setNotificationCount(count);
    } catch (error) {
      console.error("Failed to load notifications:", error);
      setNotificationCount(0);
    }
  };

  const handleNavigateToProfile = () => {
    router.push("/perfil");
  };

  const handleChangeSchool = () => {
    router.push("/select-school");
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("selectedSchool");
      localStorage.removeItem("notificationsRead");
      localStorage.removeItem("notificationCount");
    }
    removeAuthToken();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
      variant: "default",
    });
    router.push("/login");
  };

  const getFullName = () => {
    if (!profileData) return "Usuario";

    const nombres = profileData.persona?.nombres || "";
    const apellidos = profileData.persona?.apellidos || "";

    if (nombres && apellidos) {
      return `${nombres} ${apellidos}`;
    } else if (nombres) {
      return nombres;
    } else if (apellidos) {
      return apellidos;
    } else {
      return profileData.usuario?.nombre_social || "Usuario";
    }
  };

  const getUserRole = () => {
    return profileData?.rol?.nombre || "Usuario";
  };

  const getUserImageUrl = () => {
    const url =
      profileData?.usuario?.url_foto_perfil || "/confident-businessman.png";
    return url.trim() || "/confident-businessman.png";
  };

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

      {/* Contenido del header */}
      <div
        className="relative z-10 w-full h-full flex items-center justify-between px-4 sm:px-8 lg:px-12"
        style={{ transform: "translateY(-10%)" }}
      >
        <div className="flex items-center gap-4 flex-shrink-0">
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
              <Image
                src="/logotipo.png"
                alt="AlmaIA Logo"
                width={128}
                height={40}
                className="h-full w-auto"
              />
            </div>
          </Link>
        </div>

        {pathname !== "/select-school" ? (
          <div className="flex items-center justify-between w-full max-w-2xl mx-4">
            <h2 className="hidden md:block text-xl font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis mr-4 min-w-[180px] max-w-[220px]">
              {dataSchool.name}
            </h2>

            <form
              onSubmit={handleSearch}
              className="relative flex-grow max-w-md"
            >
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search size={16} />
                )}
              </button>

              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar alumno..."
                className="w-full pl-10 border bg-white/90 rounded-md h-9 md:h-10 text-sm md:text-base"
                disabled={isSearching}
              />
            </form>
          </div>
        ) : null}

        <div className="flex items-center space-x-4 flex-shrink-0">
          {pathname !== "/select-school" ? (
            <div
              className={`relative ${
                isClient && notificationCount > 0
                  ? "cursor-pointer"
                  : "cursor-default"
              }`}
              onClick={handleBellClick}
            >
              <Bell className="text-white h-7 w-7 hidden sm:block" />
              {isClient && notificationCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </div>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-3 focus:outline-none">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/30 flex-shrink-0">
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
                <div className="text-white text-right hidden sm:block min-w-[120px]">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-4 w-28 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </>
                  ) : (
                    <>
                      <p className="text-base font-medium leading-tight">
                        {getFullName()}
                      </p>
                      <p className="text-sm text-white/80 leading-tight">
                        {getUserRole()}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleNavigateToProfile}>
                Mi perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleChangeSchool}>
                Cambiar colegio
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
