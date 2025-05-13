"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DocumentGrid } from "@/components/document/document-grid"
import { DocumentFilter, type DocumentFilters } from "@/components/document/document-filter"
import type { Document } from "@/types/document"
import { getDocuments } from "@/lib/document-service"
import { Plus, FileText, Upload } from "lucide-react"

export default function DocumentsPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [filters, setFilters] = useState<DocumentFilters>({
    searchTerm: "",
    category: "",
    fileType: "",
    dateFrom: null,
    dateTo: null,
    tags: [],
  })

  // Mock user ID - in a real app, this would come from authentication
  const userId = "user-123"

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // In a real app, this would fetch from your API
        const docs = await getDocuments(userId)
        setDocuments(docs)
        setFilteredDocuments(docs)
      } catch (error) {
        console.error("Error fetching documents:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [userId])

  useEffect(() => {
    let filtered = [...documents]

    // Filter by tab category
    if (activeTab !== "all") {
      filtered = filtered.filter((doc) => doc.metadata.category === activeTab)
    }

    // Apply search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (doc) =>
          doc.metadata.title?.toLowerCase().includes(searchLower) ||
          doc.metadata.description?.toLowerCase().includes(searchLower) ||
          doc.metadata.fileName.toLowerCase().includes(searchLower) ||
          doc.metadata.tags?.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter((doc) => doc.metadata.category === filters.category)
    }

    // Apply file type filter
    if (filters.fileType) {
      filtered = filtered.filter((doc) => doc.metadata.fileType.includes(filters.fileType))
    }

    // Apply date filters
    if (filters.dateFrom) {
      filtered = filtered.filter((doc) => new Date(doc.metadata.uploadDate) >= filters.dateFrom!)
    }

    if (filters.dateTo) {
      filtered = filtered.filter((doc) => new Date(doc.metadata.uploadDate) <= filters.dateTo!)
    }

    // Apply tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter((doc) => filters.tags.every((tag) => doc.metadata.tags?.includes(tag)))
    }

    setFilteredDocuments(filtered)
  }, [documents, activeTab, filters])

  const handleDocumentDeleted = (deletedDoc: Document) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== deletedDoc.id))
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (documents.length === 0) {
      return (
        <div className="text-center py-20">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No documents yet</h3>
          <p className="text-muted-foreground mb-6">Upload your first document to get started</p>
          <Button onClick={() => router.push("/dashboard/documents/upload")}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <DocumentFilter onFilterChange={setFilters} />

        <DocumentGrid documents={filteredDocuments} onDocumentDeleted={handleDocumentDeleted} />

        {filteredDocuments.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No documents match your filters</p>
            <Button
              variant="link"
              onClick={() =>
                setFilters({
                  searchTerm: "",
                  category: "",
                  fileType: "",
                  dateFrom: null,
                  dateTo: null,
                  tags: [],
                })
              }
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Manage your uploaded documents</p>
        </div>
        <Button onClick={() => router.push("/dashboard/documents/upload")}>
          <Plus className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
          <CardDescription>View and manage all your uploaded documents</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="research">Research</TabsTrigger>
              <TabsTrigger value="publication">Publications</TabsTrigger>
              <TabsTrigger value="community">Community Service</TabsTrigger>
              <TabsTrigger value="intellectual-property">Intellectual Property</TabsTrigger>
              <TabsTrigger value="recognition">Recognition</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>{renderContent()}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
