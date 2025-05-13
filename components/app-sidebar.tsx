"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/AuthContext"
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  GraduationCap,
  BookOpen,
  Award,
  BarChart,
  User,
} from "lucide-react"

interface SidebarProps {
  className?: string
}

export function AppSidebar({ className }: SidebarProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Close the mobile sidebar when the route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Determine navigation items based on user role
  const getNavItems = () => {
    if (!user) return []

    if (user.role === "admin") {
      return [
        {
          title: "Dashboard",
          href: "/admin/dashboard",
          icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
          title: "Dosen",
          href: "/admin/lecturers",
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: "Program Studi",
          href: "/admin/programs",
          icon: <GraduationCap className="h-5 w-5" />,
        },
        {
          title: "Laporan",
          href: "/admin/reports",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          title: "Pengaturan",
          href: "/admin/settings",
          icon: <Settings className="h-5 w-5" />,
        },
      ]
    } else if (user.role === "prodi") {
      return [
        {
          title: "Dashboard",
          href: "/prodi/dashboard",
          icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
          title: "Dosen",
          href: "/prodi/lecturers",
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: "Pengajaran",
          href: "/prodi/teaching",
          icon: <BookOpen className="h-5 w-5" />,
        },
        {
          title: "Penelitian",
          href: "/prodi/research",
          icon: <Award className="h-5 w-5" />,
        },
        {
          title: "Laporan",
          href: "/prodi/reports",
          icon: <BarChart className="h-5 w-5" />,
        },
        {
          title: "Profil",
          href: "/prodi/profile",
          icon: <User className="h-5 w-5" />,
        },
      ]
    } else {
      // Default lecturer navigation
      return [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
          title: "Profil Saya",
          href: "/dashboard/profile",
          icon: <User className="h-5 w-5" />,
        },
        {
          title: "Formulir",
          href: "/forms",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          title: "Pengaturan",
          href: "/dashboard/settings",
          icon: <Settings className="h-5 w-5" />,
        },
      ]
    }
  }

  const navItems = getNavItems()

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    logout()
  }

  return (
    <>
      {/* Mobile Sidebar Trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed left-4 top-4 z-40 rounded-full shadow-md">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Buka Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <MobileSidebar navItems={navItems} pathname={pathname} onLogout={handleLogout} user={user} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed hidden md:flex flex-col h-screen border-r bg-background w-64 transition-all duration-300 ease-in-out",
          className,
        )}
      >
        <DesktopSidebar navItems={navItems} pathname={pathname} onLogout={handleLogout} user={user} />
      </aside>
    </>
  )
}

interface SidebarContentProps {
  navItems: { title: string; href: string; icon: React.ReactNode }[]
  pathname: string
  onLogout: (e: React.MouseEvent) => void
  user: any
}

function MobileSidebar({ navItems, pathname, onLogout, user }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden">
              <Image
                src="/images/unismuh-logo.png"
                alt="Universitas Muhammadiyah Makassar"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Pelacak Akreditasi</span>
              <span className="text-xs text-muted-foreground">Fakultas Teknik</span>
            </div>
          </Link>
        </div>
        {user && (
          <div className="text-sm text-muted-foreground mt-2">
            Masuk sebagai <span className="font-medium">{user.name}</span>
          </div>
        )}
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t mt-auto">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5" />
          Keluar
        </Button>
      </div>
    </div>
  )
}

function DesktopSidebar({ navItems, pathname, onLogout, user }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative h-10 w-10 overflow-hidden">
            <Image
              src="/images/unismuh-logo.png"
              alt="Universitas Muhammadiyah Makassar"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Fakultas Teknik</h2>
            <p className="text-xs text-muted-foreground">Universitas Muhammadiyah Makassar</p>
          </div>
        </div>
        {user && (
          <div className="text-sm text-muted-foreground mt-1 bg-muted p-2 rounded-md">
            <div className="font-medium">{user.name}</div>
            <div className="text-xs">
              {user.role === "prodi" ? "Koordinator Program" : user.role === "admin" ? "Administrator" : "Dosen"}
            </div>
          </div>
        )}
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-6 border-t mt-auto">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5" />
          Keluar
        </Button>
      </div>
    </div>
  )
}
