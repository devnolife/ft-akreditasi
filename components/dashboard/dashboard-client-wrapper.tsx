"use client"

import React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { SessionManager } from "@/components/auth/SessionManager"
import { LoadingScreen } from "@/components/ui/loading-screen"

interface DashboardClientWrapperProps {
  children: React.ReactNode
}

export function DashboardClientWrapper({ children }: DashboardClientWrapperProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen message="Memuat dashboard..." />
  }

  return (
    <>
      <SessionManager />
      {children}
    </>
  )
} 
