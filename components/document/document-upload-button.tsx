"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { DocumentMetadata } from "@/types/document"
import { useDocumentUpload } from "@/hooks/use-document-upload"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Upload, X, Check, AlertCircle } from "lucide-react"

interface DocumentUploadButtonProps {
  userId: string
  category: string
  onUploadComplete?: () => void
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

export function DocumentUploadButton({
  userId,
  category,
  onUploadComplete,
  variant = "default",
  size = "default",
}: DocumentUploadButtonProps) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const { upload, status, progress, error, reset } = useDocumentUpload({
    category,
    userId,
    onSuccess: () => {
      toast({
        title: "Document uploaded successfully",
        description: "Your document has been uploaded and is now available.",
        variant: "default",
      })
      if (onUploadComplete) {
        onUploadComplete()
      }
      setTimeout(() => {
        handleClose()
      }, 1500)
    },
    onError: (err) => {
      toast({
        title: "Upload failed",
        description: err.message,
        variant: "destructive",
      })
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    const metadata: DocumentMetadata = {
      title: title || file.name,
      description,
      tags,
      category,
      userId,
      uploadDate: new Date().toISOString(),
      fileSize: file.size,
      fileType: file.type,
      fileName: file.name,
      version: 1,
    }

    try {
      await upload(file, metadata)
    } catch (err) {
      console.error("Upload failed:", err)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setFile(null)
    setTitle("")
    setDescription("")
    setTags([])
    setCurrentTag("")
    reset()
  }

  const handleTriggerClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.zip,.rar"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={variant} size={size} onClick={handleTriggerClick}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </DialogTrigger>

        {file && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Selected File</p>
                <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                    disabled={status === "uploading"}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={file.name}
                  className="w-full p-2 border rounded-md mt-1"
                  disabled={status === "uploading"}
                />
              </div>

              <div>
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description..."
                  className="w-full p-2 border rounded-md mt-1 resize-none"
                  rows={3}
                  disabled={status === "uploading"}
                />
              </div>

              <div>
                <label htmlFor="tags" className="text-sm font-medium">
                  Tags
                </label>
                <div className="flex items-center mt-1">
                  <input
                    id="tags"
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                    placeholder="Add tags..."
                    className="flex-1 p-2 border rounded-l-md"
                    disabled={status === "uploading"}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    className="rounded-l-none"
                    disabled={!currentTag.trim() || status === "uploading"}
                  >
                    Add
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-primary hover:text-primary/80"
                          disabled={status === "uploading"}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {status === "uploading" && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground">Uploading... {Math.round(progress)}%</p>
                </div>
              )}

              {status === "error" && (
                <div className="bg-destructive/10 text-destructive p-2 rounded-md flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <p className="text-sm">{error?.message || "An error occurred during upload"}</p>
                </div>
              )}

              {status === "success" && (
                <div className="bg-green-100 text-green-800 p-2 rounded-md flex items-center">
                  <Check className="h-4 w-4 mr-2" />
                  <p className="text-sm">Document uploaded successfully!</p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose} disabled={status === "uploading"}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!file || status === "uploading" || status === "success"}>
                  {status === "uploading" ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
