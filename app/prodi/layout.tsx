import type { PropsWithChildren } from "react"
import { AppSidebar } from "@/components/app-sidebar"

export default function ProdiLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 md:ml-64">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}
