export type DocumentCategory =
  | "personal"
  | "research"
  | "community_service"
  | "publication"
  | "intellectual_property"
  | "recognition"
  | "other"

export interface Document {
  id: string
  title: string
  description?: string
  fileName: string
  fileSize: number
  fileType: string
  uploadDate: string
  category: DocumentCategory
  tags?: string[]
  url?: string
  thumbnailUrl?: string
  version?: number
  relatedItemId?: string
  userId: string
  createdAt?: string
  updatedAt?: string
}

export interface DocumentVersion {
  id: string
  documentId: string
  versionNumber: number
  fileName: string
  fileSize: number
  uploadDate: string
  changeDescription: string
}

export interface DocumentFilter {
  searchTerm?: string
  category?: DocumentCategory
  fileType?: string
  dateRange?: {
    from?: Date
    to?: Date
  }
  tags?: string[]
}

export interface DocumentUploadProgress {
  documentId: string
  progress: number
  status: "uploading" | "processing" | "completed" | "error"
  error?: string
}

export interface DocumentStats {
  totalDocuments: number
  countByCategory: Record<DocumentCategory, number>
  countByFileType: Record<string, number>
  totalSize: number
  avgVersions: number
}
