"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, Filter, X } from "lucide-react"

interface DocumentFilterProps {
  onFilterChange: (filters: DocumentFilters) => void
}

export interface DocumentFilters {
  searchTerm: string
  category: string
  fileType: string
  dateFrom: Date | null
  dateTo: Date | null
  tags: string[]
}

const initialFilters: DocumentFilters = {
  searchTerm: "",
  category: "",
  fileType: "",
  dateFrom: null,
  dateTo: null,
  tags: [],
}

export function DocumentFilter({ onFilterChange }: DocumentFilterProps) {
  const [filters, setFilters] = useState<DocumentFilters>(initialFilters)
  const [isOpen, setIsOpen] = useState(false)
  const [currentTag, setCurrentTag] = useState("")

  const handleFilterChange = (key: keyof DocumentFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleAddTag = () => {
    if (currentTag.trim() && !filters.tags.includes(currentTag.trim())) {
      const newTags = [...filters.tags, currentTag.trim()]
      handleFilterChange("tags", newTags)
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    const newTags = filters.tags.filter((t) => t !== tag)
    handleFilterChange("tags", newTags)
  }

  const handleReset = () => {
    setFilters(initialFilters)
    onFilterChange(initialFilters)
  }

  const hasActiveFilters = () => {
    return (
      filters.searchTerm !== "" ||
      filters.category !== "" ||
      filters.fileType !== "" ||
      filters.dateFrom !== null ||
      filters.dateTo !== null ||
      filters.tags.length > 0
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search documents..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            className="pr-10"
          />
          {filters.searchTerm && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => handleFilterChange("searchTerm", "")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
              {hasActiveFilters() && (
                <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {
                    Object.values(filters).filter((v) => (Array.isArray(v) ? v.length > 0 : v !== "" && v !== null))
                      .length
                  }
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="publication">Publication</SelectItem>
                    <SelectItem value="community">Community Service</SelectItem>
                    <SelectItem value="intellectual-property">Intellectual Property</SelectItem>
                    <SelectItem value="recognition">Recognition</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileType">File Type</Label>
                <Select value={filters.fileType} onValueChange={(value) => handleFilterChange("fileType", value)}>
                  <SelectTrigger id="fileType">
                    <SelectValue placeholder="Select file type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="application/pdf">PDF</SelectItem>
                    <SelectItem value="application/msword">Word</SelectItem>
                    <SelectItem value="application/vnd.ms-excel">Excel</SelectItem>
                    <SelectItem value="application/vnd.ms-powerpoint">PowerPoint</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateFrom ? format(filters.dateFrom, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateFrom || undefined}
                        onSelect={(date) => handleFilterChange("dateFrom", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateTo ? format(filters.dateTo, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateTo || undefined}
                        onSelect={(date) => handleFilterChange("dateTo", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
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
                    placeholder="Add tag..."
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddTag} className="ml-2" disabled={!currentTag.trim()}>
                    Add
                  </Button>
                </div>

                {filters.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filters.tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-primary hover:text-primary/80"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Reset Filters
                </Button>
                <Button size="sm" onClick={() => setIsOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {hasActiveFilters() && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <div className="flex items-center bg-muted text-xs px-2 py-1 rounded-full">
              Category: {filters.category}
              <button
                type="button"
                onClick={() => handleFilterChange("category", "")}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {filters.fileType && (
            <div className="flex items-center bg-muted text-xs px-2 py-1 rounded-full">
              File Type: {filters.fileType.split("/")[1] || filters.fileType}
              <button
                type="button"
                onClick={() => handleFilterChange("fileType", "")}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {filters.dateFrom && (
            <div className="flex items-center bg-muted text-xs px-2 py-1 rounded-full">
              From: {format(filters.dateFrom, "PP")}
              <button
                type="button"
                onClick={() => handleFilterChange("dateFrom", null)}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {filters.dateTo && (
            <div className="flex items-center bg-muted text-xs px-2 py-1 rounded-full">
              To: {format(filters.dateTo, "PP")}
              <button
                type="button"
                onClick={() => handleFilterChange("dateTo", null)}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {filters.tags.map((tag) => (
            <div key={tag} className="flex items-center bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
              Tag: {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-primary hover:text-primary/80"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          <Button variant="ghost" size="sm" className="text-xs h-6" onClick={handleReset}>
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}
