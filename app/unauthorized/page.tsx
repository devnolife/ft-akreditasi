"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-bold">403</h1>
      <h2 className="mt-4 text-2xl font-semibold">Akses Ditolak</h2>
      <p className="mt-2 text-center text-muted-foreground">
        Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Kembali ke Beranda</Link>
      </Button>
    </div>
  )
}
