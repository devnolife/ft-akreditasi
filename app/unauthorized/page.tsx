"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-2 items-center text-center">
          <ShieldAlert className="h-16 w-16 text-red-500" />
          <CardTitle className="text-2xl font-bold">Akses Ditolak</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-gray-600">
            Anda tidak memiliki izin untuk mengakses halaman ini. Halaman ini hanya dapat diakses oleh pengguna dengan peran yang sesuai.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full"
          >
            Kembali ke Halaman Sebelumnya
          </Button>
          <Button
            onClick={() => router.push('/dashboard')}
            className="w-full"
          >
            Kembali ke Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
