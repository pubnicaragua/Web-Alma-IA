"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { API_BASE_URL, setAuthToken } from "@/lib/api-config"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [apiUrl, setApiUrl] = useState("")

  // Mostrar la URL de la API para depuración
  useEffect(() => {
    setApiUrl(API_BASE_URL)
    console.log("API Base URL:", API_BASE_URL)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Por favor, completa todos los campos")
      return
    }

    try {
      setIsLoading(true)

      // Construir la URL completa para el endpoint de login
      const loginUrl = `${API_BASE_URL}/auth/login`
      console.log("URL completa de login:", loginUrl)

      // Preparar los datos de la solicitud
      const loginData = { email, password }
      console.log("Datos de login:", loginData)

      // Make API request to login endpoint - Usando fetch directamente para mayor control
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Añadir modo no-cors para pruebas
          // "Access-Control-Allow-Origin": "*"
        },
        // mode: "no-cors", // Intentar con no-cors para depuración
        body: JSON.stringify(loginData),
      }).catch((fetchError) => {
        console.error("Error de fetch:", fetchError)
        throw new Error(`Error de red: ${fetchError.message}`)
      })

      console.log("Respuesta recibida:", response.status, response.statusText)

      // Intentar obtener el cuerpo de la respuesta
      let data
      try {
        data = await response.json()
        console.log("Datos de respuesta:", data)
      } catch (err) {
        console.error("Error al parsear la respuesta:", err)
        throw new Error("Error al procesar la respuesta del servidor")
      }

      if (!response.ok) {
        // Handle API error
        throw new Error(data?.message || "Error al iniciar sesión")
      }

      // Store the token
      setAuthToken(data.token)

      // Set authenticated flag
      if (typeof window !== "undefined") {
        localStorage.setItem("isAuthenticated", "true")
      }

      // Show success toast
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al sistema",
        variant: "default",
      })

      // Redirect to school selection
      router.push("/select-school")
    } catch (err) {
      console.error("Error en el proceso de login:", err)
      const errorMessage = err instanceof Error ? err.message : "Ocurrió un error. Por favor, inténtalo de nuevo."

      setError(errorMessage)

      // Show error toast
      toast({
        title: "Error de inicio de sesión",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Función para probar la conectividad con la API
  const testApiConnection = async () => {
    try {
      console.log("Probando conectividad con:", API_BASE_URL)
      const response = await fetch(API_BASE_URL, { method: "GET" })
      console.log("Respuesta de prueba:", response.status, response.statusText)
      toast({
        title: "Prueba de API",
        description: `Conexión exitosa: ${response.status} ${response.statusText}`,
        variant: "default",
      })
    } catch (err) {
      console.error("Error de conectividad:", err)
      toast({
        title: "Error de conectividad",
        description: err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="bg-white rounded-lg p-8 shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Inicia sesión</h1>

      {error && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">{error}</div>}

      {/* Información de depuración */}
      <div className="mb-4 text-xs text-gray-500">
        <p>API URL: {apiUrl}</p>
        <button onClick={testApiConnection} className="text-blue-500 underline mt-1" type="button">
          Probar conectividad
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Correo electrónico o usuario"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2 relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm">
              Recuérdame
            </Label>
          </div>

          <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <div className="border rounded-md p-3 flex items-center space-x-3">
          <Checkbox id="captcha" />
          <Label htmlFor="captcha">No soy un robot</Label>
          <div className="ml-auto">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="4" fill="#F0F0F0" />
              <path d="M12 6V18" stroke="#A0A0A0" strokeWidth="2" strokeLinecap="round" />
              <path d="M6 12H18" stroke="#A0A0A0" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600" disabled={isLoading}>
          {isLoading ? "Iniciando sesión..." : "Ingresar"}
        </Button>
      </form>
    </div>
  )
}
