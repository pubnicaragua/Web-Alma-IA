"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { ProfileResponse } from "@/services/profile-service"
import { useAuth } from "@/components/auth-provider"
import { getAuthToken } from "./api-config"
// 1. Definición de tipos
export interface UserContextState {
  userData: ProfileResponse | null
  isLoading: boolean
  error: string | null
}

export interface UserContextActions {
  loadUserData: () => Promise<void>
  clearUserData: () => void
}

type UserContextType = UserContextState & UserContextActions

// 2. Valor inicial
const initialContextValue: UserContextType = {
  userData: null,
  isLoading: false,
  error: null,
  loadUserData: async () => {},
  clearUserData: () => {}
}

// 3. Creación del contexto
export const UserContext = createContext<UserContextType>(initialContextValue)

// 4. Hook personalizado
export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

// 5. Proveedor del contexto
interface UserProviderProps {
  children: React.ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const { isAuthenticated } = useAuth()
  const [state, setState] = useState({
    userData: null as ProfileResponse | null,
    isLoading: false,
    error: null as string | null
  })

  const loadUserData = useCallback(async () => {
    try {
      const token = getAuthToken()
      const options = {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'Content-Type': 'application/json'
        }
      };
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const response = await fetch('/api/proxy/perfil/obtener', options)
      
      const data = await response.json() as ProfileResponse
      
      setState(prev => ({ ...prev, userData: data }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Unknown error'
      }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
    
  }, [])

  const clearUserData = useCallback(() => {
    setState(prev => ({ ...prev, userData: null }))
  }, [])

  useEffect(() => {
    if (isAuthenticated && !state.userData) {
      loadUserData()
    }
  }, [isAuthenticated, state.userData, loadUserData])

  return (
    <UserContext.Provider
      value={{
        ...state,
        loadUserData,
        clearUserData
      }}
    >
      {children}
    </UserContext.Provider>
  )
}