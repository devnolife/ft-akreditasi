"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Download, Edit, FileText, MapPin, Users } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { getResearchProjectById } from "@/lib/research-service"
import type { ResearchProject } from "@/types/research"

export default function ResearchDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [research, setResearch] = useState<ResearchProject | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const data = await getResearchProjectById(params.id)
        setResearch(data)
      } catch (error) {
        console.error("Error fetching research:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResearch()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium">Memuat data penelitian...</p>
        </div>
      </div>
    )
  }

  if (!research) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-red-100 p-4">
          <FileText className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold">Penelitian Tidak Ditemukan</h2>
        <p className="text-muted-foreground">Data penelitian dengan ID {params.id} tidak ditemukan.</p>
        <Button onClick={() => router.back()} variant="outline" className="mt-2">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "diterima":
        return "bg-green-100 text-green-800 border-green-300"
      case "menunggu":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "ditolak":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const formatCurrency = (value: string) => {
    if (!value) return "-"
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-2">
        <Button onClick={() => router.back()} variant="outline" size="icon" className="h-9 w-9">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Detail Penelitian</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden border-none bg-white shadow-md">
            <div className="bg-gradient-to-r from-primary/90 to-primary p-6">
              <Badge className={`mb-4 border ${getStatusColor(research.stt_penetapan)}`}>
                {research.stt_penetapan}
              </Badge>
              <h2 className="text-2xl font-bold text-white">{research.judul}</h2>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-white/90">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{research.tahun}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{research.leader}</span>
                </div>
                {research.lokasi && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{research.lokasi}</span>
                  </div>
                )}
              </div>
            </div>

            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border border-primary/10 bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Informasi Dana</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Sumber Dana</p>
                        <p className="font-medium">{research.sumber_dana}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Kategori</p>
                        <p className="font-medium">{research.kategori_sumber_dana}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Dana Disetujui</p>
                        <p className="font-medium">{research.funds_approved || "-"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-primary/10 bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Skema Penelitian</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Nama Skema</p>
                        <p className="font-medium">{research.scheme_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Fokus</p>
                        <p className="font-medium">{research.focus}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Program Hibah</p>
                        <p className="font-medium">{research.program_hibah}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator className="my-6" />

              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Deskripsi Penelitian</h3>
                  {research.l_belakang ? (
                    <p className="text-muted-foreground">{research.l_belakang}</p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      Tidak ada deskripsi latar belakang untuk penelitian ini.
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold">Proposal Kegiatan</h3>
                  {research.proposal_kegiatan ? (
                    <p className="text-muted-foreground">{research.proposal_kegiatan}</p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      Tidak ada detail proposal kegiatan untuk penelitian ini.
                    </p>
                  )}
                </div>
              </div>

              {research.file_proposal && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="mb-4 text-lg font-semibold">Dokumen Terkait</h3>
                    <div className="space-y-3">
                      {research.file_proposal && (
                        <div className="flex items-center justify-between rounded-lg border p-3">
                          <div className="flex items-center gap-3">
                            <div className="rounded-md bg-primary/10 p-2">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">Proposal Penelitian</p>
                              <p className="text-sm text-muted-foreground">PDF, 2.4 MB</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" /> Unduh
                          </Button>
                        </div>
                      )}
                      {research.file_luaran && (
                        <div className="flex items-center justify-between rounded-lg border p-3">
                          <div className="flex items-center gap-3">
                            <div className="rounded-md bg-primary/10 p-2">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">Dokumen Luaran</p>
                              <p className="text-sm text-muted-foreground">PDF, 1.8 MB</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" /> Unduh
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="flex justify-end gap-2 border-t bg-muted/20 p-4">
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" /> Edit Penelitian
              </Button>
              <Button>Lihat Laporan</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card className="sticky top-6 border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-primary/90 to-primary pb-6">
              <CardTitle className="text-white">Informasi Peneliti</CardTitle>
              <CardDescription className="text-white/80">Detail peneliti utama dan informasi kontak</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-b p-4">
                <h3 className="mb-2 font-semibold">Peneliti Utama</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 p-1.5">
                      <Users className="h-full w-full text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{research.leader}</p>
                      <p className="text-sm text-muted-foreground">NIDN: {research.leader_nidn}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b p-4">
                <h3 className="mb-2 font-semibold">Informasi Kontak</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Email:</span> {research.email}
                  </p>
                </div>
              </div>

              <div className="border-b p-4">
                <h3 className="mb-2 font-semibold">Detail Administratif</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">ID Proposal:</span> {research.id_proposal}
                  </p>
                  <p>
                    <span className="text-muted-foreground">ID Dosen:</span> {research.id_dosen}
                  </p>
                  <p>
                    <span className="text-muted-foreground">NIDN:</span> {research.nidn}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Tahun Pengajuan:</span> {research.first_proposed_year}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Tahun Implementasi:</span> {research.implementation_year}
                  </p>
                </div>
              </div>

              <div className="p-4">
                <h3 className="mb-2 font-semibold">Sumber Data</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Sumber:</span> {research.sumber}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Tanggal Dibuat:</span>{" "}
                    {format(new Date(research.created_at), "dd MMMM yyyy", { locale: id })}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Terakhir Diperbarui:</span>{" "}
                    {format(new Date(research.updated_at), "dd MMMM yyyy", { locale: id })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
