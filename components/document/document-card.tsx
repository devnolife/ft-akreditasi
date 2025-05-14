"use client"

import React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Document } from "@/types/document"
import { formatDistanceToNow } from "date-fns"
import { FileText, Download, Trash2, Eye, History } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { deleteDocument } from "@/lib/document-service"

interface DocumentCardProps {
  document: Document
  onView?: (document: Document) => void
  onDelete?: (document: Document) => void
  onVersionHistory?: (document: Document) => void
}

export function DocumentCard({ document, onView, onDelete, onVersionHistory }: DocumentCardProps) {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      setIsDeleting(true)
      try {
        await deleteDocument(document.id)
        toast({
          title: "Document deleted",
          description: "The document has been successfully deleted.",
          variant: "default",
        })
        if (onDelete) {
          onDelete(document)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete the document. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleDownload = () => {
    // In a real implementation, this would download the file from the server
    window.open(document.url, "_blank")
  }

  const getFileIcon = () => {
    const fileType = document.metadata.fileType
    if (fileType.includes("pdf")) {
      return <FileText className="h-10 w-10 text-red-500" />
    } else if (fileType.includes("word") || fileType.includes("doc")) {
      return <FileText className="h-10 w-10 text-blue-500" />
    } else if (fileType.includes("excel") || fileType.includes("sheet") || fileType.includes("xls")) {
      return <FileText className="h-10 w-10 text-green-500" />
    } else if (fileType.includes("powerpoint") || fileType.includes("presentation") || fileType.includes("ppt")) {
      return <FileText className="h-10 w-10 text-orange-500" />
    } else {
      return <FileText className="h-10 w-10 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-1 px-3 py-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getFileIcon()}
            <div>
              <CardTitle className="text-sm truncate max-w-[180px]">
                {document.metadata.title || document.metadata.fileName}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{formatFileSize(document.metadata.fileSize)}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-1 px-3 py-2">
        {document.metadata.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{document.metadata.description}</p>
        )}
        <div className="mt-1">
          <p className="text-xs text-muted-foreground">
            Uploaded {formatDistanceToNow(new Date(document.metadata.uploadDate), { addSuffix: true })}
          </p>
          {document.metadata.tags && document.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {document.metadata.tags.map((tag) => (
                <span key={tag} className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-1 px-3 py-2">
        <div className="flex justify-between w-full">
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => onView && onView(document)}>
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <div className="flex space-x-1">
            <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={handleDownload}>
              <Download className="h-3 w-3" />
              <span className="sr-only">Download</span>
            </Button>
            {onVersionHistory && (
              <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => onVersionHistory(document)}>
                <History className="h-3 w-3" />
                <span className="sr-only">Version History</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
