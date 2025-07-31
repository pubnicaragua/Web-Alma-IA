import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicPaths = ["/login", "/contact"];

  if (publicPaths.includes(path)) return NextResponse.next();

  const token = request.cookies.get("auth_token")?.value || "";
  const isAuthenticated = Boolean(token);

  if (path === "/" && !isAuthenticated)
    return NextResponse.redirect(new URL("/login", request.url));
  if (path === "/login" && isAuthenticated)
    return NextResponse.redirect(new URL("/", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/contact"],
};
