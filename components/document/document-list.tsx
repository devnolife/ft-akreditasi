"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DocumentUploader } from "./document-uploader"
import { useAuth } from "@/contexts/AuthContext"
import { getDocumentsByRelatedItem, deleteDocument } from "@/lib/document-service"
import type { Document } from "@/types/document"
import { FileText, Download, Trash2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DocumentListProps {
  relatedItemId: string
  className?: string
}

export function DocumentList({ relatedItemId, className = "" }: DocumentListProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploaderOpen, setIsUploaderOpen] = useState(false)

  useEffect(() => {
    if (user && relatedItemId) {
      loadDocuments()
    }
  }, [user, relatedItemId])

  const loadDocuments = async () => {
    if (!user || !relatedItemId) return

    setIsLoading(true)
    try {
      const docs = await getDocumentsByRelatedItem(user.id, relatedItemId)
      setDocuments(docs)
    } catch (error) {
      console.error("Error loading documents:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDocumentUploaded = () => {
    loadDocuments()
    setIsUploaderOpen(false)
  }

  const handleDeleteDocument = async (documentId: string) => {
    if (!user) return

    if (!confirm("Are you sure you want to delete this document?")) {
      return
    }

    try {
      await deleteDocument(user.id, documentId)
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
      toast({
        title: "Success",
        description: "Document deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting document:", error)
      toast({
        title: "Error",
        description: "Failed to delete document.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = (document: Document) => {
    // Create a temporary anchor element
    const link = document.createElement("a")
    link.href = document.fileUrl
    link.download = document.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading documents...</div>
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-medium">Documents</h4>
        <Button size="sm" variant="outline" onClick={() => setIsUploaderOpen(!isUploaderOpen)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Document
        </Button>
      </div>

      {isUploaderOpen && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <DocumentUploader relatedItemId={relatedItemId} onUploadComplete={handleDocumentUploaded} multiple={true} />
          </CardContent>
        </Card>
      )}

      {documents.length === 0 ? (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No documents attached. Click "Add Document" to upload.
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <Card key={doc.id} className="p-3 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">{doc.title || doc.fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {(doc.fileSize / 1024).toFixed(1)} KB • {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="ghost" onClick={() => handleDownload(doc)}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteDocument(doc.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
