import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname;

  // Get the token from cookies
  const token = request.cookies.get("auth_token")?.value || "";

  const isAuthenticated = !!token;

  console.log(
    `Middleware: Acceso a ruta ${path}, isAuthenticated=${isAuthenticated}`
  );
  if (path === "/" && !isAuthenticated) {
    console.log("Middleware: Redirigiendo de / a /login porque no hay token");
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (path === "/login" && isAuthenticated) {
    console.log("Middleware: Redirigiendo de /login a / porque hay token");

    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login"],
};
