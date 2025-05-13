"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatCard } from "@/components/prodi/stat-card"
import { LecturerTable } from "@/components/prodi/lecturer-table"
import { getProdiLecturers, getProdiStatistics } from "@/lib/prodi-service"
import { Loader2, Users, BookOpen, Award, FileText, BarChart2 } from "lucide-react"
import Image from "next/image"

export default function ProdiDashboard() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [statistics, setStatistics] = useState({
    totalLecturers: 0,
    completedProfiles: 0,
    averageCompletionRate: 0,
    totalPublications: 0,
    totalResearch: 0,
    totalTeaching: 0,
  })
  const [lecturers, setLecturers] = useState([])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // In a real app, we would pass the program ID from the user object
        const programId = user?.programId || "55202" // Default to Teknik Informatika

        // Load statistics
        const stats = await getProdiStatistics(programId)
        setStatistics(stats)

        // Load lecturers
        const lecturerData = await getProdiLecturers(programId)
        setLecturers(lecturerData)
      } catch (error) {
        console.error("Error loading prodi dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative h-16 w-16">
              <Image
                src="/images/unismuh-logo.png"
                alt="Universitas Muhammadiyah Makassar"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Memuat Dashboard</h3>
          <p className="text-muted-foreground mb-4">Mohon tunggu sementara kami memuat data program studi Anda</p>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    )
  }

  const programName = user?.programName || "Teknik Informatika"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative h-12 w-12">
            <Image
              src="/images/unismuh-logo.png"
              alt="Universitas Muhammadiyah Makassar"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard {programName}</h1>
            <p className="text-muted-foreground">Fakultas Teknik Universitas Muhammadiyah Makassar</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Dosen"
          value={statistics.totalLecturers}
          description="Dosen aktif dalam program studi"
          icon={<Users className="h-5 w-5" />}
          trend="neutral"
        />
        <StatCard
          title="Tingkat Kelengkapan"
          value={`${Math.round(statistics.averageCompletionRate)}%`}
          description={`${statistics.completedProfiles} profil lengkap`}
          icon={<FileText className="h-5 w-5" />}
          trend={statistics.averageCompletionRate > 75 ? "up" : "down"}
          trendValue={`${statistics.averageCompletionRate > 75 ? "+" : "-"}${Math.abs(statistics.averageCompletionRate - 75)}%`}
        />
        <StatCard
          title="Publikasi"
          value={statistics.totalPublications}
          description="Total publikasi akademik"
          icon={<BookOpen className="h-5 w-5" />}
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          title="Penelitian"
          value={statistics.totalResearch}
          description="Proyek penelitian aktif"
          icon={<Award className="h-5 w-5" />}
          trend="up"
          trendValue="+5%"
        />
      </div>

      <Tabs defaultValue="lecturers" className="mb-8">
        <TabsList>
          <TabsTrigger value="lecturers">Dosen</TabsTrigger>
          <TabsTrigger value="publications">Publikasi</TabsTrigger>
          <TabsTrigger value="research">Penelitian</TabsTrigger>
          <TabsTrigger value="teaching">Pengajaran</TabsTrigger>
        </TabsList>
        <TabsContent value="lecturers" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Dosen Program Studi</CardTitle>
                  <CardDescription>Kelola dosen dalam program studi Anda</CardDescription>
                </div>
                <Button>Tambah Dosen</Button>
              </div>
            </CardHeader>
            <CardContent>
              <LecturerTable lecturers={lecturers} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="publications">
          <Card>
            <CardHeader>
              <CardTitle>Publikasi</CardTitle>
              <CardDescription>Publikasi akademik dari dosen program studi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 border rounded-md border-dashed">
                <div className="text-center">
                  <BarChart2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">Data Publikasi</h3>
                  <p className="text-muted-foreground mb-3">Lihat dan kelola publikasi akademik</p>
                  <Button>Lihat Publikasi</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="research">
          <Card>
            <CardHeader>
              <CardTitle>Proyek Penelitian</CardTitle>
              <CardDescription>Aktivitas dan proyek penelitian</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 border rounded-md border-dashed">
                <div className="text-center">
                  <Award className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">Data Penelitian</h3>
                  <p className="text-muted-foreground mb-3">Lihat dan kelola proyek penelitian</p>
                  <Button>Lihat Penelitian</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="teaching">
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Pengajaran</CardTitle>
              <CardDescription>Mata kuliah dan tanggung jawab pengajaran</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 border rounded-md border-dashed">
                <div className="text-center">
                  <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">Data Pengajaran</h3>
                  <p className="text-muted-foreground mb-3">Lihat dan kelola aktivitas pengajaran</p>
                  <Button>Lihat Pengajaran</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
