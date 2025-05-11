"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"
import { isAuthenticated, removeAuthToken } from "@/lib/api-config"
import { subscribeToAuthChanges } from "@/lib/auth-events"

type AuthContextType = {
  isAuthenticated: boolean
  logout: () => void
  checkAuth: () => boolean
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  logout: () => {},
  checkAuth: () => false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(false)
  // Usar useRef para evitar múltiples verificaciones
  const initialCheckDone = useRef(false)

  const checkAuth = () => {
    // Evitar verificaciones innecesarias
    if (initialCheckDone.current) {
      console.log("AuthProvider.checkAuth: Verificación ya realizada anteriormente")
      return isAuth
    }

    const authStatus = isAuthenticated()
    console.log(`AuthProvider.checkAuth: isAuthenticated = ${authStatus}`)
    setIsAuth(authStatus)
    initialCheckDone.current = true
    return authStatus
  }

  useEffect(() => {
    // Verificar autenticación inicial solo una vez
    if (!initialCheckDone.current) {
      console.log("AuthProvider: Initial authentication check")
      checkAuth()
    }

    // Suscribirse a cambios de autenticación
    const unsubscribe = subscribeToAuthChanges((newAuthStatus) => {
      console.log(`AuthProvider: Auth change event received, isAuthenticated = ${newAuthStatus}`)
      setIsAuth(newAuthStatus)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const logout = () => {
    console.log("AuthProvider.logout: Logging out")
    removeAuthToken()
    setIsAuth(false)
    // No redirigir automáticamente
    console.log("Logout completado. No se redirige automáticamente.")
  }

  return <AuthContext.Provider value={{ isAuthenticated: isAuth, logout, checkAuth }}>{children}</AuthContext.Provider>
}
