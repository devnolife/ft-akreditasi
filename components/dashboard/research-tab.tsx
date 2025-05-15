"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { EntryManager } from "@/components/dynamic-form/entry-manager"
import { researchFields } from "./form-schemas"
import {
  Loader2, Upload, BookOpen, Calendar, Tag, User, Users,
  FileText, ExternalLink, CoinsIcon, Clock, ChevronDown,
  BadgeCheck, Hash, MapPin
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatCurrency } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import React from "react"

interface ResearchTabProps {
  userData: any;
  isLoading: boolean;
}

// Define the interface for the research data
interface ResearchData {
  name: string;
  email: string;
  id_proposal: string;
  id_dosen?: string;
  judul: string;
  kategori: string;
  stt_penetapan: string;
  total_dana?: string;
  total_biaya?: string;
  sumber_dana?: string;
  tahun?: number;
  nm_mitra?: string;
  institusi_mitra?: string;
  bidang_mitra?: string;
  pelaporan?: string;
  nm_jenis?: string;
  lokasi?: string;
  tugas_ketua?: string;
  sinta?: string;
  l_belakang?: string;
  created_at?: string;
  updated_at?: string;
  nidn?: string;
  [key: string]: any; // For other potential properties
}

export function ResearchTab({ userData, isLoading: initialLoading }: ResearchTabProps) {
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

  // Utility functions - defined OUTSIDE hooks
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Tidak ada data';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const renderStatusBadge = (status: string) => {
    if (!status) return null;

    switch (status.toLowerCase()) {
      case 'diterima':
        return <Badge className="bg-green-500">Diterima</Badge>;
      case 'ditolak':
        return <Badge variant="destructive">Ditolak</Badge>;
      case 'pending':
      case 'submit':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Define openUploadDialog outside of any hooks to prevent hook sequencing issues
  const openUploadDialog = useCallback((research: ResearchData) => {
    setSelectedResearch(research);
    setIsDialogOpen(true);
  }, []);

  // Make sure all useEffect hooks are called unconditionally
  useEffect(() => {
    const fetchResearchData = async () => {
      if (!user?.username) return;

      setLoading(true);
      try {
        const response = await fetch(`https://simpelmas.unismuh.ac.id/api/karya_dosen/${user.username}/pengabdian`);

        if (!response.ok) {
          throw new Error('Failed to fetch research data');
        }

        const data = await response.json();

        if (data.status === "success" && data.data) {
          // Convert object of objects to array
          const researchArray = Object.values(data.data) as ResearchData[];
          setResearchData(researchArray);
        } else {
          setResearchData([]);
        }
      } catch (err) {
        console.error('Error fetching research data:', err);
        setError('Gagal memuat data penelitian');
      } finally {
        setLoading(false);
      }
    };

    fetchResearchData();
  }, [user?.username]);

  const renderResearchPreview = useCallback((entry: any) => {
    return entry.judul
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
  }, []);

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

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload document")
      }

      const result = await response.json()

      // Update research data to include the new document
      const updatedResearchData = researchData.map(research => {
        if (research.id_proposal === selectedResearch.id_proposal) {
          return {
            ...research,
            documents: [...(research.documents || []), result]
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
  }, [researchData, selectedResearch, toast, uploadedFile]);

  const handleAddResearch = useCallback(async (data: any) => {
    try {
      const response = await fetch("/api/academic/research", {
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
  }, [researchData, toast]);

  const handleEditResearch = useCallback(async (data: any) => {
    try {
      const response = await fetch("/api/academic/research", {
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
      setResearchData(researchData.map(r => r.id_proposal === updatedResearch.id_proposal ? updatedResearch : r))

      toast({
        title: "Success",
        description: "Research project updated successfully",
      })

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
  }, [researchData, toast]);

  const handleDeleteResearch = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/academic/research?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete research project")
      }

      setResearchData(researchData.filter(r => r.id_proposal !== id))

      toast({
        title: "Success",
        description: "Research project deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting research project:", error)
      toast({
        title: "Error",
        description: "Failed to delete research project",
        variant: "destructive",
      })
      throw error
    }
  }, [researchData, toast]);

  // Make this useCallback hook consistent
  const renderCard = useCallback((entry: ResearchData): React.ReactNode => {
    return (
      <div className="w-full border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 bg-background">
        <div className="flex flex-col">
          {/* Title and Basic Info Row */}
          <div className="border-b p-4 bg-muted/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">{entry.judul}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {entry.tahun && (
                    <Badge variant="outline" className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{entry.tahun}</span>
                    </Badge>
                  )}
                  {entry.nm_jenis && (
                    <Badge variant="outline">{entry.nm_jenis}</Badge>
                  )}
                  {renderStatusBadge(entry.stt_penetapan)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => openUploadDialog(entry)}
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    setSelectedResearch(entry);
                    setIsDetailDialogOpen(true);
                  }}
                >
                  <span>Detail</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Info Rows */}
          <div className="divide-y">
            {/* Researcher Info Row */}
            <div className="p-4 flex flex-col md:flex-row gap-4">
              <div className="flex items-start gap-3 md:w-1/3">
                <User className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Peneliti</p>
                  <p className="mt-1">{entry.name || 'Tidak ada data'}</p>
                  {entry.nidn && (
                    <p className="text-sm text-muted-foreground">NIDN: {entry.nidn}</p>
                  )}
                  {entry.email && (
                    <p className="text-sm text-muted-foreground">{entry.email}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3 md:w-1/3">
                <BookOpen className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Kategori</p>
                  <p className="mt-1">{entry.kategori || 'Tidak ada data'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 md:w-1/3">
                <MapPin className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Lokasi</p>
                  <p className="mt-1">{entry.lokasi || 'Tidak ada data'}</p>
                </div>
              </div>
            </div>

            {/* Partner Info Row */}
            <div className="p-4 flex flex-col md:flex-row gap-4">
              <div className="flex items-start gap-3 md:w-1/2">
                <Users className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mitra</p>
                  <p className="mt-1">{entry.nm_mitra || 'Tidak ada data mitra'}</p>
                  {entry.institusi_mitra && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {entry.institusi_mitra}
                    </p>
                  )}
                  {entry.bidang_mitra && (
                    <Badge variant="outline" className="mt-2">
                      {entry.bidang_mitra}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3 md:w-1/2">
                <CoinsIcon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendanaan</p>
                  <p className="mt-1">{entry.sumber_dana || 'Tidak ada data'}</p>
                  <p className="font-medium text-lg text-primary mt-1">
                    {formatCurrency(parseInt(entry.total_dana || entry.total_biaya || "0"))}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Info Row */}
            <div className="p-4 flex flex-col md:flex-row gap-4">
              <div className="flex items-start gap-3 md:w-1/3">
                <BadgeCheck className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status Penelitian</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {renderStatusBadge(entry.stt_penetapan)}
                    <Badge variant="outline">
                      {entry.pelaporan || 'Belum Dilaporkan'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 md:w-1/3">
                <Clock className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tanggal</p>
                  <p className="mt-1">Dibuat: {formatDate(entry.created_at)}</p>
                  {entry.updated_at && (
                    <p className="text-sm text-muted-foreground">
                      Diperbarui: {formatDate(entry.updated_at)}
                    </p>
                  )}
                </div>
              </div>
              {entry.stt_bayar70 && (
                <div className="flex items-start gap-3 md:w-1/3">
                  <CoinsIcon className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status Pembayaran</p>
                    <div className="mt-1 space-y-1">
                      <Badge
                        variant="outline"
                        className={entry.stt_bayar70 === "PAID" ? "text-green-500 border-green-500" : "text-amber-500 border-amber-500"}
                      >
                        70% - {entry.stt_bayar70 === "PAID" ? "Dibayar" : "Belum Dibayar"}
                      </Badge>
                      {entry.stt_bayar30 && (
                        <Badge
                          variant="outline"
                          className={entry.stt_bayar30 === "PAID" ? "text-green-500 border-green-500" : "text-amber-500 border-amber-500"}
                        >
                          30% - {entry.stt_bayar30 === "PAID" ? "Dibayar" : "Belum Dibayar"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }, [openUploadDialog]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <EntryManager
        title="Penelitian"
        description="Masukkan informasi penelitian yang telah atau sedang Anda lakukan."
        formFields={researchFields}
        dataKey="researchData"
        documentCategory="research"
        renderPreview={renderResearchPreview}
        renderCard={renderCard}
        initialData={researchData}
        onAdd={handleAddResearch}
        onEdit={handleEditResearch}
        onDelete={handleDeleteResearch}
      />

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden flex flex-col max-h-[90vh]">
          {selectedResearch && (
            <>
              <DialogHeader className="px-6 py-4 border-b bg-background sticky top-0 z-10">
                <DialogTitle className="text-2xl font-semibold leading-relaxed">
                  {selectedResearch.judul}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  {selectedResearch.tahun && (
                    <Badge variant="outline" className="text-primary border-primary">
                      {selectedResearch.tahun}
                    </Badge>
                  )}
                  {selectedResearch.nm_jenis && (
                    <Badge variant="outline">{selectedResearch.nm_jenis}</Badge>
                  )}
                  <Badge>{selectedResearch.kategori}</Badge>
                  {renderStatusBadge(selectedResearch.stt_penetapan)}
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-8">
                  {/* Peneliti Section */}
                  <section className="bg-muted/30 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 p-4 border-b bg-muted/50">
                      <User className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Informasi Peneliti</h3>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {selectedResearch.name && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Nama Peneliti</p>
                              <p className="mt-1">{selectedResearch.name}</p>
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
                              <p className="mt-1">{selectedResearch.nidn}</p>
                            </div>
                          )}
                          {selectedResearch.sinta && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">ID SINTA</p>
                              <p className="mt-1">{selectedResearch.sinta}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Detail Section */}
                  <section className="bg-muted/30 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 p-4 border-b bg-muted/50">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Detail Penelitian</h3>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {selectedResearch.lokasi && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Lokasi</p>
                              <p className="mt-1">{selectedResearch.lokasi}</p>
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
                              <p className="mt-1">{selectedResearch.pelaporan}</p>
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Tanggal Dibuat</p>
                            <p className="mt-1">{formatDate(selectedResearch.created_at)}</p>
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
                    <section className="bg-muted/30 rounded-xl overflow-hidden">
                      <div className="flex items-center gap-2 p-4 border-b bg-muted/50">
                        <Users className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Informasi Mitra</h3>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            {selectedResearch.nm_mitra && (
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Nama Mitra</p>
                                <p className="mt-1">{selectedResearch.nm_mitra}</p>
                              </div>
                            )}
                            {selectedResearch.institusi_mitra && (
                              <div className="mt-4">
                                <p className="text-sm font-medium text-muted-foreground">Institusi</p>
                                <p className="mt-1">{selectedResearch.institusi_mitra}</p>
                              </div>
                            )}
                          </div>
                          {selectedResearch.bidang_mitra && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Bidang</p>
                              <p className="mt-1">{selectedResearch.bidang_mitra}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Financial Section */}
                  <section className="bg-muted/30 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 p-4 border-b bg-muted/50">
                      <CoinsIcon className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Informasi Finansial</h3>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Sumber Dana</p>
                            <p className="mt-1">{selectedResearch.sumber_dana || 'Tidak ada data'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Dana</p>
                            <p className="mt-1 text-lg font-semibold text-primary">
                              {formatCurrency(parseInt(selectedResearch.total_dana || selectedResearch.total_biaya || "0"))}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          {selectedResearch.b_kegiatan && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Biaya Kegiatan</p>
                              <p className="mt-1">{formatCurrency(selectedResearch.b_kegiatan)}</p>
                            </div>
                          )}
                          {selectedResearch.b_tahap1 && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Biaya Tahap 1</p>
                              <p className="mt-1">{formatCurrency(selectedResearch.b_tahap1)}</p>
                            </div>
                          )}
                          {selectedResearch.b_tahap2 && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Biaya Tahap 2</p>
                              <p className="mt-1">{formatCurrency(selectedResearch.b_tahap2)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Payment Status Section */}
                  {(selectedResearch.stt_bayar70 || selectedResearch.stt_bayar30) && (
                    <section className="bg-muted/30 rounded-xl overflow-hidden">
                      <div className="flex items-center gap-2 p-4 border-b bg-muted/50">
                        <BadgeCheck className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Status Pembayaran</h3>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            {selectedResearch.stt_bayar70 && (
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Pembayaran 70%</p>
                                <Badge
                                  variant="outline"
                                  className={selectedResearch.stt_bayar70 === "PAID" ? "text-green-500 border-green-500" : "text-amber-500 border-amber-500 mt-1"}
                                >
                                  {selectedResearch.stt_bayar70 === "PAID" ? "Dibayar" : "Belum Dibayar"}
                                </Badge>
                                {selectedResearch.jml_bayar70 && (
                                  <p className="mt-1 text-sm">{formatCurrency(parseInt(selectedResearch.jml_bayar70))}</p>
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
                                  className={selectedResearch.stt_bayar30 === "PAID" ? "text-green-500 border-green-500" : "text-amber-500 border-amber-500 mt-1"}
                                >
                                  {selectedResearch.stt_bayar30 === "PAID" ? "Dibayar" : "Belum Dibayar"}
                                </Badge>
                                {selectedResearch.jml_bayar30 && (
                                  <p className="mt-1 text-sm">{formatCurrency(parseInt(selectedResearch.jml_bayar30))}</p>
                                )}
                              </div>
                            )}
                            {selectedResearch.layak30 && (
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Kelayakan 30%</p>
                                <p className="mt-1">{selectedResearch.layak30}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Latar Belakang & Tugas Section */}
                  {(selectedResearch.l_belakang || selectedResearch.tugas_ketua) && (
                    <section className="bg-muted/30 rounded-xl overflow-hidden">
                      <div className="flex items-center gap-2 p-4 border-b bg-muted/50">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Latar Belakang & Tugas</h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-6">
                          {selectedResearch.tugas_ketua && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-2">Tugas Ketua</p>
                              <p className="whitespace-pre-line leading-relaxed">{selectedResearch.tugas_ketua}</p>
                            </div>
                          )}
                          {selectedResearch.l_belakang && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-2">Latar Belakang</p>
                              <p className="whitespace-pre-line leading-relaxed">{selectedResearch.l_belakang}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Technical IDs */}
                  <section className="bg-muted/30 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 p-4 border-b bg-muted/50">
                      <Hash className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Informasi Teknis</h3>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          {selectedResearch.id_proposal && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">ID Proposal</p>
                              <p className="text-sm mt-1 font-mono">{selectedResearch.id_proposal}</p>
                            </div>
                          )}
                          {selectedResearch.id_dosen && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">ID Dosen</p>
                              <p className="text-sm mt-1 font-mono">{selectedResearch.id_dosen}</p>
                            </div>
                          )}
                          {selectedResearch.id_jenis && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">ID Jenis</p>
                              <p className="text-sm mt-1 font-mono">{selectedResearch.id_jenis}</p>
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          {selectedResearch.id_periode && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">ID Periode</p>
                              <p className="text-sm mt-1 font-mono">{selectedResearch.id_periode}</p>
                            </div>
                          )}
                          {selectedResearch.id_bidang && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">ID Bidang</p>
                              <p className="text-sm mt-1 font-mono">{selectedResearch.id_bidang}</p>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a document related to {selectedResearch?.judul}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="docTitle">Document Title</Label>
              <Input id="docTitle" placeholder="Enter document title" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="docDescription">Description</Label>
              <Textarea id="docDescription" placeholder="Enter document description" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">File</Label>
              <Input
                ref={fileInputRef}
                id="file"
                type="file"
                onChange={handleFileChange}
              />
              {uploadedFile && (
                <p className="text-xs text-muted-foreground">
                  Selected file: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpload} disabled={isUploading || !uploadedFile}>
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
