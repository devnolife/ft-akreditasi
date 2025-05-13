"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainHeader } from "@/components/main-header"
import { getUserFromStorage } from "@/lib/auth-service"
import { SessionManager } from "@/components/session-manager"

export default function FormsLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const user = getUserFromStorage()

    if (!user) {
      router.push("/login")
      return
    }

    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <SessionManager />
      <MainHeader />
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      <footer className="border-t bg-background py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Lecturer Accreditation Data Tracker
        </div>
      </footer>
    </div>
  )
}
