import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // DEBUG: Log the current path being accessed
  console.log(`Middleware processing path: ${pathname}`)

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
    console.log("Public route or static file - skipping middleware")
    return NextResponse.next()
  }

  // Get auth token from cookies or authorization header
  const token = request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.split(" ")[1]

  // If no token is found, redirect to login
  if (!token) {
    console.log("No token found - redirecting to login")
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(pathname))
    return NextResponse.redirect(url)
  }

  // Log the token information (first few chars only for security)
  if (token) {
    const tokenPreview = token.substring(0, 15) + "..." // Only display beginning of token
    console.log(`Found token: ${tokenPreview}`)
  }

  try {
    // Verify the token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

    try {
      const { payload } = await jwtVerify(token, secret)

      // Check role-based access
      const userRole = (payload.role as string)?.toUpperCase()
      console.log(`Middleware - User authenticated as role: ${userRole}`)
      console.log(`Middleware - Request path: ${pathname}`)

      // Admin specific routes
      if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
        console.log(`Access denied: ${userRole} cannot access admin route ${pathname}`)
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }

      // Prodi specific routes
      if (pathname.startsWith("/prodi") && userRole !== "PRODI") {
        console.log(`Access denied: ${userRole} cannot access prodi route ${pathname}`)
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }

      // Lecturer specific routes (allow access to admin, prodi and lecturer)
      if (pathname.startsWith("/dashboard")) {
        // Verify our array includes check is working properly
        console.log(`Checking dashboard access. User role: ${userRole}`)
        console.log(`Allowed roles include LECTURER: ${"LECTURER" === userRole}`)
        console.log(`Role array check: ${["LECTURER", "ADMIN", "PRODI"].includes(userRole)}`)

        if (!["LECTURER", "ADMIN", "PRODI"].includes(userRole)) {
          console.log(`Access denied: ${userRole} cannot access dashboard route ${pathname}`)
          return NextResponse.redirect(new URL("/unauthorized", request.url))
        } else {
          console.log(`Access granted: ${userRole} can access dashboard route ${pathname}`)
        }
      }

      // Clone the request headers and add the user info
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set("x-user-id", payload.userId as string)
      requestHeaders.set("x-user-role", userRole)

      console.log(`Access granted to ${pathname} for user with role ${userRole}`)

      // Return the request with the modified headers
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      console.log(`Token verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`)

      // Clear invalid token
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("token")

      return response
    }
  } catch (error) {
    console.log(`Token processing error: ${error instanceof Error ? error.message : 'Unknown error'}`)

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
