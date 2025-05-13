"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { refreshSession, isAuthenticated } from "@/lib/auth-service"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Session timeout warning will appear 2 minutes before session expiry
const WARNING_BEFORE_TIMEOUT = 2 * 60 * 1000 // 2 minutes in milliseconds

export function SessionManager() {
  const [showWarning, setShowWarning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const router = useRouter()
  const pathname = usePathname()

  // Skip session management on login page
  const isLoginPage = pathname === "/login"

  useEffect(() => {
    if (isLoginPage) return

    let warningTimer: NodeJS.Timeout
    let logoutTimer: NodeJS.Timeout
    let countdownInterval: NodeJS.Timeout

    const setupTimers = () => {
      // Clear any existing timers
      clearTimeout(warningTimer)
      clearTimeout(logoutTimer)
      clearInterval(countdownInterval)

      if (!isAuthenticated()) return

      // Get session expiry time
      const expiryTimeStr = sessionStorage.getItem("sessionExpiry")
      if (!expiryTimeStr) return

      const expiryTime = Number.parseInt(expiryTimeStr, 10)
      const now = Date.now()

      // If session already expired
      if (now >= expiryTime) {
        router.push("/login")
        return
      }

      // Set timer for warning
      const timeToWarning = expiryTime - now - WARNING_BEFORE_TIMEOUT
      if (timeToWarning > 0) {
        warningTimer = setTimeout(() => {
          setTimeRemaining(Math.floor(WARNING_BEFORE_TIMEOUT / 1000))
          setShowWarning(true)

          // Start countdown
          countdownInterval = setInterval(() => {
            setTimeRemaining((prev) => {
              if (prev <= 1) {
                clearInterval(countdownInterval)
                return 0
              }
              return prev - 1
            })
          }, 1000)
        }, timeToWarning)
      } else {
        // We're already in the warning period
        const remainingTime = expiryTime - now
        if (remainingTime > 0) {
          setTimeRemaining(Math.floor(remainingTime / 1000))
          setShowWarning(true)

          // Start countdown
          countdownInterval = setInterval(() => {
            setTimeRemaining((prev) => {
              if (prev <= 1) {
                clearInterval(countdownInterval)
                return 0
              }
              return prev - 1
            })
          }, 1000)
        }
      }

      // Set timer for logout
      const timeToLogout = expiryTime - now
      if (timeToLogout > 0) {
        logoutTimer = setTimeout(() => {
          setShowWarning(false)
          router.push("/login")
        }, timeToLogout)
      }
    }

    // Setup timers initially
    setupTimers()

    // Refresh session on user activity
    const handleUserActivity = () => {
      refreshSession()
      setupTimers()
    }

    // Add event listeners for user activity
    window.addEventListener("click", handleUserActivity)
    window.addEventListener("keypress", handleUserActivity)
    window.addEventListener("scroll", handleUserActivity)
    window.addEventListener("mousemove", handleUserActivity)

    // Check authentication status periodically
    const authCheckInterval = setInterval(() => {
      if (!isAuthenticated()) {
        router.push("/login")
      }
    }, 60000) // Check every minute

    return () => {
      // Clean up timers and event listeners
      clearTimeout(warningTimer)
      clearTimeout(logoutTimer)
      clearInterval(countdownInterval)
      clearInterval(authCheckInterval)
      window.removeEventListener("click", handleUserActivity)
      window.removeEventListener("keypress", handleUserActivity)
      window.removeEventListener("scroll", handleUserActivity)
      window.removeEventListener("mousemove", handleUserActivity)
    }
  }, [router, isLoginPage, pathname])

  const handleExtendSession = () => {
    refreshSession()
    setShowWarning(false)
  }

  const handleLogout = () => {
    setShowWarning(false)
    router.push("/login")
  }

  // Format remaining time as MM:SS
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60)
    const seconds = timeRemaining % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (isLoginPage) return null

  return (
    <Dialog open={showWarning} onOpenChange={setShowWarning}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session Expiring Soon</DialogTitle>
          <DialogDescription>
            Your session will expire in {formatTimeRemaining()}. Would you like to extend your session?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
          <Button onClick={handleExtendSession}>Extend Session</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
