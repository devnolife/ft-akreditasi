"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react"

// Login form validation schema
const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username wajib diisi" })
    .max(50, { message: "Username tidak boleh lebih dari 50 karakter" }),
  password: z
    .string()
    .min(1, { message: "Password wajib diisi" })
    .max(100, { message: "Password tidak boleh lebih dari 100 karakter" }),
})

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Terjadi kesalahan saat login')
      }

      // Simpan token ke localStorage
      localStorage.setItem('token', result.token)
      localStorage.setItem('user', JSON.stringify(result.user))

      // Redirect berdasarkan role
      if (result.user.role === 'ADMIN') {
        router.push('/admin/dashboard')
      } else if (result.user.role === 'PRODI') {
        router.push('/prodi/dashboard')
      } else {
        router.push('/dashboard')
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat login')
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Left side - Illustration and branding */}
      <div className="w-full md:w-1/2 bg-[#1e3a8a] text-white p-8 flex flex-col">
        <div className="flex items-center mb-8">
          <div className="relative h-16 w-16 mr-4">
            <Image
              src="/images/unismuh-logo.png"
              alt="Logo Universitas Muhammadiyah Makassar"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold">Fakultas Teknik</h1>
            <p className="text-sm opacity-80">Universitas Muhammadiyah Makassar</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-md h-64 md:h-80">
            <Image
              src="/images/login-illustration.png"
              alt="Ilustrasi Pelacakan Data Akreditasi Dosen"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mt-8 text-center">Sistem Pelacakan Data Akreditasi Dosen</h2>
          <p className="mt-4 text-center max-w-md opacity-80">
            Platform terpadu untuk mengelola dan melacak data akreditasi dosen dengan mudah dan efisien.
          </p>
        </div>

        <div className="mt-auto text-sm opacity-70 text-center md:text-left">
          © {new Date().getFullYear()} Fakultas Teknik Unismuh Makassar
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-lg border-0 bg-white">
          <CardContent className="pt-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800">Selamat Datang</h3>
              <p className="text-gray-500 mt-2">Masuk untuk mengakses sistem pelacakan data akreditasi</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Nama Pengguna</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan nama pengguna"
                          {...field}
                          autoComplete="username"
                          className="h-11"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Kata Sandi</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Masukkan kata sandi"
                            {...field}
                            autoComplete="current-password"
                            className="h-11 pr-10"
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                            disabled={isLoading}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    "Masuk"
                  )}
                </Button>

                <div className="text-sm text-center text-muted-foreground mt-6 border-t pt-6">
                  <p>Kredensial Demo:</p>
                  <p className="font-mono bg-muted p-2 rounded text-xs mt-2">
                    Nama Pengguna: <span className="font-medium">dosen</span>
                    <br />
                    Kata Sandi: <span className="font-medium">password123</span>
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
