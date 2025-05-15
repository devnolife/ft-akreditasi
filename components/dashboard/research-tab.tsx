"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import {
  Loader2,
  Upload,
  BookOpen,
  Calendar,
  User,
  Users,
  FileText,
  ExternalLink,
  CoinsIcon,
  BadgeCheck,
  Hash,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import type React from "react"

interface ResearchTabProps {
  userData: any
  isLoading: boolean
  apiEndpoint?: string
  onDataChange?: () => Promise<void>
}

// Define the interface for the research data
interface ResearchData {
  name: string
  email: string
  id_proposal: string
  id_dosen?: string
  judul: string
  kategori: string
  stt_penetapan: string
  total_dana?: string
  total_biaya?: string
  sumber_dana?: string
  tahun?: number
  nm_mitra?: string
  institusi_mitra?: string
  bidang_mitra?: string
  pelaporan?: string
  nm_jenis?: string
  lokasi?: string
  tugas_ketua?: string
  sinta?: string
  l_belakang?: string
  created_at?: string
  updated_at?: string
  nidn?: string
  [key: string]: any // For other potential properties
}

export function ResearchTab({ userData, isLoading: initialLoading, apiEndpoint, onDataChange }: ResearchTabProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [researchData, setResearchData] = useState<ResearchData[]>([])
  const [selectedResearch, setSelectedResearch] = useState<ResearchData | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState<boolean>(initialLoading)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Add state for add research dialog
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newResearch, setNewResearch] = useState<Partial<ResearchData>>({
    judul: "",
    kategori: "",
    tahun: new Date().getFullYear(),
    sumber_dana: "",
    lokasi: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Utility functions - defined OUTSIDE hooks
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Tidak ada data"

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    } catch (e) {
      return dateString
    }
  }

  const renderStatusBadge = (status: string) => {
    if (!status) return null

    switch (status.toLowerCase()) {
      case "diterima":
        return <Badge className="bg-green-500 hover:bg-green-600">Diterima</Badge>
      case "ditolak":
        return (
          <Badge variant="destructive" className="hover:bg-red-600">
            Ditolak
          </Badge>
        )
      case "pending":
      case "submit":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500 bg-amber-50 hover:bg-amber-100">
            Pending
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="hover:bg-secondary/80">
            {status}
          </Badge>
        )
    }
  }

  // Define openUploadDialog outside of any hooks to prevent hook sequencing issues
  const openUploadDialog = useCallback((research: ResearchData) => {
    setSelectedResearch(research)
    setIsDialogOpen(true)
  }, [])

  // Function to handle opening the add dialog
  const openAddDialog = useCallback(() => {
    setNewResearch({
      judul: "",
      kategori: "",
      tahun: new Date().getFullYear(),
      sumber_dana: "",
      lokasi: "",
    })
    setIsAddDialogOpen(true)
  }, [])

  // Function to handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewResearch(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  // Move handleAddResearch definition before handleSubmitNewResearch
  const handleAddResearch = useCallback(
    async (data: any) => {
      try {
        const endpoint = apiEndpoint || "/api/academic/research"
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error("Failed to add research project")
        }

        const newResearch = await response.json()
        setResearchData([newResearch, ...researchData])

        toast({
          title: "Success",
          description: "Research project added successfully",
        })

        // Call the onDataChange callback if provided
        if (onDataChange) {
          await onDataChange()
        }

        return newResearch
      } catch (error) {
        console.error("Error adding research project:", error)
        toast({
          title: "Error",
          description: "Failed to add research project",
          variant: "destructive",
        })
        throw error
      }
    },
    [researchData, toast, apiEndpoint, onDataChange]
  )

  // Function to handle form submission
  const handleSubmitNewResearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newResearch.judul || !newResearch.kategori) {
      toast({
        title: "Error",
        description: "Judul dan kategori harus diisi",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const dataToSubmit = {
        ...newResearch,
        id_dosen: user?.id,
        name: user?.name,
        email: user?.email || user?.username,
      }

      await handleAddResearch(dataToSubmit)

      setIsAddDialogOpen(false)
      toast({
        title: "Berhasil",
        description: "Penelitian berhasil ditambahkan",
      })
    } catch (error) {
      console.error("Error submitting research:", error)
      toast({
        title: "Error",
        description: "Gagal menambahkan penelitian",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [newResearch, user, handleAddResearch, toast])

  // Make sure all useEffect hooks are called unconditionally
  useEffect(() => {
    const fetchResearchData = async () => {
      if (!user?.username) return

      setLoading(true)
      try {
        const response = await fetch(`https://simpelmas.unismuh.ac.id/api/karya_dosen/${user.username}/pengabdian`)

        if (!response.ok) {
          throw new Error("Failed to fetch research data")
        }

        const data = await response.json()

        if (data.status === "success" && data.data) {
          // Convert object of objects to array
          const researchArray = Object.values(data.data) as ResearchData[]
          setResearchData(researchArray)
        } else {
          setResearchData([])
        }
      } catch (err) {
        console.error("Error fetching research data:", err)
        setError("Gagal memuat data penelitian")
      } finally {
        setLoading(false)
      }
    }

    fetchResearchData()
  }, [user?.username])

  const renderResearchPreview = useCallback((entry: any) => {
    return entry.judul
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
  }, [])

  const handleUpload = useCallback(async () => {
    if (!selectedResearch || !uploadedFile) {
      toast({
        title: "Error",
        description: "Please select a research project and a file to upload",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", uploadedFile)
      formData.append("title", (document.getElementById("docTitle") as HTMLInputElement).value)
      formData.append("description", (document.getElementById("docDescription") as HTMLTextAreaElement).value)
      formData.append("category", "RESEARCH")
      formData.append("tags", JSON.stringify(["research", selectedResearch.kategori_sumber_dana || "internal"]))
      formData.append("relatedItemId", selectedResearch.id_proposal)

      // Use a consistent upload endpoint
      const uploadEndpoint = "/api/documents/upload"
      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload document")
      }

      const result = await response.json()

      // Update research data to include the new document
      const updatedResearchData = researchData.map((research) => {
        if (research.id_proposal === selectedResearch.id_proposal) {
          return {
            ...research,
            documents: [...(research.documents || []), result],
          }
        }
        return research
      })

      setResearchData(updatedResearchData)

      toast({
        title: "Upload successful",
        description: "Document has been attached to the research project",
      })

      // Reset form
      setUploadedFile(null)
      setIsDialogOpen(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // Call the onDataChange callback if provided
      if (onDataChange) {
        await onDataChange()
      }
    } catch (error) {
      console.error("Error uploading document:", error)
      toast({
        title: "Upload failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }, [researchData, selectedResearch, toast, uploadedFile, onDataChange])

  const handleEditResearch = useCallback(
    async (data: any) => {
      try {
        const endpoint = apiEndpoint || "/api/academic/research"
        const response = await fetch(endpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error("Failed to update research project")
        }

        const updatedResearch = await response.json()
        setResearchData(researchData.map((r) => (r.id_proposal === updatedResearch.id_proposal ? updatedResearch : r)))

        toast({
          title: "Success",
          description: "Research project updated successfully",
        })

        // Call the onDataChange callback if provided
        if (onDataChange) {
          await onDataChange()
        }

        return updatedResearch
      } catch (error) {
        console.error("Error updating research project:", error)
        toast({
          title: "Error",
          description: "Failed to update research project",
          variant: "destructive",
        })
        throw error
      }
    },
    [researchData, toast, apiEndpoint, onDataChange]
  )

  const handleDeleteResearch = useCallback(
    async (id: string) => {
      try {
        const endpoint = apiEndpoint || "/api/academic/research"
        const response = await fetch(`${endpoint}?id=${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to delete research project")
        }

        setResearchData(researchData.filter((r) => r.id_proposal !== id))

        toast({
          title: "Success",
          description: "Research project deleted successfully",
        })

        // Call the onDataChange callback if provided
        if (onDataChange) {
          await onDataChange()
        }
      } catch (error) {
        console.error("Error deleting research project:", error)
        toast({
          title: "Error",
          description: "Failed to delete research project",
          variant: "destructive",
        })
        throw error
      }
    },
    [researchData, toast, apiEndpoint, onDataChange]
  )

  // Change the card layout to a modern, cohesive design
  const renderCard = useCallback(
    (entry: ResearchData): React.ReactNode => {
      return (
        <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden w-full mb-4">
          <div className="p-6">
            {/* Status indicator and year */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                {renderStatusBadge(entry.stt_penetapan)}
                {entry.tahun && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {entry.tahun}
                  </span>
                )}
                {entry.nm_jenis && (
                  <Badge variant="outline" className="bg-muted/30 text-xs font-normal">
                    {entry.nm_jenis}
                  </Badge>
                )}
              </div>

              {/* Funding amount */}
              {(entry.total_dana || entry.total_biaya) && (
                <div className="flex items-center gap-1 text-primary-700 font-medium">
                  <CoinsIcon className="h-4 w-4" />
                  {formatCurrency(Number.parseInt(entry.total_dana || entry.total_biaya || "0"))}
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{entry.judul}</h3>

            {/* Info grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              {/* Researcher */}
              <div className="flex items-center gap-3">
                <div className="bg-primary/5 p-2 rounded-full">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Peneliti</p>
                  <p className="text-sm font-medium">{entry.name || "Tidak ada data"}</p>
                </div>
              </div>

              {/* Category */}
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-full">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Kategori</p>
                  <p className="text-sm font-medium">{entry.kategori || "Tidak ada kategori"}</p>
                </div>
              </div>

              {/* Location or Partner */}
              {entry.lokasi ? (
                <div className="flex items-center gap-3">
                  <div className="bg-red-50 p-2 rounded-full">
                    <MapPin className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Lokasi</p>
                    <p className="text-sm font-medium">{entry.lokasi}</p>
                  </div>
                </div>
              ) : entry.nm_mitra ? (
                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-2 rounded-full">
                    <Users className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Mitra</p>
                    <p className="text-sm font-medium">{entry.nm_mitra}</p>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Bottom row with source and actions */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t">
              {/* Source */}
              {entry.sumber_dana && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Sumber Dana:</span> {entry.sumber_dana}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 h-8 rounded-full border-primary text-primary hover:bg-primary hover:text-white"
                  onClick={() => {
                    setSelectedResearch(entry)
                    setIsDetailDialogOpen(true)
                  }}
                >
                  <span>Detail</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 h-8 rounded-full"
                  onClick={() => openUploadDialog(entry)}
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    },
    [openUploadDialog, setIsDetailDialogOpen, setSelectedResearch]
  )

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-16 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Memuat data penelitian...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-primary-700">Penelitian</h2>
          <p className="text-muted-foreground">Masukkan informasi penelitian yang telah atau sedang Anda lakukan.</p>
        </div>
        <Button className="gap-2 bg-teal-600 hover:bg-teal-700" onClick={openAddDialog}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Tambah Penelitian
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-16 space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat data penelitian...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {researchData.map((entry) => (
            <div key={entry.id_proposal}>{renderCard(entry)}</div>
          ))}
        </div>
      )}

      {/* Add Research Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary-700">Tambah Penelitian Baru</DialogTitle>
            <DialogDescription>Masukkan informasi penelitian yang ingin ditambahkan</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitNewResearch}>
            <div className="space-y-4 py-3">
              <div className="space-y-2">
                <Label htmlFor="judul" className="text-muted-foreground">
                  Judul Penelitian <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="judul"
                  name="judul"
                  value={newResearch.judul}
                  onChange={handleInputChange}
                  placeholder="Masukkan judul penelitian"
                  className="focus-visible:ring-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kategori" className="text-muted-foreground">
                  Kategori <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="kategori"
                  name="kategori"
                  value={newResearch.kategori}
                  onChange={handleInputChange}
                  placeholder="Kategori penelitian"
                  className="focus-visible:ring-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tahun" className="text-muted-foreground">
                  Tahun
                </Label>
                <Input
                  id="tahun"
                  name="tahun"
                  type="number"
                  min="2000"
                  max="2100"
                  value={newResearch.tahun}
                  onChange={handleInputChange}
                  placeholder="Tahun penelitian"
                  className="focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sumber_dana" className="text-muted-foreground">
                  Sumber Dana
                </Label>
                <Input
                  id="sumber_dana"
                  name="sumber_dana"
                  value={newResearch.sumber_dana}
                  onChange={handleInputChange}
                  placeholder="Sumber pendanaan"
                  className="focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lokasi" className="text-muted-foreground">
                  Lokasi
                </Label>
                <Input
                  id="lokasi"
                  name="lokasi"
                  value={newResearch.lokasi}
                  onChange={handleInputChange}
                  placeholder="Lokasi penelitian"
                  className="focus-visible:ring-primary"
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-save"
                    >
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Simpan
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden flex flex-col max-h-[90vh]">
          {selectedResearch && (
            <>
              <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-primary/10 to-background sticky top-0 z-10">
                <DialogTitle className="text-2xl font-semibold leading-relaxed text-primary-700">
                  {selectedResearch.judul}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  {selectedResearch.tahun && (
                    <Badge variant="outline" className="text-primary border-primary bg-primary/5">
                      {selectedResearch.tahun}
                    </Badge>
                  )}
                  {selectedResearch.nm_jenis && (
                    <Badge variant="outline" className="bg-muted/20">
                      {selectedResearch.nm_jenis}
                    </Badge>
                  )}
                  <Badge className="bg-primary/80 hover:bg-primary">{selectedResearch.kategori}</Badge>
                  {renderStatusBadge(selectedResearch.stt_penetapan)}
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto bg-muted/5">
                <div className="p-6 space-y-8">
                  {/* Peneliti Section */}
                  <section className="bg-white rounded-xl overflow-hidden shadow-sm border">
                    <div className="flex items-center gap-2 p-4 border-b bg-gradient-to-r from-primary/10 to-transparent">
                      <User className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-primary-700">Informasi Peneliti</h3>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {selectedResearch.name && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Nama Peneliti</p>
                              <p className="mt-1 font-medium">{selectedResearch.name}</p>
                            </div>
                          )}
                          {selectedResearch.email && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Email</p>
                              <p className="mt-1">{selectedResearch.email}</p>
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          {selectedResearch.nidn && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">NIDN</p>
                              <p className="mt-1 font-medium">{selectedResearch.nidn}</p>
                            </div>
                          )}
                          {selectedResearch.sinta && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">ID SINTA</p>
                              <p className="mt-1 font-mono">{selectedResearch.sinta}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Detail Section */}
                  <section className="bg-white rounded-xl overflow-hidden shadow-sm border">
                    <div className="flex items-center gap-2 p-4 border-b bg-gradient-to-r from-primary/10 to-transparent">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-primary-700">Detail Penelitian</h3>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {selectedResearch.lokasi && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Lokasi</p>
                              <p className="mt-1 font-medium">{selectedResearch.lokasi}</p>
                            </div>
                          )}
                          {selectedResearch.stt_penetapan && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Status Penetapan</p>
                              <div className="mt-1">{renderStatusBadge(selectedResearch.stt_penetapan)}</div>
                            </div>
                          )}
                          {selectedResearch.pelaporan && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Status Pelaporan</p>
                              <p className="mt-1 font-medium">{selectedResearch.pelaporan}</p>
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Tanggal Dibuat</p>
                            <p className="mt-1 font-medium">{formatDate(selectedResearch.created_at)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Terakhir Diperbarui</p>
                            <p className="mt-1">{formatDate(selectedResearch.updated_at)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Mitra Section */}
                  {(selectedResearch.nm_mitra || selectedResearch.institusi_mitra || selectedResearch.bidang_mitra) && (
                    <section className="bg-white rounded-xl overflow-hidden shadow-sm border">
                      <div className="flex items-center gap-2 p-4 border-b bg-gradient-to-r from-purple-100 to-transparent">
                        <Users className="h-5 w-5 text-purple-500" />
                        <h3 className="text-lg font-semibold text-purple-700">Informasi Mitra</h3>
                      </div>
                      <div className="p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            {selectedResearch.nm_mitra && (
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Nama Mitra</p>
                                <p className="mt-1 font-medium">{selectedResearch.nm_mitra}</p>
                              </div>
                            )}
                            {selectedResearch.institusi_mitra && (
                              <div className="mt-4">
                                <p className="text-sm font-medium text-muted-foreground">Institusi</p>
                                <p className="mt-1 font-medium">{selectedResearch.institusi_mitra}</p>
                              </div>
                            )}
                          </div>
                          {selectedResearch.bidang_mitra && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Bidang</p>
                              <p className="mt-1 font-medium">{selectedResearch.bidang_mitra}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Financial Section */}
                  <section className="bg-white rounded-xl overflow-hidden shadow-sm border">
                    <div className="flex items-center gap-2 p-4 border-b bg-gradient-to-r from-amber-100 to-transparent">
                      <CoinsIcon className="h-5 w-5 text-amber-500" />
                      <h3 className="text-lg font-semibold text-amber-700">Informasi Finansial</h3>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Sumber Dana</p>
                            <p className="mt-1 font-medium">{selectedResearch.sumber_dana || "Tidak ada data"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Dana</p>
                            <p className="mt-1 text-lg font-semibold text-primary">
                              {formatCurrency(
                                Number.parseInt(selectedResearch.total_dana || selectedResearch.total_biaya || "0"),
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          {selectedResearch.b_kegiatan && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Biaya Kegiatan</p>
                              <p className="mt-1 font-medium">{formatCurrency(selectedResearch.b_kegiatan)}</p>
                            </div>
                          )}
                          {selectedResearch.b_tahap1 && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Biaya Tahap 1</p>
                              <p className="mt-1 font-medium">{formatCurrency(selectedResearch.b_tahap1)}</p>
                            </div>
                          )}
                          {selectedResearch.b_tahap2 && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Biaya Tahap 2</p>
                              <p className="mt-1 font-medium">{formatCurrency(selectedResearch.b_tahap2)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Payment Status Section */}
                  {(selectedResearch.stt_bayar70 || selectedResearch.stt_bayar30) && (
                    <section className="bg-white rounded-xl overflow-hidden shadow-sm border">
                      <div className="flex items-center gap-2 p-4 border-b bg-gradient-to-r from-green-100 to-transparent">
                        <BadgeCheck className="h-5 w-5 text-green-500" />
                        <h3 className="text-lg font-semibold text-green-700">Status Pembayaran</h3>
                      </div>
                      <div className="p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            {selectedResearch.stt_bayar70 && (
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Pembayaran 70%</p>
                                <Badge
                                  variant="outline"
                                  className={
                                    selectedResearch.stt_bayar70 === "PAID"
                                      ? "text-green-500 border-green-500 bg-green-50 mt-1"
                                      : "text-amber-500 border-amber-500 bg-amber-50 mt-1"
                                  }
                                >
                                  {selectedResearch.stt_bayar70 === "PAID" ? "Dibayar" : "Belum Dibayar"}
                                </Badge>
                                {selectedResearch.jml_bayar70 && (
                                  <p className="mt-1 text-sm font-medium">
                                    {formatCurrency(Number.parseInt(selectedResearch.jml_bayar70))}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="space-y-4">
                            {selectedResearch.stt_bayar30 && (
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Pembayaran 30%</p>
                                <Badge
                                  variant="outline"
                                  className={
                                    selectedResearch.stt_bayar30 === "PAID"
                                      ? "text-green-500 border-green-500 bg-green-50 mt-1"
                                      : "text-amber-500 border-amber-500 bg-amber-50 mt-1"
                                  }
                                >
                                  {selectedResearch.stt_bayar30 === "PAID" ? "Dibayar" : "Belum Dibayar"}
                                </Badge>
                                {selectedResearch.jml_bayar30 && (
                                  <p className="mt-1 text-sm font-medium">
                                    {formatCurrency(Number.parseInt(selectedResearch.jml_bayar30))}
                                  </p>
                                )}
                              </div>
                            )}
                            {selectedResearch.layak30 && (
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Kelayakan 30%</p>
                                <p className="mt-1 font-medium">{selectedResearch.layak30}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Latar Belakang & Tugas Section */}
                  {(selectedResearch.l_belakang || selectedResearch.tugas_ketua) && (
                    <section className="bg-white rounded-xl overflow-hidden shadow-sm border">
                      <div className="flex items-center gap-2 p-4 border-b bg-gradient-to-r from-blue-100 to-transparent">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <h3 className="text-lg font-semibold text-blue-700">Latar Belakang & Tugas</h3>
                      </div>
                      <div className="p-5">
                        <div className="space-y-6">
                          {selectedResearch.tugas_ketua && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-2">Tugas Ketua</p>
                              <p className="whitespace-pre-line leading-relaxed bg-muted/10 p-3 rounded-md">
                                {selectedResearch.tugas_ketua}
                              </p>
                            </div>
                          )}
                          {selectedResearch.l_belakang && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-2">Latar Belakang</p>
                              <p className="whitespace-pre-line leading-relaxed bg-muted/10 p-3 rounded-md">
                                {selectedResearch.l_belakang}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Technical IDs */}
                  <section className="bg-white rounded-xl overflow-hidden shadow-sm border">
                    <div className="flex items-center gap-2 p-4 border-b bg-gradient-to-r from-slate-100 to-transparent">
                      <Hash className="h-5 w-5 text-slate-500" />
                      <h3 className="text-lg font-semibold text-slate-700">Informasi Teknis</h3>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          {selectedResearch.id_proposal && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">ID Proposal</p>
                              <p className="text-sm mt-1 font-mono bg-muted/10 p-1.5 rounded">
                                {selectedResearch.id_proposal}
                              </p>
                            </div>
                          )}
                          {selectedResearch.id_dosen && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">ID Dosen</p>
                              <p className="text-sm mt-1 font-mono bg-muted/10 p-1.5 rounded">
                                {selectedResearch.id_dosen}
                              </p>
                            </div>
                          )}
                          {selectedResearch.id_jenis && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">ID Jenis</p>
                              <p className="text-sm mt-1 font-mono bg-muted/10 p-1.5 rounded">
                                {selectedResearch.id_jenis}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          {selectedResearch.id_periode && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">ID Periode</p>
                              <p className="text-sm mt-1 font-mono bg-muted/10 p-1.5 rounded">
                                {selectedResearch.id_periode}
                              </p>
                            </div>
                          )}
                          {selectedResearch.id_bidang && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">ID Bidang</p>
                              <p className="text-sm mt-1 font-mono bg-muted/10 p-1.5 rounded">
                                {selectedResearch.id_bidang}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              <div className="p-4 border-t flex justify-end sticky bottom-0 bg-background">
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                  Tutup
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary-700">Upload Dokumen</DialogTitle>
            <DialogDescription>Upload dokumen terkait penelitian: {selectedResearch?.judul}</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label htmlFor="docTitle" className="text-muted-foreground">
                Judul Dokumen
              </Label>
              <Input id="docTitle" placeholder="Masukkan judul dokumen" className="focus-visible:ring-primary" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="docDescription" className="text-muted-foreground">
                Deskripsi
              </Label>
              <Textarea
                id="docDescription"
                placeholder="Masukkan deskripsi dokumen"
                className="focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file" className="text-muted-foreground">
                File
              </Label>
              <div className="border-2 border-dashed rounded-lg p-4 hover:bg-muted/10 transition-colors cursor-pointer">
                <Input
                  ref={fileInputRef}
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="opacity-0 absolute h-0 w-0"
                />
                <div
                  className="flex flex-col items-center justify-center gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Klik untuk memilih file atau drag & drop</p>
                </div>
                {uploadedFile && (
                  <div className="mt-3 p-2 bg-muted/20 rounded flex items-center justify-between">
                    <p className="text-sm">
                      {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(2)} KB)
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        setUploadedFile(null)
                        if (fileInputRef.current) fileInputRef.current.value = ""
                      }}
                    >
                      <span className="sr-only">Remove</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-x"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleUpload} disabled={isUploading || !uploadedFile} className="gap-2">
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mengunggah...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Unggah
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
