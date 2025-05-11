import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname

  // Get the token from cookies
  const token = request.cookies.get("auth_token")?.value || ""
  const isAuthenticated = !!token

  console.log(`Middleware: Acceso a ruta ${path}, isAuthenticated=${isAuthenticated}`)

  // Si es la ruta raíz y el usuario no está autenticado, redirigir a /login
  if (path === "/" && !isAuthenticated) {
    console.log("Middleware: Redirigiendo de / a /login porque no hay token")
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Si el usuario está autenticado y trata de acceder a /login, redirigir a /
  if (path === "/login" && isAuthenticated) {
    console.log("Middleware: Redirigiendo de /login a / porque hay token")
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Permitir todas las demás solicitudes sin verificación
  return NextResponse.next()
}

// Configurar el middleware para que se ejecute en las rutas relevantes
export const config = {
  matcher: ["/", "/login"],
}
