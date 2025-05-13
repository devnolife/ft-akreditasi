import { mockUsers } from "./mock-data"

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000

// Authenticate user with username and password
export async function authenticateUser(
  username: string,
  password: string,
  rememberMe = false,
): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    // Validate input
    if (!username || !password) {
      return {
        success: false,
        error: "Username and password are required",
      }
    }

    // Find user in mock data
    const user = mockUsers.find(
      (user) => user.username.toLowerCase() === username.toLowerCase() && user.password === password,
    )

    if (!user) {
      return {
        success: false,
        error: "Invalid username or password",
      }
    }

    // Create user object without sensitive data
    const userToStore = {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    }

    // Store user in sessionStorage (more secure than localStorage for auth)
    sessionStorage.setItem("currentUser", JSON.stringify(userToStore))

    // If remember me is checked, store a flag in localStorage
    if (rememberMe) {
      localStorage.setItem("rememberUser", "true")
      localStorage.setItem("rememberedUsername", username)
    } else {
      localStorage.removeItem("rememberUser")
      localStorage.removeItem("rememberedUsername")
    }

    // Set session expiry
    const expiryTime = Date.now() + SESSION_TIMEOUT
    sessionStorage.setItem("sessionExpiry", expiryTime.toString())

    // Record last login time
    const loginTimestamp = new Date().toISOString()
    localStorage.setItem(`lastLogin_${user.id}`, loginTimestamp)

    return {
      success: true,
      user: userToStore,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return {
      success: false,
      error: "An unexpected error occurred during authentication",
    }
  }
}

// Get current user from storage
export function getUserFromStorage(): any {
  if (typeof window === "undefined") return null

  try {
    // Check if session has expired
    const expiryTime = sessionStorage.getItem("sessionExpiry")
    if (expiryTime && Number.parseInt(expiryTime, 10) < Date.now()) {
      // Session expired, clear session data
      sessionStorage.removeItem("currentUser")
      sessionStorage.removeItem("sessionExpiry")
      return null
    }

    const userStr = sessionStorage.getItem("currentUser")
    if (!userStr) return null

    return JSON.parse(userStr)
  } catch (error) {
    console.error("Error parsing user from storage:", error)
    return null
  }
}

// Logout user
export function logoutUser(): void {
  if (typeof window === "undefined") return

  // Clear session data
  sessionStorage.removeItem("currentUser")
  sessionStorage.removeItem("sessionExpiry")

  // Keep remember me preference if set
  if (!localStorage.getItem("rememberUser")) {
    localStorage.removeItem("rememberedUsername")
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getUserFromStorage()
}

// Refresh session (extend timeout)
export function refreshSession(): void {
  if (typeof window === "undefined") return

  const user = getUserFromStorage()
  if (user) {
    const expiryTime = Date.now() + SESSION_TIMEOUT
    sessionStorage.setItem("sessionExpiry", expiryTime.toString())
  }
}

// Get remembered username if available
export function getRememberedUsername(): string | null {
  if (typeof window === "undefined") return null

  const rememberUser = localStorage.getItem("rememberUser")
  if (rememberUser === "true") {
    return localStorage.getItem("rememberedUsername")
  }
  return null
}

// Get last login time for a user
export function getLastLoginTime(userId: string): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(`lastLogin_${userId}`)
}
