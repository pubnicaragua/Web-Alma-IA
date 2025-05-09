import { type NextRequest, NextResponse } from "next/server"

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-almaia.onrender.com/api/v1"

// Función auxiliar para normalizar la URL
const getApiUrl = (path: string[]) => {
  const pathStr = path.join("/")
  const baseUrl = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL
  return `${baseUrl}/${pathStr}`
}

// Función para manejar errores de manera consistente
const handleApiError = (error: unknown, path: string) => {
  console.error(`Error en proxy API (${path}):`, error)

  // Determinar el tipo de error para dar una respuesta más específica
  if (error instanceof TypeError && error.message.includes("fetch")) {
    console.error("Error de conexión. Detalles:", {
      API_BASE_URL,
      path,
      error: error.message,
      stack: error.stack,
    })
    return NextResponse.json(
      { error: "No se pudo conectar con el servidor API. Por favor, inténtelo más tarde." },
      { status: 503 },
    )
  }

  return NextResponse.json({ error: "Error interno del servidor al procesar la solicitud." }, { status: 500 })
}

// Implementación alternativa usando XMLHttpRequest para el login
// Esta función simula el login para pruebas
async function simulateLogin(email: string, password: string) {
  console.log("Simulando login con:", { email, password })

  // Para pruebas, aceptamos cualquier combinación de usuario/contraseña
  return {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlVzdWFyaW8gZGUgUHJ1ZWJhIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  }
}

// Función para simular datos de alertas recientes
async function simulateRecentAlerts() {
  return [
    {
      student: {
        name: "Carolina Espina",
        image: "/smiling-woman-garden.png",
      },
      alertType: "SOS Alma",
      date: "Abr 02 - 2024",
    },
    {
      student: {
        name: "Jaime Brito",
        image: "/young-man-city.png",
      },
      alertType: "Denuncias",
      date: "Mar 29 - 2024",
    },
    {
      student: {
        name: "Teresa Ulloa",
        image: "/smiling-woman-garden.png",
      },
      alertType: "IA",
      date: "Mar 27 - 2024",
    },
    {
      student: {
        name: "Carlos Araneda",
        image: "/young-man-city.png",
      },
      alertType: "SOS Alma",
      date: "Mar 26 - 2024",
    },
  ]
}

// Función para simular datos de fechas importantes
async function simulateImportantDates() {
  return [
    { event: "Pruebas Parciales", dateRange: "Abr 02 - Abr 07" },
    { event: "Reunión de Apoderados", dateRange: "Abr 10 - Abr 12" },
    { event: "Matrícula 2025", dateRange: "Abr 15 - Abr 20" },
    { event: "Semana santa", dateRange: "Abr 21 - Abr 28" },
    { event: "Exámenes Finales", dateRange: "May 02 - May 10" },
    { event: "Vacaciones de Invierno", dateRange: "Jul 15 - Jul 30" },
    { event: "Fiestas Patrias", dateRange: "Sep 15 - Sep 20" },
  ]
}

// Función para simular datos de alertas totales
async function simulateTotalAlerts() {
  return [
    { label: "10 Pendientes", value: 10, percentage: "22.8%", color: "#facc15" },
    { label: "07 Nuevos", value: 7, percentage: "13.9%", color: "#22c55e" },
    { label: "39 Atendidos", value: 39, percentage: "52.1%", color: "#3b82f6" },
    { label: "05 Aplazados", value: 5, percentage: "11.2%", color: "#a855f7" },
  ]
}

// Función para simular datos de emociones
async function simulateEmotions() {
  return [
    { name: "Tristeza", value: 2000, color: "#3b82f6" },
    { name: "Felicidad", value: 4000, color: "#facc15" },
    { name: "Estrés", value: 1800, color: "#6b7280" },
    { name: "Ansiedad", value: 3200, color: "#fb923c" },
    { name: "Enojo", value: 1200, color: "#ef4444" },
    { name: "Otros", value: 2800, color: "#a855f7" },
  ]
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join("/")
    const apiUrl = getApiUrl(params.path)
    console.log(`Proxy GET request to: ${apiUrl}`)

    // Obtener el token de autorización de la solicitud
    const authHeader = request.headers.get("authorization")

    // Simular datos para desarrollo
    if (process.env.NODE_ENV === "development") {
      // Simular datos de alertas recientes
      if (path === "home/alertas/recientes") {
        console.log("Usando simulación de alertas recientes para desarrollo")
        const alertsData = await simulateRecentAlerts()
        return NextResponse.json(alertsData, { status: 200 })
      }

      // Simular datos de fechas importantes
      if (path === "home/fechas-importantes") {
        console.log("Usando simulación de fechas importantes para desarrollo")
        const datesData = await simulateImportantDates()
        return NextResponse.json(datesData, { status: 200 })
      }

      // Simular datos de alertas totales
      if (path === "home/alertas/totales") {
        console.log("Usando simulación de alertas totales para desarrollo")
        const totalAlertsData = await simulateTotalAlerts()
        return NextResponse.json(totalAlertsData, { status: 200 })
      }

      // Simular datos de emociones
      if (path === "home/emotions/general") {
        console.log("Usando simulación de emociones para desarrollo")
        const emotionsData = await simulateEmotions()
        return NextResponse.json(emotionsData, { status: 200 })
      }
    }

    // Preparar headers para la solicitud a la API externa
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    // Añadir el header de autorización si existe
    if (authHeader) {
      headers["Authorization"] = authHeader
    } else {
      console.warn("No se proporcionó token de autorización para la solicitud GET a:", path)
      // Para desarrollo, podemos continuar sin token, pero en producción podríamos querer rechazar la solicitud
      if (process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "Se requiere autenticación" }, { status: 401 })
      }
    }

    const response = await fetch(apiUrl, {
      method: "GET",
      headers,
      // Añadir un timeout para evitar que la solicitud se quede colgada
      signal: AbortSignal.timeout(10000), // 10 segundos de timeout
    })

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      // Intentar leer el cuerpo de la respuesta como texto
      const errorText = await response.text()
      console.error(`Error en respuesta API (${path}):`, {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })

      // Si estamos en desarrollo, usar datos simulados para ciertos endpoints
      if (process.env.NODE_ENV === "development") {
        if (path === "home/alertas/recientes") {
          console.log("Usando simulación de alertas recientes después de error")
          const alertsData = await simulateRecentAlerts()
          return NextResponse.json(alertsData, { status: 200 })
        }

        if (path === "home/fechas-importantes") {
          console.log("Usando simulación de fechas importantes después de error")
          const datesData = await simulateImportantDates()
          return NextResponse.json(datesData, { status: 200 })
        }

        if (path === "home/alertas/totales") {
          console.log("Usando simulación de alertas totales después de error")
          const totalAlertsData = await simulateTotalAlerts()
          return NextResponse.json(totalAlertsData, { status: 200 })
        }

        if (path === "home/emotions/general") {
          console.log("Usando simulación de emociones después de error")
          const emotionsData = await simulateEmotions()
          return NextResponse.json(emotionsData, { status: 200 })
        }
      }

      // Devolver un error formateado
      return NextResponse.json(
        { error: errorText || response.statusText || "Error en la solicitud" },
        { status: response.status },
      )
    }

    // Intentar parsear la respuesta como JSON
    try {
      const data = await response.json()
      console.log(`Proxy GET response from ${apiUrl}:`, data)
      return NextResponse.json(data, { status: response.status })
    } catch (error) {
      // Si no es JSON, devolver el texto
      const textData = await response.text()
      console.log(`Proxy GET response from ${apiUrl} (text):`, textData)
      return new NextResponse(textData, {
        status: response.status,
        headers: { "Content-Type": "text/plain" },
      })
    }
  } catch (error) {
    return handleApiError(error, params.path.join("/"))
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join("/")

    // Verificar si es una solicitud de login
    const isLoginRequest = path === "auth/login"

    // Obtener el cuerpo de la solicitud
    const body = await request.json().catch((e) => {
      console.error("Error al parsear el cuerpo de la solicitud:", e)
      return {}
    })

    const apiUrl = getApiUrl(params.path)
    console.log(`Proxy POST request to: ${apiUrl}`, body)

    // Si es login y estamos en modo de desarrollo, usar la simulación
    if (isLoginRequest && process.env.NODE_ENV === "development") {
      console.log("Usando simulación de login para desarrollo")
      const { email, password } = body
      const loginData = await simulateLogin(email, password)

      return NextResponse.json(loginData, { status: 200 })
    }

    // Obtener el token de autorización de la solicitud (excepto para login)
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (!isLoginRequest) {
      const authHeader = request.headers.get("authorization")
      if (authHeader) {
        headers["Authorization"] = authHeader
      } else {
        console.warn("No se proporcionó token de autorización para la solicitud POST a:", path)
        // Para desarrollo, podemos continuar sin token, pero en producción podríamos querer rechazar la solicitud
        if (process.env.NODE_ENV !== "development") {
          return NextResponse.json({ error: "Se requiere autenticación" }, { status: 401 })
        }
      }
    }

    // Realizar la solicitud a la API externa
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      // Añadir un timeout para evitar que la solicitud se quede colgada
      signal: AbortSignal.timeout(10000), // 10 segundos de timeout
    })

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      // Intentar leer el cuerpo de la respuesta como texto
      const errorText = await response.text()
      console.error(`Error en respuesta API (${path}):`, {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })

      // Devolver un error formateado
      return NextResponse.json(
        { error: errorText || response.statusText || "Error en la solicitud" },
        { status: response.status },
      )
    }

    // Intentar parsear la respuesta como JSON
    try {
      const data = await response.json()
      console.log(`Proxy POST response from ${apiUrl}:`, data)
      return NextResponse.json(data, { status: response.status })
    } catch (error) {
      // Si no es JSON, devolver el texto
      const textData = await response.text()
      console.log(`Proxy POST response from ${apiUrl} (text):`, textData)
      return new NextResponse(textData, {
        status: response.status,
        headers: { "Content-Type": "text/plain" },
      })
    }
  } catch (error) {
    return handleApiError(error, params.path.join("/"))
  }
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join("/")
    const body = await request.json().catch(() => ({}))
    const apiUrl = getApiUrl(params.path)

    console.log(`Proxy PUT request to: ${apiUrl}`, body)

    // Obtener el token de autorización de la solicitud
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    const authHeader = request.headers.get("authorization")
    if (authHeader) {
      headers["Authorization"] = authHeader
    } else {
      console.warn("No se proporcionó token de autorización para la solicitud PUT a:", path)
      // Para desarrollo, podemos continuar sin token, pero en producción podríamos querer rechazar la solicitud
      if (process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "Se requiere autenticación" }, { status: 401 })
      }
    }

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    })

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      // Intentar leer el cuerpo de la respuesta como texto
      const errorText = await response.text()
      console.error(`Error en respuesta API (${path}):`, {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })

      // Devolver un error formateado
      return NextResponse.json(
        { error: errorText || response.statusText || "Error en la solicitud" },
        { status: response.status },
      )
    }

    // Intentar parsear la respuesta como JSON
    try {
      const data = await response.json()
      console.log(`Proxy PUT response from ${apiUrl}:`, data)
      return NextResponse.json(data, { status: response.status })
    } catch (error) {
      // Si no es JSON, devolver el texto
      const textData = await response.text()
      console.log(`Proxy PUT response from ${apiUrl} (text):`, textData)
      return new NextResponse(textData, {
        status: response.status,
        headers: { "Content-Type": "text/plain" },
      })
    }
  } catch (error) {
    return handleApiError(error, params.path.join("/"))
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join("/")
    const apiUrl = getApiUrl(params.path)
    console.log(`Proxy DELETE request to: ${apiUrl}`)

    // Obtener el token de autorización de la solicitud
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    const authHeader = request.headers.get("authorization")
    if (authHeader) {
      headers["Authorization"] = authHeader
    } else {
      console.warn("No se proporcionó token de autorización para la solicitud DELETE a:", path)
      // Para desarrollo, podemos continuar sin token, pero en producción podríamos querer rechazar la solicitud
      if (process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "Se requiere autenticación" }, { status: 401 })
      }
    }

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers,
      signal: AbortSignal.timeout(10000),
    })

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      // Intentar leer el cuerpo de la respuesta como texto
      const errorText = await response.text()
      console.error(`Error en respuesta API (${path}):`, {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })

      // Devolver un error formateado
      return NextResponse.json(
        { error: errorText || response.statusText || "Error en la solicitud" },
        { status: response.status },
      )
    }

    // Intentar parsear la respuesta como JSON
    try {
      const data = await response.json()
      console.log(`Proxy DELETE response from ${apiUrl}:`, data)
      return NextResponse.json(data, { status: response.status })
    } catch (error) {
      // Si no es JSON, devolver el texto
      const textData = await response.text()
      console.log(`Proxy DELETE response from ${apiUrl} (text):`, textData)
      return new NextResponse(textData, {
        status: response.status,
        headers: { "Content-Type": "text/plain" },
      })
    }
  } catch (error) {
    return handleApiError(error, params.path.join("/"))
  }
}
