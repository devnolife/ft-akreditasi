"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Document } from "@/types/document"
import { X, Download } from "lucide-react"

interface DocumentViewerProps {
  document: Document | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DocumentViewer({ document, open, onOpenChange }: DocumentViewerProps) {
  if (!document) return null

  const isPdf = document.fileType === "application/pdf"
  const isImage = document.fileType.startsWith("image/")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{document.title}</DialogTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" asChild>
              <a href={document.url} download={document.fileName}>
                <Download className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="overflow-auto max-h-[70vh] bg-slate-100 rounded-md">
          {isPdf && <iframe src={document.url} className="w-full h-full min-h-[500px]" title={document.fileName} />}

          {isImage && (
            <div className="flex items-center justify-center p-4">
              <img src={document.url || "/placeholder.svg"} alt={document.fileName} className="max-w-full" />
            </div>
          )}

          {!isPdf && !isImage && (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-lg font-medium mb-2">Preview not available</p>
              <p className="text-sm text-muted-foreground mb-4">This file type cannot be previewed.</p>
              <Button asChild>
                <a href={document.url} download={document.fileName}>
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
