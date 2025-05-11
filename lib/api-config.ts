import { dispatchAuthChangeEvent } from "./auth-events"

// API base URL para el proxy local
export const API_BASE_URL = "/api/proxy"

// Function to get the auth token
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

// Function to get the auth token from cookie
export const getAuthTokenFromCookie = (): string | null => {
  if (typeof window !== "undefined") {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim())
    const authCookie = cookies.find((cookie) => cookie.startsWith("auth_token="))
    if (authCookie) {
      const token = authCookie.split("=")[1]
      console.log("Token encontrado en cookie:", token.substring(0, 10) + "...")
      return token
    }
    return null
  }
  return null
}

// Function to set the auth token
export const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    try {
      // Guardar en localStorage
      localStorage.setItem("auth_token", token)

      // Guardar en cookies para que el middleware pueda detectarlo
      // Usar una fecha de expiración explícita en lugar de max-age para mayor compatibilidad
      const expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + 30) // 30 días

      document.cookie = `auth_token=${token}; path=/; expires=${expirationDate.toUTCString()}; SameSite=Lax`

      console.log("Token guardado correctamente:")
      console.log("- En localStorage:", token.substring(0, 10) + "...")
      console.log("- En cookie con expiración:", expirationDate.toUTCString())

      // Verificar que se haya guardado correctamente
      const storedToken = localStorage.getItem("auth_token")
      const cookieToken = getAuthTokenFromCookie()

      console.log("Verificación después de guardar:")
      console.log("- Token en localStorage:", storedToken ? "Presente" : "No presente")
      console.log("- Token en cookie:", cookieToken ? "Presente" : "No presente")

      // Notificar el cambio de autenticación
      dispatchAuthChangeEvent(true)
    } catch (error) {
      console.error("Error al guardar el token:", error)
    }
  }
}

// Function to remove the auth token (for logout)
export const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    try {
      // Eliminar de localStorage
      localStorage.removeItem("auth_token")

      // Eliminar de cookies - usar una fecha en el pasado
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax"

      console.log("Token eliminado correctamente")

      // Verificar que se haya eliminado correctamente
      const storedToken = localStorage.getItem("auth_token")
      const cookieToken = getAuthTokenFromCookie()

      console.log("Verificación después de eliminar:")
      console.log("- Token en localStorage:", storedToken ? "Presente" : "No presente")
      console.log("- Token en cookie:", cookieToken ? "Presente" : "No presente")

      // Notificar el cambio de autenticación
      dispatchAuthChangeEvent(false)
    } catch (error) {
      console.error("Error al eliminar el token:", error)
    }
  }
}

// Function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAuthToken()
  const cookieToken = getAuthTokenFromCookie()
  const isAuth = !!token || !!cookieToken
  console.log(`isAuthenticated check: ${isAuth ? "Autenticado" : "No autenticado"}`)
  console.log(`- localStorage token: ${token ? "Presente" : "No presente"}`)
  console.log(`- cookie token: ${cookieToken ? "Presente" : "No presente"}`)
  return isAuth
}

// Helper function to make authenticated API requests
export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken()
  const method = options.method || "GET"

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  // Asegurar que el endpoint comience con /
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`

  console.log(`Enviando solicitud ${method} a ${API_BASE_URL}${normalizedEndpoint}`)

  try {
    const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
      ...options,
      method,
      headers,
    })

    // Si recibimos un 401 Unauthorized, podría ser que el token expiró
    if (response.status === 401) {
      console.error("Error de autenticación: Token inválido o expirado")
      // Aquí podrías implementar lógica para manejar tokens expirados
    }

    return response
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

// Simple fetch without auth
export const fetchApi = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const method = options.method || "GET"

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  // Asegurar que el endpoint comience con /
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`

  try {
    const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
      ...options,
      method,
      headers,
    })

    return response
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}
