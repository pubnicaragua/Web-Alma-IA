// API base URL para el proxy local
export const API_BASE_URL = "/api/proxy"

// Function to get the auth token
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

// Function to set the auth token
export const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)
  }
}

// Function to remove the auth token (for logout)
export const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
  }
}

// Function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
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

  console.log(`Enviando solicitud ${method} a ${API_BASE_URL}${normalizedEndpoint}`, {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token.substring(0, 10)}...` : "No token",
    },
  })

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
