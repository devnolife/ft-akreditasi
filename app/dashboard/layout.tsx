import type React from "react"
import { MainHeader } from "@/components/main-header"
import { DashboardClientWrapper } from "@/components/dashboard/"
import { FooterWithYear } from "@/components/footer-with-year"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardClientWrapper>
        <MainHeader simplified={true} showLogoutButton={true} />
        <main className="flex-1">{children}</main>
      </DashboardClientWrapper>
      <FooterWithYear />
    </div>
  )
}
