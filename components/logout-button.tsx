"use client"

import { Button } from "@/components/ui/button"
import { removeAuthToken } from "@/lib/api-config"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    // Eliminar el token
    removeAuthToken()

    // Redirigir al login
    router.push("/login")
  }

  return (
    <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
      <LogOut size={16} />
      <span>Cerrar sesión</span>
    </Button>
  )
}
