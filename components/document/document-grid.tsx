"use client"

import { useState } from "react"
import type { Document } from "@/types/document"
import { DocumentCard } from "./document-card"
import { DocumentViewer } from "./document-viewer"
import { DocumentVersionHistory } from "./document-version-history"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DocumentGridProps {
  documents: Document[]
  onDocumentDeleted?: (document: Document) => void
}

export function DocumentGrid({ documents, onDocumentDeleted }: DocumentGridProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [activeTab, setActiveTab] = useState<"preview" | "versions">("preview")
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document)
    setActiveTab("preview")
    setDialogOpen(true)
  }

  const handleViewVersionHistory = (document: Document) => {
    setSelectedDocument(document)
    setActiveTab("versions")
    setDialogOpen(true)
  }

  const handleDocumentDeleted = (document: Document) => {
    if (onDocumentDeleted) {
      onDocumentDeleted(document)
    }
  }

  return (
    <>
      {documents.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No documents found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onView={handleViewDocument}
              onDelete={handleDocumentDeleted}
              onVersionHistory={handleViewVersionHistory}
            />
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          {selectedDocument && (
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "preview" | "versions")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="versions">Version History</TabsTrigger>
              </TabsList>
              <TabsContent value="preview">
                <DocumentViewer document={selectedDocument} />
              </TabsContent>
              <TabsContent value="versions">
                <DocumentVersionHistory documentId={selectedDocument.id} />
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
