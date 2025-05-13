"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { LoadingScreen } from "@/components/ui/loading-screen"

interface ProtectedProdiRouteProps {
  children: ReactNode
  programId?: string // Optional program ID to check access for
}

export function ProtectedProdiRoute({ children, programId }: ProtectedProdiRouteProps) {
  const { user, isLoading, checkRole, checkProgramAccess } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true)

  useEffect(() => {
    const checkAuth = async () => {
      setIsCheckingAuth(true)

      // Wait for auth to initialize
      if (isLoading) return

      // Check if user is authenticated
      if (!user) {
        router.push("/login")
        return
      }

      // Check if user has prodi role or admin role (admins can access prodi routes)
      const hasProdiAccess = checkRole("prodi") || checkRole("admin")

      // If programId is provided, check if user has access to that program
      const hasProgramAccess = programId ? checkProgramAccess(programId) : true

      if (!hasProdiAccess || !hasProgramAccess) {
        router.push("/unauthorized")
        return
      }

      setIsAuthorized(true)
      setIsCheckingAuth(false)
    }

    checkAuth()
  }, [user, isLoading, checkRole, checkProgramAccess, programId, router])

  if (isLoading || isCheckingAuth) {
    return <LoadingScreen message="Verifying access..." />
  }

  return isAuthorized ? <>{children}</> : null
}
