"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { EntryManager } from "@/components/dynamic-form/entry-manager"
import { researchFields } from "./form-schemas"
import { Loader2, Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import React from "react"

interface ResearchTabProps {
  userData: any;
  isLoading: boolean;
}

export function ResearchTab({ userData, isLoading }: ResearchTabProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [researchData, setResearchData] = useState<any[]>([])
  const [selectedResearch, setSelectedResearch] = useState<any>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const dataProcessed = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (userData?.research_projects && !dataProcessed.current) {
      setResearchData(userData.research_projects)
      dataProcessed.current = true
    }
  }, [userData])

  const renderResearchPreview = (entry: any) => {
    return entry.judul
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
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
      formData.append("relatedItemId", selectedResearch.id)

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
        if (research.id === selectedResearch.id) {
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
  }

  const openUploadDialog = (research: any) => {
    setSelectedResearch(research)
    setIsDialogOpen(true)
  }

  const handleAddResearch = async (data: any) => {
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
  }

  const handleEditResearch = async (data: any) => {
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
      setResearchData(researchData.map(r => r.id === updatedResearch.id ? updatedResearch : r))

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
  }

  const handleDeleteResearch = async (id: string) => {
    try {
      const response = await fetch(`/api/academic/research?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete research project")
      }

      setResearchData(researchData.filter(r => r.id !== id))

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
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const renderCard = React.useCallback((entry: any): React.ReactNode => {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">{entry.judul}</CardTitle>
          <CardDescription>
            {entry.tahun_pelaksanaan || "Ongoing"} • {entry.sumber_dana || "Internal"}
            {entry.status_penetapan && (
              <Badge className="ml-2" variant={entry.status_penetapan === "Diterima" ? "default" : entry.status_penetapan === "Ditolak" ? "destructive" : "outline"}>
                {entry.status_penetapan}
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            {entry.latar_belakang ? entry.latar_belakang.substring(0, 150) + "..." : "No description available"}
          </div>

          {entry.documents && entry.documents.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Attached Documents</h4>
              <div className="space-y-2">
                {entry.documents.map((doc: any) => (
                  <div key={doc.id} className="bg-muted p-2 rounded-md text-sm flex justify-between items-center">
                    <span className="truncate">{doc.judul || doc.nama_file}</span>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => openUploadDialog(entry)}
          >
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        </CardFooter>
      </Card>
    );
  }, [openUploadDialog]);

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
