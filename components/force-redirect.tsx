"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/api-config"

interface ForceRedirectProps {
  to: string
  condition?: boolean
}

export default function ForceRedirect({ to, condition = true }: ForceRedirectProps) {
  const router = useRouter()
  const [redirectAttempts, setRedirectAttempts] = useState(0)
  const [message, setMessage] = useState("Redirigiendo...")

  useEffect(() => {
    // Solo redirigir si la condición es verdadera
    if (!condition) {
      return
    }

    // Verificar autenticación antes de redirigir
    const isAuth = isAuthenticated()
    console.log(
      `ForceRedirect: Estado de autenticación antes de redirigir: ${isAuth ? "Autenticado" : "No autenticado"}`,
    )

    // Evitar bucles infinitos limitando los intentos de redirección
    if (redirectAttempts >= 3) {
      setMessage("Demasiados intentos de redirección. Por favor, haz clic en el enlace de abajo.")
      return
    }

    console.log(`ForceRedirect: Intento ${redirectAttempts + 1} de redirección a ${to}`)

    // Primer intento: usar el router de Next.js
    router.push(to)

    // Segundo intento: usar window.location después de un breve retraso
    const redirectTimer = setTimeout(() => {
      console.log(`ForceRedirect: Usando window.location para redirigir a ${to}`)
      window.location.href = to
      setRedirectAttempts((prev) => prev + 1)
    }, 1000)

    return () => clearTimeout(redirectTimer)
  }, [to, router, redirectAttempts, condition])

  // Función para forzar la redirección manualmente
  const handleManualRedirect = () => {
    console.log(`ForceRedirect: Redirección manual a ${to}`)
    window.location.href = to
  }

  if (!condition) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Redirigiendo</h2>
        <p className="mb-4">{message}</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        {redirectAttempts >= 2 && (
          <button
            onClick={handleManualRedirect}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Ir a {to}
          </button>
        )}
      </div>
    </div>
  )
}
