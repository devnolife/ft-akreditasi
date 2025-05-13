"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  authenticateUser,
  logoutUser,
  getCurrentUser,
  hasPermission,
  hasRole,
  updateLastLogin,
  refreshSession,
  hasAccessToProgram,
} from "@/lib/auth/authService"
import type { AuthUser } from "@/lib/auth/mockData"

// Define the shape of our auth context
interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  error: string | null
  login: (username: string, password: string, rememberMe?: boolean) => Promise<boolean>
  logout: () => void
  checkPermission: (permission: string) => boolean
  checkRole: (role: string) => boolean
  checkProgramAccess: (programId: string) => boolean
  clearError: () => void
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider props
interface AuthProviderProps {
  children: ReactNode
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)
      try {
        const currentUser = getCurrentUser()
        setUser(currentUser)

        // If we have a user, refresh their session
        if (currentUser) {
          refreshSession()
        }
      } catch (err) {
        console.error("Error initializing auth:", err)
        setError("Failed to initialize authentication")
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  // Handle redirects based on auth state
  useEffect(() => {
    // Skip if still loading
    if (isLoading) return

    // Public routes that don't require redirection
    const publicRoutes = ["/login", "/unauthorized", "/register", "/forgot-password", "/"]
    if (publicRoutes.includes(pathname)) {
      // If user is on login page but already authenticated, redirect to appropriate dashboard
      if (user && pathname === "/login") {
        redirectUserBasedOnRole(user.role)
      }
      return
    }

    // If no user and not on a public route, redirect to login
    if (!user && !publicRoutes.includes(pathname)) {
      router.push("/login")
      return
    }

    // Check if user is trying to access a route they don't have permission for
    checkRouteAccess(pathname, user)
  }, [user, isLoading, pathname, router])

  // Redirect user based on their role
  const redirectUserBasedOnRole = (role: string) => {
    switch (role) {
      case "admin":
        router.push("/admin/dashboard")
        break
      case "prodi":
        router.push("/prodi/dashboard")
        break
      default:
        router.push("/dashboard")
    }
  }

  // Check if user has access to the current route
  const checkRouteAccess = (path: string, user: AuthUser | null) => {
    if (!user) return

    // Admin routes
    if (path.startsWith("/admin") && user.role !== "admin") {
      router.push("/unauthorized")
      return
    }

    // Prodi routes
    if (path.startsWith("/prodi") && user.role !== "prodi" && user.role !== "admin") {
      router.push("/unauthorized")
      return
    }

    // Lecturer routes
    if (path.startsWith("/dashboard") && user.role !== "lecturer" && user.role !== "admin") {
      // Allow prodi to access lecturer dashboard for now
      if (user.role !== "prodi") {
        router.push("/unauthorized")
        return
      }
    }
  }

  // Login function
  const login = async (username: string, password: string, rememberMe = false): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await authenticateUser(username, password, rememberMe)

      if (result.success && result.user) {
        setUser(result.user)
        updateLastLogin(result.user.id)

        // Redirect based on role
        redirectUserBasedOnRole(result.user.role)
        return true
      } else {
        setError(result.error || "Authentication failed")
        return false
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred during login")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    // First clear the auth data from storage
    logoutUser()

    // Then update the state
    setUser(null)

    // Finally redirect to login page
    // Use a small timeout to ensure state is updated before navigation
    setTimeout(() => {
      router.push("/login")
    }, 100)
  }

  // Clear error message
  const clearError = () => {
    setError(null)
  }

  // Check if user has a specific permission
  const checkPermission = (permission: string): boolean => {
    return hasPermission(permission)
  }

  // Check if user has a specific role
  const checkRole = (role: string): boolean => {
    return hasRole(role)
  }

  // Check if user has access to a specific program
  const checkProgramAccess = (programId: string): boolean => {
    return hasAccessToProgram(programId)
  }

  // Context value
  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
    checkPermission,
    checkRole,
    checkProgramAccess,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
