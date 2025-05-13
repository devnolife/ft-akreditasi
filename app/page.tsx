"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { UniversityLogo } from "@/components/university-logo"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Redirect based on user role
        if (user.role === "admin") {
          router.push("/admin/dashboard")
        } else if (user.role === "prodi") {
          router.push("/prodi/dashboard")
        } else {
          router.push("/dashboard")
        }
      } else {
        router.push("/login")
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative h-24 w-24">
              <Image
                src="/images/unismuh-logo.png"
                alt="Universitas Muhammadiyah Makassar"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Lecturer Accreditation Tracker</h1>
          <p className="text-muted-foreground mb-4">Fakultas Teknik Universitas Muhammadiyah Makassar</p>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-2 text-center">
          <div className="flex flex-col items-center text-center space-y-6">
            <UniversityLogo size="lg" />
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Lecturer Accreditation Data Tracker
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Sistem Pelacakan Data Akreditasi Dosen Fakultas Teknik
            </p>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6">
            Sistem pengelolaan data akreditasi dosen untuk meningkatkan kualitas pendidikan di Fakultas Teknik
            Universitas Muhammadiyah Makassar.
          </p>
          <Button onClick={() => router.push("/login")} className="w-full">
            Login to Continue
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Fakultas Teknik Unismuh Makassar</p>
        </CardFooter>
      </Card>
    </div>
  )
}
