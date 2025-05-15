import { mockData, type AuthUser, type User } from "./mockData"

// Constants for authentication
const AUTH_TOKEN_KEY = "auth_token"
const AUTH_USER_KEY = "auth_user"
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes in milliseconds
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds

// Track login attempts
interface LoginAttempts {
  [username: string]: {
    count: number
    lockUntil: number | null
  }
}

// Store login attempts in memory (in a real app, this would be in a database)
const loginAttempts: LoginAttempts = {}

// Create the auth service object
export const authService = {
  login: authenticateUser,
  logout: logoutUser,
  getCurrentUser,
  isAuthenticated,
  hasPermission,
  hasRole,
  hasAccessToProgram,
  updateLastLogin,
  refreshSession,
  getProdiUsers,
  getAllStudyPrograms,
  getStudyProgramById,
}

/**
 * Authenticate a user with username and password
 */
export async function authenticateUser(
  username: string,
  password: string,
  rememberMe = false,
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  // Validate input
  if (!username || !password) {
    return {
      success: false,
      error: "Username and password are required",
    }
  }

  // Check if account is locked
  if (loginAttempts[username] && loginAttempts[username].lockUntil && Date.now() < loginAttempts[username].lockUntil!) {
    const remainingMinutes = Math.ceil((loginAttempts[username].lockUntil! - Date.now()) / 60000)
    return {
      success: false,
      error: `Account temporarily locked due to multiple failed attempts. Try again in ${remainingMinutes} minutes.`,
    }
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  try {
    // Find user in mock data
    const user = mockData.users.find((u) => u.username === username && u.password === password)

    if (!user) {
      // Initialize login attempts for this username if not exists
      if (!loginAttempts[username]) {
        loginAttempts[username] = { count: 0, lockUntil: null }
      }

      // Increment failed login attempts
      loginAttempts[username].count++

      // Check if account should be locked
      if (loginAttempts[username].count >= MAX_LOGIN_ATTEMPTS) {
        loginAttempts[username].lockUntil = Date.now() + LOCKOUT_DURATION

        return {
          success: false,
          error: `Too many failed login attempts. Account locked for 15 minutes.`,
        }
      }

      return {
        success: false,
        error: `Invalid username or password. ${MAX_LOGIN_ATTEMPTS - loginAttempts[username].count} attempts remaining.`,
      }
    }

    // Reset login attempts on successful login
    if (loginAttempts[username]) {
      loginAttempts[username].count = 0
      loginAttempts[username].lockUntil = null
    }

    // Get permissions for the user's role
    const rolePermissions = mockData.roles[user.role as keyof typeof mockData.roles]?.permissions || []

    // Create authenticated user object (without password)
    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      email: user.email,
      department: user.department,
      programId: user.programId || null,
      programName: user.programName || null,
      lastLogin: new Date().toISOString(),
      permissions: rolePermissions,
    }

    // Store auth token and user data
    const token = generateAuthToken(user.id, user.role)
    storeAuthData(token, authUser, rememberMe)

    return {
      success: true,
      user: authUser,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return {
      success: false,
      error: "An unexpected error occurred during authentication.",
    }
  }
}

/**
 * Log out the current user
 */
export function logoutUser(): void {
  try {
    // Clear auth data from both localStorage and sessionStorage to be safe
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
    sessionStorage.removeItem(AUTH_TOKEN_KEY)
    sessionStorage.removeItem(AUTH_USER_KEY)

    // Clear any other auth-related data
    document.cookie = `${AUTH_TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  } catch (error) {
    console.error("Error during logout:", error)
  }
}

/**
 * Get the currently authenticated user
 */
export function getCurrentUser(): AuthUser | null {
  try {
    // Check if session has expired
    const tokenJson = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY)
    if (tokenJson) {
      try {
        const tokenData = JSON.parse(atob(tokenJson))
        if (tokenData.exp < Date.now()) {
          // Session expired, clear auth data
          logoutUser()
          return null
        }
      } catch (error) {
        console.error("Error parsing token:", error)
        logoutUser()
        return null
      }
    } else {
      // No token found
      return null
    }

    const userJson = localStorage.getItem(AUTH_USER_KEY) || sessionStorage.getItem(AUTH_USER_KEY)
    if (!userJson) return null

    return JSON.parse(userJson) as AuthUser
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

/**
 * Check if a user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY)
  const user = getCurrentUser()
  return !!token && !!user
}

/**
 * Check if the current user has a specific permission
 */
export function hasPermission(permission: string): boolean {
  const user = getCurrentUser()
  if (!user) return false
  return user.permissions.includes(permission)
}

/**
 * Check if the current user has a specific role
 */
export function hasRole(role: string): boolean {
  const user = getCurrentUser()
  if (!user) return false

  // Case-insensitive role comparison to match middleware uppercase with AuthContext lowercase
  return user.role.toLowerCase() === role.toLowerCase();
}

/**
 * Check if the current user has access to a specific program
 */
export function hasAccessToProgram(programId: string): boolean {
  const user = getCurrentUser()
  if (!user) return false

  // Admin has access to all programs
  if (user.role === "admin") return true

  // Prodi users only have access to their assigned program
  if (user.role === "prodi") {
    return user.programId === programId
  }

  // Lecturers might have access based on their department/program assignment
  // This would need to be implemented based on your data model
  return false
}

/**
 * Generate a simple auth token (in a real app, use JWT or similar)
 */
function generateAuthToken(userId: string, role: string): string {
  // In a real application, use a proper JWT library
  const tokenData = {
    userId,
    role,
    exp: Date.now() + SESSION_TIMEOUT, // 30 minutes expiry
  }

  return btoa(JSON.stringify(tokenData))
}

/**
 * Store authentication data in localStorage or sessionStorage
 */
function storeAuthData(token: string, user: AuthUser, rememberMe = false): void {
  const storage = rememberMe ? localStorage : sessionStorage

  // Clear any existing auth data first
  logoutUser()

  // Then store the new auth data
  storage.setItem(AUTH_TOKEN_KEY, token)
  storage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

/**
 * Update the last login time for a user
 */
export function updateLastLogin(userId: string): void {
  const user = getCurrentUser()
  if (user && user.id === userId) {
    user.lastLogin = new Date().toISOString()
    const storage = localStorage.getItem(AUTH_USER_KEY) ? localStorage : sessionStorage
    storage.setItem(AUTH_USER_KEY, JSON.stringify(user))
  }
}

/**
 * Refresh the user's session
 */
export function refreshSession(): void {
  const user = getCurrentUser()
  const tokenJson = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY)

  if (user && tokenJson) {
    try {
      // Generate a new token with extended expiry
      const token = generateAuthToken(user.id, user.role)

      // Store the new token
      const storage = localStorage.getItem(AUTH_TOKEN_KEY) ? localStorage : sessionStorage
      storage.setItem(AUTH_TOKEN_KEY, token)
    } catch (error) {
      console.error("Error refreshing session:", error)
    }
  }
}

/**
 * Get all users with the prodi role
 */
export function getProdiUsers(): User[] {
  return mockData.users.filter((user) => user.role === "prodi")
}

/**
 * Get all study programs
 */
export function getAllStudyPrograms() {
  return mockData.studyPrograms
}

/**
 * Get a study program by ID
 */
export function getStudyProgramById(programId: string) {
  return mockData.studyPrograms.find((program) => program.id === programId)
}
