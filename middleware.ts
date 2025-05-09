import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/login" ||
    path === "/forgot-password" ||
    path.startsWith("/reset-password") ||
    path === "/reset-success" ||
    path === "/register"

  // Get the token from cookies
  const token = request.cookies.get("auth_token")?.value || ""

  // If the path is not public and there's no token, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the path is login and there's a token, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    "/",
    "/login",
    "/forgot-password",
    "/reset-password/:path*",
    "/reset-success",
    "/register",
    "/select-school",
    "/alumnos/:path*",
    "/alertas/:path*",
    "/comparativo",
    "/informes",
    "/perfil",
    "/administrativo/:path*",
    "/configuracion/:path*",
  ],
}
