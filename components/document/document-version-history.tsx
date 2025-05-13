"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Download, Eye, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DocumentVersion {
  id: string
  version: number
  fileName: string
  fileSize: string
  uploadedBy: string
  uploadDate: Date
  notes?: string
}

interface DocumentVersionHistoryProps {
  documentId: string
  className?: string
}

export function DocumentVersionHistory({ documentId, className }: DocumentVersionHistoryProps) {
  const [loading, setLoading] = useState(false)

  // Mock data if no versions are provided
  const documentVersions = [
    {
      id: "1",
      version: 1,
      fileName: "research-proposal-v1.pdf",
      fileSize: "2.4 MB",
      uploadedBy: "Dr. Ahmad",
      uploadDate: new Date("2023-01-15"),
      notes: "Initial upload",
    },
    {
      id: "2",
      version: 2,
      fileName: "research-proposal-v2.pdf",
      fileSize: "2.6 MB",
      uploadedBy: "Dr. Ahmad",
      uploadDate: new Date("2023-02-10"),
      notes: "Updated methodology section",
    },
    {
      id: "3",
      version: 3,
      fileName: "research-proposal-final.pdf",
      fileSize: "3.1 MB",
      uploadedBy: "Dr. Ahmad",
      uploadDate: new Date("2023-03-05"),
      notes: "Final version with reviewer comments addressed",
    },
  ]

  const handleViewDocument = (versionId: string) => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      console.log(`Viewing document version: ${versionId}`)
      setLoading(false)
      // In a real implementation, this would open the document in a viewer
    }, 500)
  }

  const handleDownloadDocument = (versionId: string) => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      console.log(`Downloading document version: ${versionId}`)
      setLoading(false)
      // In a real implementation, this would trigger a download
    }, 500)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Document History
        </CardTitle>
        <CardDescription>Riwayat perubahan dan versi dokumen yang telah diunggah</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {documentVersions.map((version, index) => (
            <div key={version.id} className="mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">{version.fileName}</h3>
                    <Badge variant="outline">v{version.version}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Diunggah oleh {version.uploadedBy} pada {format(version.uploadDate, "dd MMM yyyy")}
                  </p>
                  {version.notes && <p className="text-sm mt-2 bg-muted p-2 rounded-md">{version.notes}</p>}
                  <p className="text-xs text-muted-foreground mt-2">Ukuran file: {version.fileSize}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewDocument(version.id)} disabled={loading}>
                    <Eye className="h-4 w-4 mr-1" />
                    Lihat
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadDocument(version.id)}
                    disabled={loading}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Unduh
                  </Button>
                </div>
              </div>
              {index < documentVersions.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
