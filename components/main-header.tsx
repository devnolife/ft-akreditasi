"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { LogOut, User } from "lucide-react"
import { UniversityLogo } from "./university-logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface MainHeaderProps {
  simplified?: boolean
  showLogoutButton?: boolean
}

export function MainHeader({ simplified = false, showLogoutButton = false }: MainHeaderProps) {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <UniversityLogo size="sm" showText={false} />
          <h1 className="text-xl font-bold bg-gradient-to-r from-red-700 to-red-500 bg-clip-text text-transparent">
            Fakultas Teknik - Data Tracker
          </h1>
        </div>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "relative h-10 pl-3 pr-8 rounded-full hover:bg-red-50",
                  "border-red-200 hover:border-red-300 transition-colors",
                  "flex items-center justify-center gap-3"
                )}
              >
                <Avatar className="h-7 w-7 rounded-full ring-2 ring-red-200 ring-offset-2">
                  <AvatarImage
                    src="https://simak.unismuh.ac.id/upload/dosen/0917109102_.jpg"
                    alt={user.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline-block font-semibold text-sm text-slate-800 pr-2">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 mt-2 p-2"
              align="end"
              forceMount
              sideOffset={8}
            >
              <div className="flex items-center gap-3 px-2 py-3 mb-2 bg-red-50 rounded-md">
                <Avatar className="h-10 w-10 rounded-full ring-2 ring-red-200">
                  <AvatarImage
                    src="https://simak.unismuh.ac.id/upload/dosen/0917109102_.jpg"
                    alt={user.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-bold leading-none text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    {user.role === "admin" ? "Administrator" : user.role === "prodi" ? "Koordinator Program" : "Dosen"}
                  </p>
                </div>
              </div>

              <DropdownMenuItem asChild className="px-2 py-2 rounded-md cursor-pointer">
                <Link href="/dashboard" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span className="font-medium">Data Diri</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-2" />

              <DropdownMenuItem
                onClick={handleLogout}
                className="px-2 py-2 rounded-md cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span className="font-medium">Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
