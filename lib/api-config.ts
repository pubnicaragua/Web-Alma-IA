// API base URL from environment variable - asegurando que no haya barras duplicadas
const getBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-almaia.onrender.com/api/v1"
  // Eliminar la barra final si existe para evitar dobles barras
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl
}

export const API_BASE_URL = getBaseUrl()

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

// Helper function to log API requests and responses
const logApiCall = (endpoint: string, method: string, requestData?: any, responseData?: any, error?: any) => {
  console.group(`🌐 API Call: ${method} ${endpoint}`)
  console.log(`📤 Request: ${method} ${API_BASE_URL}${endpoint}`)

  if (requestData) {
    console.log("📦 Request Data:", requestData)
  }

  if (responseData) {
    console.log("📥 Response:", responseData)
  }

  if (error) {
    console.error("❌ Error:", error)
  }

  console.groupEnd()
}

// Helper function to make authenticated API requests with logging
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

  // Log the request
  let requestBody
  try {
    requestBody = options.body ? JSON.parse(String(options.body)) : undefined
  } catch (e) {
    requestBody = options.body
  }

  logApiCall(normalizedEndpoint, method, requestBody)

  try {
    const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
      ...options,
      method,
      headers,
    })

    // Clone the response to read it twice (once for logging, once for the caller)
    const responseClone = response.clone()

    try {
      // Try to parse as JSON for logging
      const responseData = await responseClone.json()
      logApiCall(normalizedEndpoint, method, requestBody, responseData)
    } catch (e) {
      // If not JSON, log the status
      logApiCall(normalizedEndpoint, method, requestBody, {
        status: response.status,
        statusText: response.statusText,
      })
    }

    return response
  } catch (error) {
    // Log any network errors
    logApiCall(normalizedEndpoint, method, requestBody, undefined, error)
    throw error
  }
}

// Simple fetch without auth but with logging
export const fetchApi = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const method = options.method || "GET"

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  // Asegurar que el endpoint comience con /
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`

  // Log the request
  let requestBody
  try {
    requestBody = options.body ? JSON.parse(String(options.body)) : undefined
  } catch (e) {
    requestBody = options.body
  }

  logApiCall(normalizedEndpoint, method, requestBody)

  try {
    const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
      ...options,
      method,
      headers,
    })

    // Clone the response to read it twice
    const responseClone = response.clone()

    try {
      // Try to parse as JSON for logging
      const responseData = await responseClone.json()
      logApiCall(normalizedEndpoint, method, requestBody, responseData)
    } catch (e) {
      // If not JSON, log the status
      logApiCall(normalizedEndpoint, method, requestBody, {
        status: response.status,
        statusText: response.statusText,
      })
    }

    return response
  } catch (error) {
    // Log any network errors
    logApiCall(normalizedEndpoint, method, requestBody, undefined, error)
    throw error
  }
}
