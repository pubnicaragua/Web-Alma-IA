import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname;

  // Get the token from cookies
  const token = request.cookies.get("auth_token")?.value || "";

  const isAuthenticated = !!token;

  if (path === "/" && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (path === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login"],
};
