"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-bold">Oops!</h1>
      <h2 className="mt-4 text-2xl font-semibold">Terjadi Kesalahan</h2>
      <p className="mt-2 text-center text-muted-foreground">Maaf, terjadi kesalahan saat memproses permintaan Anda.</p>
      <Button onClick={() => reset()} className="mt-8">
        Coba Lagi
      </Button>
    </div>
  )
}
