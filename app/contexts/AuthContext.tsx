"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Cookies from "js-cookie"

interface User {
  id: string
  name: string
  username: string
  role: string
  personal_data?: any
  study_program?: any
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<User | null>
  logout: () => Promise<void>
  refreshUser: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl")

  // Fungsi untuk memeriksa token dan mengambil data pengguna
  const refreshUser = async () => {
    try {
      const token = Cookies.get("token")

      if (!token) {
        setUser(null)
        setIsAuthenticated(false)
        return false
      }

      // Ambil data pengguna dari API
      const response = await fetch("/api/auth/user", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok && data.isLoggedIn) {
        setUser(data.user)
        setIsAuthenticated(true)
        return true
      } else {
        setUser(null)
        setIsAuthenticated(false)
        Cookies.remove("token")
        return false
      }
    } catch (error) {
      console.error("Error refreshing user:", error)
      setUser(null)
      setIsAuthenticated(false)
      Cookies.remove("token")
      return false
    }
  }

  // Periksa apakah pengguna sudah login saat komponen dimuat
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true)
      try {
        await refreshUser()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Fungsi login
  const login = async (username: string, password: string): Promise<User | null> => {
    console.log("AuthContext - login function called with username:", username)
    // Hindari multiple calls jika sudah loading
    if (isLoading) {
      console.log("AuthContext - Login already in progress, ignoring duplicate call")
      return null
    }

    // Set loading state
    console.log("AuthContext - Setting isLoading to true")
    setIsLoading(true)

    try {
      console.log("AuthContext - Login attempt started for username:", username)
      console.log("AuthContext - Preparing fetch request to /api/auth/login")

      // Log request details
      const requestBody = JSON.stringify({ username, password })
      console.log("AuthContext - Request body prepared:", { username, password: "***" })

      console.log("AuthContext - Sending fetch request to API")
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
        credentials: "include",
      }).catch(fetchError => {
        console.error("AuthContext - Fetch operation failed:", fetchError)
        throw new Error("Network error: " + (fetchError.message || "Could not connect to server"))
      })
      console.log("AuthContext - Fetch request completed")

      console.log("AuthContext - Login API response status:", response.status)
      console.log("AuthContext - Response headers:", Object.fromEntries([...response.headers.entries()]))

      let data
      console.log("AuthContext - Parsing response JSON")
      try {
        data = await response.json()
        console.log("AuthContext - Login API response parsed successfully")
      } catch (parseError) {
        console.error("AuthContext - Failed to parse response as JSON:", parseError)
        throw new Error("Failed to parse server response")
      }

      console.log("AuthContext - Login API response data received:", {
        success: data.success,
        error: data.error,
        user: data.user ? { id: data.user.id, role: data.user.role } : null,
        hasToken: !!data.token
      })

      if (!response.ok) {
        console.error("AuthContext - Login failed with status:", response.status, "Error:", data.error)
        throw new Error(data.error || "Login failed")
      }
      console.log("AuthContext - Response is OK, proceeding")

      // Set user data dan token
      console.log("AuthContext - Setting user data in state")
      setUser(data.user)
      console.log("AuthContext - User data set, setting isAuthenticated to true")
      setIsAuthenticated(true)
      console.log("AuthContext - Authentication state updated")

      // Set token di cookie client-side juga
      if (data.token) {
        console.log("AuthContext - Setting token in cookies")
        Cookies.set("token", data.token, { expires: 1 })
        const tokenSet = !!Cookies.get("token")
        console.log("AuthContext - Cookie set successfully:", tokenSet)
      } else {
        console.warn("AuthContext - No token received from login API")
      }

      // Return user data to ensure promise resolves correctly
      console.log("AuthContext - Login success, returning user data")
      return data.user

    } catch (error) {
      console.error("AuthContext - Login process error:", error)
      if (error instanceof Error) {
        console.error("AuthContext - Error message:", error.message)
        console.error("AuthContext - Error stack:", error.stack)
      } else {
        console.error("AuthContext - Non-Error object thrown:", typeof error)
      }
      throw error
    } finally {
      console.log("AuthContext - Setting isLoading to false")
      setIsLoading(false)
      console.log("AuthContext - Login process completed")
    }
  }

  // Fungsi logout
  const logout = async () => {
    setIsLoading(true)
    try {
      // Call logout API
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      // Reset state
      setUser(null)
      setIsAuthenticated(false)

      // Hapus token dari cookie client-side
      Cookies.remove("token")

      // Redirect ke halaman login
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      // Even if API fails, clear cookies and state
      setUser(null)
      setIsAuthenticated(false)
      Cookies.remove("token")
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 
