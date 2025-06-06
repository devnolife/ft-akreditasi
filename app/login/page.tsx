"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { useAuth } from "@/contexts/AuthContext"

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

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"

  // Get auth context
  const { user, isLoading, isAuthenticated, login } = useAuth()

  // Redirect if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const decodedUrl = callbackUrl.startsWith('%2F') ? decodeURIComponent(callbackUrl) : callbackUrl
      router.push(decodedUrl)
    }
  }, [isAuthenticated, user, router, callbackUrl])

  // Form setup
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setLocalError(null)

    try {
      if (redirecting || isLoading) {
        return
      }

      const user = await login(data.username, data.password)

      if (user) {
        setRedirecting(true)
      } else {
        setLocalError("Login gagal. Silakan coba lagi.")
        setRedirecting(false)
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Terjadi kesalahan saat login")
      setRedirecting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Tampilkan loading saat sedang proses autentikasi
  if (isLoading || redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg">Mengalihkan ke Dashboard...</p>
        </div>
      </div>
    )
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

            {localError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{localError}</AlertDescription>
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
                          disabled={isLoading || redirecting}
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
                            disabled={isLoading || redirecting}
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            disabled={isLoading || redirecting}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={isLoading || redirecting}
                >
                  {isLoading || redirecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg">Memuat halaman login...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
