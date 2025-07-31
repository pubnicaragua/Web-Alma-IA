import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Definir rutas públicas que no requieren autenticación
  const publicPaths = ["/login", "/contact"];

  // Permitir acceso inmediato a rutas públicas
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  // Obtener token de autenticación de cookies
  const token = request.cookies.get("auth_token")?.value || "";
  const isAuthenticated = !!token;

  // Si intenta acceder a "/" sin estar autenticado, redirigir a login
  if (path === "/" && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si está autenticado e intenta acceder a login, redirigir a "/"
  if (path === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Para cualquier otra ruta, permitir acceso
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/contact"],
};
