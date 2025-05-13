"use client"

import type React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { MainHeader } from "@/components/main-header"
import { SessionManager } from "@/components/auth/SessionManager"
import { LoadingScreen } from "@/components/ui/loading-screen"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen message="Memuat dashboard..." />
  }

  return (
    <>
      <SessionManager />
      <div className="min-h-screen flex flex-col bg-background">
        <MainHeader simplified={true} showLogoutButton={true} />
        <main className="flex-1">{children}</main>
        <footer className="border-t py-4 bg-background">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Universitas Muhammadiyah Makassar. Hak Cipta Dilindungi.</p>
            <p className="mt-1">Sistem Pelacakan Data Akreditasi Dosen</p>
          </div>
        </footer>
      </div>
    </>
  )
}
