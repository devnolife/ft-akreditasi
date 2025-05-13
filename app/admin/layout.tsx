"use client"

import { useAuth } from "@/contexts/AuthContext"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { SessionManager } from "@/components/auth/SessionManager"
import { LoadingScreen } from "@/components/ui/loading-screen"

export default function AdminLayout({ children }) {
  const { isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen message="Loading admin dashboard..." />
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <SessionManager />
      <div className="min-h-screen flex flex-col bg-muted/20">
        <header className="bg-primary text-primary-foreground py-4 px-6">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t bg-background py-4">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Lecturer Accreditation Data Tracker - Admin Area
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  )
}
