"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Document, DocumentCategory } from "@/types/document"
import { Search, Filter, X, Tag } from "lucide-react"

interface DocumentSearchProps {
  documents: Document[]
  onFilterChange: (filteredDocuments: Document[]) => void
  className?: string
}

export function DocumentSearch({ documents, onFilterChange, className }: DocumentSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory | "all">("all")
  const [tagFilter, setTagFilter] = useState<string | "all">("all")
  const [availableTags, setAvailableTags] = useState<string[]>([])

  // Extract all unique tags from documents
  useEffect(() => {
    const tags = new Set<string>()

    documents.forEach((doc) => {
      if (doc.metadata.tags) {
        doc.metadata.tags.forEach((tag) => tags.add(tag))
      }
    })

    setAvailableTags(Array.from(tags))
  }, [documents])

  // Apply filters
  useEffect(() => {
    const filtered = documents.filter((doc) => {
      // Apply search term filter
      const matchesSearch =
        searchTerm === "" ||
        doc.metadata.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.metadata.description && doc.metadata.description.toLowerCase().includes(searchTerm.toLowerCase()))

      // Apply category filter
      const matchesCategory = categoryFilter === "all" || doc.metadata.category === categoryFilter

      // Apply tag filter
      const matchesTag = tagFilter === "all" || (doc.metadata.tags && doc.metadata.tags.includes(tagFilter))

      return matchesSearch && matchesCategory && matchesTag
    })

    onFilterChange(filtered)
  }, [searchTerm, categoryFilter, tagFilter, documents, onFilterChange])

  const clearFilters = () => {
    setSearchTerm("")
    setCategoryFilter("all")
    setTagFilter("all")
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={(value: any) => setCategoryFilter(value)}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="community-service">Community Service</SelectItem>
              <SelectItem value="publication">Publication</SelectItem>
              <SelectItem value="intellectual-property">Intellectual Property</SelectItem>
              <SelectItem value="recognition">Recognition</SelectItem>
            </SelectContent>
          </Select>

          {availableTags.length > 0 && (
            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger className="w-[140px]">
                <Tag className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {availableTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {searchTerm || categoryFilter !== "all" || tagFilter !== "all" ? (
          <span>
            Filters applied: {searchTerm && <span className="font-medium">"{searchTerm}"</span>}
            {categoryFilter !== "all" && <span className="font-medium"> Category: {categoryFilter}</span>}
            {tagFilter !== "all" && <span className="font-medium"> Tag: {tagFilter}</span>}
          </span>
        ) : (
          <span>No filters applied</span>
        )}
      </div>
    </div>
  )
}
