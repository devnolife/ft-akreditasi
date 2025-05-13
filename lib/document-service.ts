// This service handles document storage and retrieval
// For simplicity in this demo, we're using localStorage

import type { Document, DocumentVersion, DocumentCategory, DocumentStats } from "@/types/document"
import prisma from "./prisma"
import type { DocumentCategory as PrismaDocumentCategory } from "@prisma/client"

// Helper function to generate a unique ID
const generateId = () => {
  return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Mock document data
const mockDocuments = [
  {
    id: "doc-1",
    title: "KTP",
    description: "Kartu Tanda Penduduk",
    category: "personal",
    fileType: "pdf",
    fileSize: 1024 * 1024 * 2, // 2MB
    uploadDate: new Date("2023-01-15"),
    userId: "user-1",
    tags: ["identity", "important"],
    versions: [
      {
        id: "v1",
        uploadDate: new Date("2023-01-15"),
        fileSize: 1024 * 1024 * 2,
        changeDescription: "Initial upload",
      },
    ],
  },
]

// Helper function to initialize documents in localStorage
const initialDocuments: Document[] = [
  {
    id: "doc-1",
    title: "CV Terbaru",
    description: "Curriculum Vitae yang diperbarui",
    filename: "cv_2023.pdf",
    fileSize: 1024 * 1024 * 2, // 2MB
    fileType: "application/pdf",
    uploadDate: new Date("2023-01-15").toISOString(),
    lastModified: new Date("2023-01-15").toISOString(),
    category: "personal",
    tags: ["cv", "personal", "profile"],
    userId: "user-1",
    versions: [
      {
        id: "ver-1",
        versionNumber: 1,
        filename: "cv_2023.pdf",
        fileSize: 1024 * 1024 * 2,
        uploadDate: new Date("2023-01-15").toISOString(),
        changeDescription: "Initial upload",
      },
    ],
    status: "active",
  },
  {
    id: "doc-2",
    title: "Proposal Penelitian",
    description: "Proposal penelitian terbaru",
    filename: "proposal_penelitian.docx",
    fileSize: 1024 * 1024 * 3, // 3MB
    fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    uploadDate: new Date("2023-02-20").toISOString(),
    lastModified: new Date("2023-03-10").toISOString(),
    category: "research",
    tags: ["proposal", "research", "funding"],
    userId: "user-1",
    versions: [
      {
        id: "ver-2",
        versionNumber: 1,
        filename: "proposal_penelitian_v1.docx",
        fileSize: 1024 * 1024 * 2.5,
        uploadDate: new Date("2023-02-20").toISOString(),
        changeDescription: "Initial upload",
      },
      {
        id: "ver-3",
        versionNumber: 2,
        filename: "proposal_penelitian.docx",
        fileSize: 1024 * 1024 * 3,
        uploadDate: new Date("2023-03-10").toISOString(),
        changeDescription: "Revisi setelah feedback",
      },
    ],
    status: "active",
  },
]

// Helper function to initialize documents in localStorage
const initializeDocuments = () => {
  try {
    const storedDocs = localStorage.getItem("documents")
    if (!storedDocs) {
      localStorage.setItem("documents", JSON.stringify(initialDocuments))
      return initialDocuments
    }
    return JSON.parse(storedDocs)
  } catch (error) {
    console.error("Error initializing documents:", error)
    return initialDocuments
  }
}

// Get all documents for a user
export async function getDocuments(userId: string) {
  try {
    const documents = await prisma.document.findMany({
      where: { userId },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        versions: {
          orderBy: {
            versionNumber: "desc",
          },
        },
      },
    })
    return documents
  } catch (error) {
    console.error("Error fetching documents:", error)
    throw new Error("Failed to fetch documents")
  }
}

// Get documents by category
export async function getDocumentsByCategory(userId: string, category: PrismaDocumentCategory) {
  try {
    const documents = await prisma.document.findMany({
      where: {
        userId,
        category,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        versions: {
          orderBy: {
            versionNumber: "desc",
          },
        },
      },
    })
    return documents
  } catch (error) {
    console.error("Error fetching documents by category:", error)
    throw new Error("Failed to fetch documents by category")
  }
}

// Get documents by related item
export async function getDocumentsByRelatedItem(userId: string, relatedItemType: string, relatedItemId: string) {
  try {
    // Map the related item type to the correct field
    const whereClause: any = { userId }

    switch (relatedItemType) {
      case "research":
        whereClause.researchProjectId = relatedItemId
        break
      case "community_service":
        whereClause.communityServiceId = relatedItemId
        break
      case "publication":
        whereClause.publicationId = relatedItemId
        break
      case "intellectual_property":
        whereClause.intellectualPropId = relatedItemId
        break
      case "recognition":
        whereClause.recognitionId = relatedItemId
        break
      default:
        throw new Error("Invalid related item type")
    }

    const documents = await prisma.document.findMany({
      where: whereClause,
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        versions: {
          orderBy: {
            versionNumber: "desc",
          },
        },
      },
    })
    return documents
  } catch (error) {
    console.error("Error fetching documents by related item:", error)
    throw new Error("Failed to fetch documents by related item")
  }
}

// Get a single document by ID
export async function getDocument(userId: string, documentId: string) {
  try {
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId,
      },
      include: {
        versions: {
          orderBy: {
            versionNumber: "desc",
          },
        },
      },
    })
    return document
  } catch (error) {
    console.error("Error fetching document:", error)
    throw new Error("Failed to fetch document")
  }
}

// Create a new document
export async function createDocument(data: any) {
  try {
    const document = await prisma.document.create({
      data: {
        ...data,
        tags: data.tags || [],
        version: 1,
        versions: {
          create: {
            versionNumber: 1,
            fileName: data.fileName,
            fileSize: data.fileSize,
            url: data.url,
            changeDescription: "Initial upload",
            createdBy: data.userId,
          },
        },
      },
      include: {
        versions: true,
      },
    })
    return document
  } catch (error) {
    console.error("Error creating document:", error)
    throw new Error("Failed to create document")
  }
}

// Update a document
export async function updateDocument(documentId: string, data: any) {
  try {
    const document = await prisma.document.update({
      where: { id: documentId },
      data: {
        ...data,
        tags: data.tags || [],
      },
    })
    return document
  } catch (error) {
    console.error("Error updating document:", error)
    throw new Error("Failed to update document")
  }
}

// Delete a document
export async function deleteDocument(documentId: string) {
  try {
    await prisma.document.delete({
      where: { id: documentId },
    })
    return { success: true }
  } catch (error) {
    console.error("Error deleting document:", error)
    throw new Error("Failed to delete document")
  }
}

// Add a new version to a document
export async function addDocumentVersion(documentId: string, data: any) {
  try {
    // Get the current document to determine the next version number
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        versions: {
          orderBy: {
            versionNumber: "desc",
          },
          take: 1,
        },
      },
    })

    if (!document) {
      throw new Error("Document not found")
    }

    const nextVersionNumber = document.versions.length > 0 ? document.versions[0].versionNumber + 1 : 1

    // Create the new version
    const newVersion = await prisma.documentVersion.create({
      data: {
        documentId,
        versionNumber: nextVersionNumber,
        fileName: data.fileName,
        fileSize: data.fileSize,
        url: data.url,
        changeDescription: data.changeDescription || `Version ${nextVersionNumber}`,
        createdBy: data.createdBy,
      },
    })

    // Update the document with the new file info
    await prisma.document.update({
      where: { id: documentId },
      data: {
        fileName: data.fileName,
        fileSize: data.fileSize,
        url: data.url,
        version: nextVersionNumber,
      },
    })

    return newVersion
  } catch (error) {
    console.error("Error adding document version:", error)
    throw new Error("Failed to add document version")
  }
}

// Filter documents
export async function filterDocuments(userId: string, filter: any) {
  try {
    const whereClause: any = { userId }

    // Apply search term filter
    if (filter.searchTerm) {
      whereClause.OR = [
        { title: { contains: filter.searchTerm, mode: "insensitive" } },
        { description: { contains: filter.searchTerm, mode: "insensitive" } },
        { fileName: { contains: filter.searchTerm, mode: "insensitive" } },
      ]
    }

    // Apply category filter
    if (filter.category) {
      whereClause.category = filter.category
    }

    // Apply file type filter
    if (filter.fileType) {
      whereClause.fileType = filter.fileType
    }

    // Apply date range filter
    if (filter.dateRange) {
      if (filter.dateRange.from) {
        whereClause.createdAt = {
          ...whereClause.createdAt,
          gte: filter.dateRange.from,
        }
      }
      if (filter.dateRange.to) {
        whereClause.createdAt = {
          ...whereClause.createdAt,
          lte: filter.dateRange.to,
        }
      }
    }

    // Apply tags filter
    if (filter.tags && filter.tags.length > 0) {
      whereClause.tags = {
        hasSome: filter.tags,
      }
    }

    const documents = await prisma.document.findMany({
      where: whereClause,
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        versions: {
          orderBy: {
            versionNumber: "desc",
          },
        },
      },
    })

    return documents
  } catch (error) {
    console.error("Error filtering documents:", error)
    throw new Error("Failed to filter documents")
  }
}

// Get all documents
export const getAllDocuments = async () => {
  return mockDocuments
}

// Get documents by category
export const getDocumentsByCategoryMock = async (category: string) => {
  return mockDocuments.filter((doc) => doc.category === category)
}

// Get document by ID
export const getDocumentById = async (id: string) => {
  return mockDocuments.find((doc) => doc.id === id)
}

// Upload a new document
// export const uploadDocument = async (documentData: any, file: File) => {
//   // In a real implementation, this would upload the file to a storage service
//   console.log("Uploading document:", documentData, file)
//   return {
//     id: `doc-${Date.now()}`,
//     ...documentData,
//     fileType: file.type,
//     fileSize: file.size,
//     uploadDate: new Date(),
//     versions: [
//       {
//         id: "v1",
//         uploadDate: new Date(),
//         fileSize: file.size,
//         changeDescription: "Initial upload",
//       },
//     ],
//   }
// }

// Upload a new version of an existing document
export const uploadNewVersion = async (
  documentId: string,
  versionData: {
    filename: string
    fileSize: number
    fileType: string
    changeDescription: string
  },
): Promise<{ success: boolean; versionId?: string; error?: string }> => {
  return new Promise((resolve) => {
    try {
      // Validate file size (max 10MB)
      if (versionData.fileSize > 10 * 1024 * 1024) {
        resolve({ success: false, error: "File size exceeds the maximum limit of 10MB" })
        return
      }

      const documents = initializeDocuments()
      const documentIndex = documents.findIndex((doc) => doc.id === documentId)

      if (documentIndex === -1) {
        resolve({ success: false, error: "Document not found" })
        return
      }

      const document = documents[documentIndex]
      const newVersionNumber = document.versions.length + 1
      const newVersionId = `ver-${Date.now()}`
      const now = new Date().toISOString()

      const newVersion: DocumentVersion = {
        id: newVersionId,
        versionNumber: newVersionNumber,
        filename: versionData.filename,
        fileSize: versionData.fileSize,
        uploadDate: now,
        changeDescription: versionData.changeDescription,
      }

      // Update document with new version
      documents[documentIndex] = {
        ...document,
        filename: versionData.filename,
        fileSize: versionData.fileSize,
        fileType: versionData.fileType,
        lastModified: now,
        versions: [...document.versions, newVersion],
      }

      localStorage.setItem("documents", JSON.stringify(documents))

      setTimeout(() => {
        resolve({ success: true, versionId: newVersionId })
      }, 500)
    } catch (error) {
      console.error("Error uploading new version:", error)
      resolve({ success: false, error: "Failed to upload new version" })
    }
  })
}

// Update document metadata
export const updateDocumentMetadata = async (id: string, metadata: any) => {
  console.log("Updating document metadata:", id, metadata)
  return { id, ...metadata }
}

// Permanently delete a document
export const permanentlyDeleteDocument = async (documentId: string): Promise<{ success: boolean; error?: string }> => {
  return new Promise((resolve) => {
    try {
      const documents = initializeDocuments()
      const updatedDocuments = documents.filter((doc) => doc.id !== documentId)

      localStorage.setItem("documents", JSON.stringify(updatedDocuments))

      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    } catch (error) {
      console.error("Error permanently deleting document:", error)
      resolve({ success: false, error: "Failed to permanently delete document" })
    }
  })
}

// Search documents
export const searchDocuments = async (query: string) => {
  return mockDocuments.filter(
    (doc) =>
      doc.title.toLowerCase().includes(query.toLowerCase()) ||
      doc.description.toLowerCase().includes(query.toLowerCase()),
  )
}

// Filter documents by tags
export const filterDocumentsByTags = async (tags: string[]): Promise<Document[]> => {
  return new Promise((resolve) => {
    try {
      if (!tags.length) {
        resolve([])
        return
      }

      const documents = initializeDocuments()

      const results = documents.filter((doc) => doc.status !== "deleted" && tags.some((tag) => doc.tags.includes(tag)))

      setTimeout(() => {
        resolve(results)
      }, 300)
    } catch (error) {
      console.error("Error filtering documents by tags:", error)
      resolve([])
    }
  })
}

// Get document statistics
export const getDocumentStats = async (): Promise<DocumentStats> => {
  return new Promise((resolve) => {
    try {
      const documents = initializeDocuments()
      const activeDocuments = documents.filter((doc) => doc.status !== "deleted")

      // Count by category
      const countByCategory = activeDocuments.reduce(
        (acc, doc) => {
          acc[doc.category] = (acc[doc.category] || 0) + 1
          return acc
        },
        {} as Record<DocumentCategory, number>,
      )

      // Count by file type
      const countByFileType = activeDocuments.reduce(
        (acc, doc) => {
          const fileType = doc.fileType
          acc[fileType] = (acc[fileType] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      // Total size
      const totalSize = activeDocuments.reduce((acc, doc) => acc + doc.fileSize, 0)

      // Average versions per document
      const avgVersions = activeDocuments.length
        ? activeDocuments.reduce((acc, doc) => acc + doc.versions.length, 0) / activeDocuments.length
        : 0

      setTimeout(() => {
        resolve({
          totalDocuments: activeDocuments.length,
          countByCategory,
          countByFileType,
          totalSize,
          avgVersions,
        })
      }, 300)
    } catch (error) {
      console.error("Error getting document stats:", error)
      resolve({
        totalDocuments: 0,
        countByCategory: {} as Record<DocumentCategory, number>,
        countByFileType: {},
        totalSize: 0,
        avgVersions: 0,
      })
    }
  })
}

// Validate file before upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png",
  "image/gif",
]

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    }
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "File type not supported. Please upload a PDF, Word, Excel, PowerPoint, or image file.",
    }
  }

  return { valid: true }
}

export async function uploadDocument(documentId: string, file: File): Promise<Document> {
  return new Promise((resolve, reject) => {
    try {
      // Simulate upload progress
      setTimeout(() => {
        // In a real app, we would upload the file to a storage service
        // and update the document with the real URL

        // For this demo, we'll just return the document
        const allUsersDocuments = Object.keys(localStorage)
          .filter((key) => key.startsWith("documents_"))
          .flatMap((key) => JSON.parse(localStorage.getItem(key) || "[]"))

        const document = allUsersDocuments.find((doc: Document) => doc.id === documentId)

        if (!document) {
          reject(new Error(`Document with ID ${documentId} not found`))
          return
        }

        resolve(document)
      }, 1500) // Simulate a delay for the upload
    } catch (error) {
      reject(error)
    }
  })
}

export async function getDocumentsByRelatedItemUser(relatedItemId: string, userId: string): Promise<Document[]> {
  return new Promise((resolve, reject) => {
    try {
      const documentsStr = localStorage.getItem(`documents_${userId}`) || "[]"
      const documents: Document[] = JSON.parse(documentsStr)

      const filteredDocuments = documents.filter((doc) => doc.metadata.relatedItemId === relatedItemId)

      resolve(filteredDocuments)
    } catch (error) {
      reject(error)
    }
  })
}

export async function getDocumentsByCategoryUser(category: string, userId: string): Promise<Document[]> {
  return new Promise((resolve, reject) => {
    try {
      const documentsStr = localStorage.getItem(`documents_${userId}`) || "[]"
      const documents: Document[] = JSON.parse(documentsStr)

      const filteredDocuments = documents.filter((doc) => doc.metadata.category === category)

      resolve(filteredDocuments)
    } catch (error) {
      reject(error)
    }
  })
}

// Get file type display name
export const getFileTypeDisplayName = (fileType: string): string => {
  const fileTypeMap: Record<string, string> = {
    "application/pdf": "PDF",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PowerPoint",
    "image/jpeg": "JPEG Image",
    "image/png": "PNG Image",
  }

  return fileTypeMap[fileType] || "Unknown"
}

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  } else {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }
}
