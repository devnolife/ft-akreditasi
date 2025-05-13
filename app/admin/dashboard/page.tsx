"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { Users, LogOut, BookOpen, Building, FileText, TrendingUp, Clock, CheckCircle2 } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "@/components/ui/chart"

// Mock data for demonstration
const MOCK_DATA = {
  studyPrograms: 8,
  faculties: 3,
  uploadedDocuments: 124,
  users: {
    total: 42,
    lecturers: 38,
    admins: 4,
  },
  documentsByType: [
    { name: "Makalah Penelitian", value: 45 },
    { name: "Sertifikat", value: 32 },
    { name: "Materi Pengajaran", value: 28 },
    { name: "Publikasi", value: 19 },
  ],
  documentsByFaculty: [
    { name: "Teknik", documents: 58 },
    { name: "Sains", documents: 42 },
    { name: "Humaniora", documents: 24 },
  ],
  completionRate: {
    personal: 78,
    research: 65,
    teaching: 42,
    community: 31,
  },
  recentActivity: [
    { date: "10 Mei", documents: 12 },
    { date: "9 Mei", documents: 8 },
    { date: "8 Mei", documents: 15 },
    { date: "7 Mei", documents: 10 },
    { date: "6 Mei", documents: 7 },
    { date: "5 Mei", documents: 14 },
    { date: "4 Mei", documents: 9 },
  ],
  pendingSubmissions: 8,
  systemStatus: "Aktif",
}

// Colors for charts
const COLORS = ["#0ea5e9", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"]

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(MOCK_DATA)

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleLogout = () => {
    logout()
  }

  // Calculate total documents
  const totalDocuments = dashboardData.uploadedDocuments

  // Calculate completion percentage
  const completionValues = Object.values(dashboardData.completionRate)
  const averageCompletion = completionValues.reduce((a, b) => a + b, 0) / completionValues.length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12">
            <Image
              src="/images/unismuh-logo.png"
              alt="Universitas Muhammadiyah Makassar"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard Admin</h2>
            <p className="text-muted-foreground">Fakultas Teknik - Ikhtisar komprehensif semua data akreditasi dosen</p>
          </div>
        </div>

        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          <span>Keluar</span>
        </Button>
      </div>

      {/* Key Metrics Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="border-l-4 border-l-blue-500 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Program Studi</CardTitle>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isLoading ? "-" : dashboardData.studyPrograms}</div>
            <p className="text-xs text-muted-foreground mt-1">Program akademik aktif</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Fakultas</CardTitle>
            </div>
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <Building className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isLoading ? "-" : dashboardData.faculties}</div>
            <p className="text-xs text-muted-foreground mt-1">Departemen akademik</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Dokumen Diunggah</CardTitle>
            </div>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <FileText className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isLoading ? "-" : totalDocuments}</div>
            <p className="text-xs text-muted-foreground mt-1">Total dokumen akreditasi</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
            </div>
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isLoading ? "-" : dashboardData.users.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isLoading ? "Memuat..." : `${dashboardData.users.lecturers} dosen, ${dashboardData.users.admins} admin`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Tingkat Kelengkapan</CardTitle>
            </div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "-" : `${Math.round(averageCompletion)}%`}</div>
            <div className="mt-2 space-y-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Data Pribadi</span>
                  <span className="font-medium">{dashboardData.completionRate.personal}%</span>
                </div>
                <Progress
                  value={dashboardData.completionRate.personal}
                  className="h-1"
                  indicatorClassName="bg-blue-500"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Penelitian</span>
                  <span className="font-medium">{dashboardData.completionRate.research}%</span>
                </div>
                <Progress
                  value={dashboardData.completionRate.research}
                  className="h-1"
                  indicatorClassName="bg-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Pengajaran</span>
                  <span className="font-medium">{dashboardData.completionRate.teaching}%</span>
                </div>
                <Progress
                  value={dashboardData.completionRate.teaching}
                  className="h-1"
                  indicatorClassName="bg-purple-500"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Pengabdian Masyarakat</span>
                  <span className="font-medium">{dashboardData.completionRate.community}%</span>
                </div>
                <Progress
                  value={dashboardData.completionRate.community}
                  className="h-1"
                  indicatorClassName="bg-amber-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Pengajuan Tertunda</CardTitle>
            </div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "-" : dashboardData.pendingSubmissions}</div>
            <p className="text-xs text-muted-foreground mt-1">Menunggu peninjauan</p>
            <div className="mt-4">
              <Button asChild size="sm" className="w-full">
                <Link href="/admin/submissions">Tinjau Pengajuan</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Status Sistem</CardTitle>
            </div>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{isLoading ? "-" : dashboardData.systemStatus}</div>
            <p className="text-xs text-muted-foreground mt-1">Semua sistem beroperasi</p>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full">
                Lihat Log Sistem
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Visualization Section */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Dokumen berdasarkan Jenis</CardTitle>
            <CardDescription>Distribusi dokumen yang diunggah berdasarkan kategori</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <p>Memuat data grafik...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData.documentsByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {dashboardData.documentsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Dokumen berdasarkan Fakultas</CardTitle>
            <CardDescription>Jumlah dokumen yang diunggah per fakultas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <p>Memuat data grafik...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dashboardData.documentsByFaculty}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="documents" name="Dokumen" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
          <CardDescription>Unggahan dokumen dalam 7 hari terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {isLoading ? (
              <div className="h-full w-full flex items-center justify-center">
                <p>Memuat data grafik...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dashboardData.recentActivity}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="documents" name="Dokumen" stroke="#8b5cf6" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mt-8 mb-4">Fungsi Administratif</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle>Manajemen Pengguna</CardTitle>
            <CardDescription>Tambah, edit, atau hapus pengguna sistem</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/users">Kelola Pengguna</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle>Persetujuan Pengajuan</CardTitle>
            <CardDescription>Tinjau dan setujui pengajuan data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/submissions">Tinjau Pengajuan</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle>Buat Laporan</CardTitle>
            <CardDescription>Buat dan ekspor laporan sistem</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/reports">Buat Laporan</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
