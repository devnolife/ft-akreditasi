"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/AuthContext"
import { saveDocument } from "@/lib/document-service"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, FileText, Check } from "lucide-react"
import type { DocumentCategory } from "@/types/document"

interface DocumentUploaderProps {
  category?: DocumentCategory
  relatedItemId?: string
  multiple?: boolean
  onUploadComplete?: () => void
}

export function DocumentUploader({
  category = "other",
  relatedItemId,
  multiple = false,
  onUploadComplete,
}: DocumentUploaderProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles(multiple ? filesArray : [filesArray[0]])
      setError(null)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files)
      setSelectedFiles(multiple ? filesArray : [filesArray[0]])
      setError(null)
    }
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (!user) {
      setError("You must be logged in to upload documents")
      return
    }

    if (selectedFiles.length === 0) {
      setError("Please select a file to upload")
      return
    }

    setUploading(true)
    setProgress(0)
    setError(null)
    setSuccess(false)

    try {
      // For demo purposes, we'll simulate the upload process
      // In a real app, you would upload to a server or cloud storage
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]

        // Simulate upload progress
        for (let p = 0; p <= 100; p += 10) {
          setProgress(p)
          await new Promise((resolve) => setTimeout(resolve, 100))
        }

        // Create a fake URL for the file
        const fileUrl = URL.createObjectURL(file)

        // Save document metadata
        await saveDocument(user.id, {
          title: title || file.name,
          description,
          fileUrl,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          category,
          tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
          relatedItemId,
          userId: user.id,
        })
      }

      setSuccess(true)
      toast({
        title: "Success",
        description: `${selectedFiles.length} document(s) uploaded successfully.`,
      })

      // Reset form
      setSelectedFiles([])
      setTitle("")
      setDescription("")
      setTags("")

      // Call the onUploadComplete callback if provided
      if (onUploadComplete) {
        onUploadComplete()
      }
    } catch (error) {
      console.error("Error uploading document:", error)
      setError("Failed to upload document. Please try again.")
      toast({
        title: "Error",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = () => {
    setSelectedFiles([])
    setTitle("")
    setDescription("")
    setTags("")
    setError(null)
    setSuccess(false)
  }

  return (
    <div className="space-y-4">
      {!selectedFiles.length ? (
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-12 w-12 mx-auto text-gray-400" />
          <p className="mt-2 text-sm font-medium">
            Drag and drop your file here, or <span className="text-blue-500">browse</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {multiple ? "Upload multiple files" : "Upload a single file"} (PDF, DOC, DOCX, JPG, PNG)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            multiple={multiple}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {file.type} • {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-red-500"
                  onClick={() => handleRemoveFile(index)}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Document title"
                disabled={uploading}
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Document description"
                disabled={uploading}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (Optional, comma separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. research, publication, important"
                disabled={uploading}
              />
            </div>
          </div>

          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-center text-gray-500">Uploading... {progress}%</p>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          {success && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-2 rounded">
              <Check className="h-4 w-4" />
              <p className="text-sm">Document uploaded successfully!</p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel} disabled={uploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={uploading || selectedFiles.length === 0}>
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
