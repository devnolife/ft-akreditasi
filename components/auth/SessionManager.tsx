"use client"

import { useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export function SessionManager() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl")

  useEffect(() => {
    // Skip if still loading
    if (isLoading) return

    // Handle callback URL if present
    if (user && callbackUrl) {
      router.push(decodeURI(callbackUrl))
      return
    }

    // Public routes that don't require redirection
    const publicRoutes = ["/login", "/unauthorized", "/register", "/forgot-password", "/"]

    // If on login page and authenticated, redirect to appropriate dashboard
    if (user && pathname === "/login") {
      if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else if (user.role === "prodi") {
        router.push("/prodi/dashboard")
      } else {
        router.push("/dashboard")
      }
    }

    // If not authenticated and not on a public route, redirect to login
    if (!user && !publicRoutes.includes(pathname)) {
      router.push(`/login?callbackUrl=${encodeURI(pathname)}`)
    }
  }, [user, isLoading, pathname, router, callbackUrl])

  // This component doesn't render anything
  return null
}
