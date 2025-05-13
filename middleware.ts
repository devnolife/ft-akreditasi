import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const isPublicRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/unauthorized" ||
    pathname === "/" ||
    pathname.startsWith("/api/auth")

  // Skip middleware for public routes and static files
  if (isPublicRoute ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/public")) {
    return NextResponse.next()
  }

  // Get auth token from cookies or authorization header
  const token = request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.split(" ")[1]

  // Debug cookie information
  const allCookies = request.cookies.getAll()

  // If no token is found, redirect to login
  if (!token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(pathname))
    return NextResponse.redirect(url)
  }

  // Log the token information (first few chars only for security)
  if (token) {
    const tokenPreview = token.substring(0, 15) + "..." // Only display beginning of token
  }

  try {
    // Verify the token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

    try {
      const { payload } = await jwtVerify(token, secret)

      // Check role-based access
      const userRole = (payload.role as string)?.toUpperCase()

      // Admin specific routes
      if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }

      // Prodi specific routes
      if (pathname.startsWith("/prodi") && userRole !== "PRODI") {
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }

      // Lecturer specific routes (allow access to admin, prodi and lecturer)
      if (pathname.startsWith("/dashboard") && !["LECTURER", "ADMIN", "PRODI"].includes(userRole)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }

      // Clone the request headers and add the user info
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set("x-user-id", payload.userId as string)
      requestHeaders.set("x-user-role", userRole)

      // Return the request with the modified headers
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {

      // Clear invalid token
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("token")

      return response
    }
  } catch (error) {

    // Clear invalid token
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("token")

    return response
  }
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
