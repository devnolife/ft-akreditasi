"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateDocumentMetadata } from "@/lib/document-service"
import type { DocumentMetadata, DocumentCategory } from "@/types/document"
import { useToast } from "@/hooks/use-toast"
import { X, Plus, Save, Loader2 } from "lucide-react"

interface DocumentMetadataEditorProps {
  documentId: string
  initialMetadata: DocumentMetadata
  onSave?: (metadata: DocumentMetadata) => void
  onCancel?: () => void
}

export function DocumentMetadataEditor({ documentId, initialMetadata, onSave, onCancel }: DocumentMetadataEditorProps) {
  const { toast } = useToast()
  const [metadata, setMetadata] = useState<DocumentMetadata>({ ...initialMetadata })
  const [tags, setTags] = useState<string[]>(initialMetadata.tags || [])
  const [newTag, setNewTag] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const updatedMetadata = await updateDocumentMetadata(documentId, {
        ...metadata,
        tags,
      })

      if (updatedMetadata) {
        toast({
          title: "Metadata Updated",
          description: "Document metadata has been updated successfully.",
        })

        if (onSave) {
          onSave(updatedMetadata.metadata)
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update document metadata.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={metadata.title}
          onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
          placeholder="Document title"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={metadata.description || ""}
          onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
          placeholder="Document description"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          value={metadata.category}
          onValueChange={(value: DocumentCategory) => setMetadata({ ...metadata, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">Personal Data</SelectItem>
            <SelectItem value="research">Research</SelectItem>
            <SelectItem value="community-service">Community Service</SelectItem>
            <SelectItem value="publication">Publication</SelectItem>
            <SelectItem value="intellectual-property">Intellectual Property</SelectItem>
            <SelectItem value="recognition">Recognition</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Tags</Label>
        <div className="flex items-center space-x-2 mb-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add tag"
          />
          <Button type="button" size="sm" onClick={addTag}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center"
              >
                {tag}
                <Button variant="ghost" size="sm" className="h-4 w-4 ml-1 p-0" onClick={() => removeTag(tag)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
