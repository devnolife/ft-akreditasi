"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, FileText, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"
import { submitResearchProposal } from "@/lib/research-service"
import { useToast } from "@/hooks/use-toast"

export default function NewResearchPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    judul: "",
    kategori: "Penelitian",
    tahun: new Date().getFullYear(),
    focus: "",
    sumber_dana: "",
    total_dana: "",
    lokasi: "",
    l_belakang: "",
    proposal_kegiatan: "",
  })
  const [files, setFiles] = useState({
    proposal: null as File | null,
    kontrak: null as File | null,
    luaran: null as File | null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, tahun: date.getFullYear() }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof files) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [type]: e.target.files?.[0] || null }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real application, you would upload files and submit the form data
      await submitResearchProposal(formData, files)

      toast({
        title: "Proposal berhasil diajukan",
        description: "Proposal penelitian Anda telah berhasil diajukan dan sedang menunggu persetujuan.",
        variant: "success",
      })

      // Redirect to research list after successful submission
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Gagal mengajukan proposal",
        description: "Terjadi kesalahan saat mengajukan proposal penelitian. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-6">
        <Button variant="ghost" className="gap-2 mb-4" onClick={() => router.back()}>
          <ArrowLeft size={16} />
          Kembali
        </Button>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Pengajuan Penelitian Baru
          </h1>
          <p className="text-muted-foreground">
            Lengkapi formulir di bawah ini untuk mengajukan proposal penelitian baru.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="border-none shadow-md bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="bg-gradient-to-r from-purple-600/10 to-blue-500/10 rounded-t-lg">
            <CardTitle>Informasi Dasar</CardTitle>
            <CardDescription>Masukkan informasi dasar tentang penelitian yang diajukan</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="judul">
                Judul Penelitian <span className="text-red-500">*</span>
              </Label>
              <Input
                id="judul"
                name="judul"
                placeholder="Masukkan judul penelitian"
                value={formData.judul}
                onChange={handleChange}
                required
                className="border-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kategori">
                  Kategori <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.kategori} onValueChange={(value) => handleSelectChange("kategori", value)}>
                  <SelectTrigger id="kategori" className="border-slate-200">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Penelitian">Penelitian</SelectItem>
                    <SelectItem value="Pengembangan">Pengembangan</SelectItem>
                    <SelectItem value="Kajian">Kajian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tahun">
                  Tahun Pelaksanaan <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  id="tahun"
                  mode="single"
                  selected={new Date(formData.tahun, 0)}
                  onSelect={handleDateChange}
                  captionLayout="dropdown-buttons"
                  fromYear={2020}
                  toYear={2030}
                  disabled={(date) => date > new Date() || date < new Date(2020, 0)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="focus">
                  Fokus Penelitian <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.focus} onValueChange={(value) => handleSelectChange("focus", value)}>
                  <SelectTrigger id="focus" className="border-slate-200">
                    <SelectValue placeholder="Pilih fokus penelitian" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOSIAL HUMANIORA">SOSIAL HUMANIORA</SelectItem>
                    <SelectItem value="PENDIDIKAN">PENDIDIKAN</SelectItem>
                    <SelectItem value="TEKNOLOGI INFORMASI">TEKNOLOGI INFORMASI</SelectItem>
                    <SelectItem value="KESEHATAN">KESEHATAN</SelectItem>
                    <SelectItem value="TEKNIK">TEKNIK</SelectItem>
                    <SelectItem value="EKONOMI">EKONOMI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lokasi">Lokasi Penelitian</Label>
                <Input
                  id="lokasi"
                  name="lokasi"
                  placeholder="Masukkan lokasi penelitian"
                  value={formData.lokasi}
                  onChange={handleChange}
                  className="border-slate-200"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="bg-gradient-to-r from-purple-600/10 to-blue-500/10 rounded-t-lg">
            <CardTitle>Pendanaan</CardTitle>
            <CardDescription>Masukkan informasi tentang pendanaan penelitian</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sumber_dana">
                  Sumber Dana <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.sumber_dana}
                  onValueChange={(value) => handleSelectChange("sumber_dana", value)}
                >
                  <SelectTrigger id="sumber_dana" className="border-slate-200">
                    <SelectValue placeholder="Pilih sumber dana" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HIBAH INTERNAL">HIBAH INTERNAL</SelectItem>
                    <SelectItem value="KEMENRISTEK/BRIN">KEMENRISTEK/BRIN</SelectItem>
                    <SelectItem value="MANDIRI">MANDIRI</SelectItem>
                    <SelectItem value="INDUSTRI">INDUSTRI</SelectItem>
                    <SelectItem value="LAINNYA">LAINNYA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_dana">Total Dana</Label>
                <Input
                  id="total_dana"
                  name="total_dana"
                  placeholder="Contoh: Rp. 10,000,000.0"
                  value={formData.total_dana}
                  onChange={handleChange}
                  className="border-slate-200"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="bg-gradient-to-r from-purple-600/10 to-blue-500/10 rounded-t-lg">
            <CardTitle>Deskripsi Penelitian</CardTitle>
            <CardDescription>Jelaskan latar belakang dan proposal kegiatan penelitian</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="l_belakang">
                Latar Belakang <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="l_belakang"
                name="l_belakang"
                placeholder="Jelaskan latar belakang penelitian"
                value={formData.l_belakang}
                onChange={handleChange}
                rows={4}
                required
                className="border-slate-200 resize-y"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proposal_kegiatan">
                Proposal Kegiatan <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="proposal_kegiatan"
                name="proposal_kegiatan"
                placeholder="Jelaskan proposal kegiatan penelitian"
                value={formData.proposal_kegiatan}
                onChange={handleChange}
                rows={6}
                required
                className="border-slate-200 resize-y"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="bg-gradient-to-r from-purple-600/10 to-blue-500/10 rounded-t-lg">
            <CardTitle>Dokumen Pendukung</CardTitle>
            <CardDescription>Unggah dokumen pendukung untuk proposal penelitian</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file_proposal">
                File Proposal <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="file_proposal"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, "proposal")}
                  required
                  className="border-slate-200"
                />
                {files.proposal && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <FileText size={16} />
                    <span>{files.proposal.name}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Format yang diterima: PDF, DOC, DOCX. Maksimal 10MB.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kontrak_kegiatan">Kontrak Kegiatan (opsional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="kontrak_kegiatan"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, "kontrak")}
                  className="border-slate-200"
                />
                {files.kontrak && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <FileText size={16} />
                    <span>{files.kontrak.name}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Format yang diterima: PDF, DOC, DOCX. Maksimal 10MB.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file_luaran">File Luaran (opsional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="file_luaran"
                  type="file"
                  accept=".pdf,.doc,.docx,.zip,.rar"
                  onChange={(e) => handleFileChange(e, "luaran")}
                  className="border-slate-200"
                />
                {files.luaran && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <FileText size={16} />
                    <span>{files.luaran.name}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Format yang diterima: PDF, DOC, DOCX, ZIP, RAR. Maksimal 20MB.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-gradient-to-br from-white to-slate-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <input type="checkbox" id="agreement" className="mt-1" required />
              <Label htmlFor="agreement" className="text-sm">
                Saya menyatakan bahwa semua informasi yang saya berikan dalam formulir ini adalah benar dan akurat. Saya
                memahami bahwa pengajuan proposal penelitian ini akan ditinjau oleh tim yang berwenang dan keputusan
                akhir akan disampaikan setelah proses peninjauan selesai.
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Mengirim...
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  Ajukan Proposal
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
