"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Por favor, completa todos los campos")
      return
    }

    try {
      setIsLoading(true)

      // Verificar credenciales de prueba
      if (email === "user" && password === "user") {
        // Simular un pequeño retraso
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Guardar estado de autenticación
        localStorage.setItem("isAuthenticated", "true")

        // Redirigir a la selección de colegio
        router.push("/select-school")
      } else {
        setError("Credenciales incorrectas. Usa user/user para iniciar sesión.")
      }
    } catch (err) {
      setError("Ocurrió un error. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg p-8 shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Inicia sesión</h1>

      {error && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input type="text" placeholder="Usuario" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
