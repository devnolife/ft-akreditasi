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
  isAuthenticated: boolean
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
        console.log("AuthContext - Initializing auth state")

        // Instead of using mock data, call the real API
        const response = await fetch("/api/auth/user", {
          credentials: "include",
        });

        const data = await response.json();
        console.log("AuthContext - User API response:", {
          isLoggedIn: data.isLoggedIn,
          hasUser: !!data.user
        });

        if (data.isLoggedIn && data.user) {
          console.log("AuthContext - Setting user from API");
          setUser(data.user);

          // Try to get token from localStorage if it exists and refresh cookie
          const storedToken = localStorage.getItem('authToken');
          if (storedToken) {
            console.log("AuthContext - Found token in localStorage, refreshing cookie");
            document.cookie = `token=${storedToken}; path=/; max-age=86400; SameSite=Lax`;
          }
        } else {
          console.log("AuthContext - No authenticated user found");
          setUser(null);
        }
      } catch (err) {
        console.error("Error initializing auth:", err)
        setError("Failed to initialize authentication")
        setUser(null)
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
      console.log("AuthContext - Starting login process for:", username)

      // Call the API directly instead of using the mock service
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("AuthContext - API login failed:", errorData);
        setError(errorData.error || "Authentication failed");
        return false;
      }

      const data = await response.json();
      console.log("AuthContext - API login successful, received user data");

      if (data.success && data.user) {
        // Save the token manually in multiple places for redundancy
        if (data.token) {
          console.log("AuthContext - Saving token to storage");

          // 1. Save in localStorage if rememberMe is true
          if (rememberMe) {
            localStorage.setItem('authToken', data.token);
          }

          // 2. Set cookie manually for extra reliability
          const expires = new Date(Date.now() + 86400 * 1000); // 24 hours
          document.cookie = `token=${data.token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;

          console.log("AuthContext - Token saved successfully");
        }

        // Update our auth state
        setUser(data.user);
        console.log("AuthContext - User state updated with API response");

        // Redirect based on role
        setTimeout(() => {
          console.log("AuthContext - Redirecting based on role:", data.user.role);
          redirectUserBasedOnRole(data.user.role);
        }, 500); // Small delay to ensure state is updated

        return true;
      } else {
        console.error("AuthContext - Invalid API response:", data);
        setError("Invalid response from authentication service");
        return false;
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
    isAuthenticated: !!user,
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
