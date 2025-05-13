import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get auth token from cookies or storage
  const authToken = request.cookies.get("auth_token")?.value || request.cookies.get("next-auth.session-token")?.value

  // Check if the path requires authentication
  const isAuthRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/prodi") ||
    pathname.startsWith("/forms")

  // Public routes that don't require authentication
  const isPublicRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/unauthorized" ||
    pathname === "/"

  // If it's an auth route and no token exists, redirect to login
  if (isAuthRoute && !authToken) {
    // Store the original URL to redirect back after login
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.nextUrl.pathname))
    return NextResponse.redirect(url)
  }

  // Let the client-side auth context handle redirections for authenticated users
  // This prevents redirection loops between login and dashboard
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
