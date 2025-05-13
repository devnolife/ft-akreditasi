"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { LoadingScreen } from "@/components/ui/loading-screen"

interface ProtectedRouteProps {
  children: ReactNode
  requiredPermission?: string
  requiredRole?: string
  fallbackUrl?: string
}

export default function ProtectedRoute({
  children,
  requiredPermission,
  requiredRole,
  fallbackUrl = "/unauthorized",
}: ProtectedRouteProps) {
  const { user, isLoading, checkPermission, checkRole } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    // Skip check if still loading
    if (isLoading) return

    // If no user is logged in, redirect to login
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    // Check for required permission
    if (requiredPermission && !checkPermission(requiredPermission)) {
      router.push(fallbackUrl)
      setIsAuthorized(false)
      return
    }

    // Check for required role
    if (requiredRole && !checkRole(requiredRole)) {
      router.push(fallbackUrl)
      setIsAuthorized(false)
      return
    }

    // User is authorized
    setIsAuthorized(true)
  }, [user, isLoading, requiredPermission, requiredRole, router, checkPermission, checkRole, pathname, fallbackUrl])

  // Show loading state
  if (isLoading || isAuthorized === null) {
    return <LoadingScreen message="Checking authorization..." />
  }

  // If not authorized, don't render children
  if (!isAuthorized) {
    return null
  }

  // Render children if authorized
  return <>{children}</>
}
