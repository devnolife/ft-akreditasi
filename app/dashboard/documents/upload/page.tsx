"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useDocumentUpload } from "@/hooks/use-document-upload"
import type { DocumentMetadata } from "@/types/document"
import { Upload, X, AlertCircle, Check, ArrowLeft, FileText } from "lucide-react"

export default function UploadDocumentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [dragActive, setDragActive] = useState(false)

  // Mock user ID - in a real app, this would come from authentication
  const userId = "user-123"

  const { upload, status, progress, error } = useDocumentUpload({
    category,
    userId,
    onSuccess: () => {
      toast({
        title: "Document uploaded successfully",
        description: "Your document has been uploaded and is now available.",
        variant: "default",
      })
      setTimeout(() => {
        router.push("/dashboard/documents")
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
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
    if (!category) {
      toast({
        title: "Category required",
        description: "Please select a category for your document.",
        variant: "destructive",
      })
      return
    }

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

  return (
    <div className="container mx-auto py-6">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>
            Upload a document to your lecturer profile. Supported formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              {!file ? (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Drag and drop your file here, or click to browse</p>
                  <Input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.zip,.rar"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    Browse Files
                  </Button>
                </>
              ) : (
                <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
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
              )}
            </div>

            {file && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={file.name}
                    disabled={status === "uploading"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    disabled={status === "uploading"}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="personal">Personal</option>
                    <option value="research">Research</option>
                    <option value="publication">Publication</option>
                    <option value="community">Community Service</option>
                    <option value="intellectual-property">Intellectual Property</option>
                    <option value="recognition">Recognition</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description..."
                    rows={3}
                    disabled={status === "uploading"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex items-center">
                    <Input
                      id="tags"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                      placeholder="Add tags..."
                      className="flex-1"
                      disabled={status === "uploading"}
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      className="ml-2"
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
                  <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <p className="text-sm">{error?.message || "An error occurred during upload"}</p>
                  </div>
                )}

                {status === "success" && (
                  <div className="bg-green-100 text-green-800 p-3 rounded-md flex items-center">
                    <Check className="h-4 w-4 mr-2" />
                    <p className="text-sm">Document uploaded successfully!</p>
                  </div>
                )}
              </>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={status === "uploading"}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!file || !category || status === "uploading" || status === "success"}
          >
            {status === "uploading" ? "Uploading..." : "Upload Document"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
