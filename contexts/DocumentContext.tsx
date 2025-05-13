"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Document, DocumentMetadata } from "@/types/document"
import { getDocuments, getDocumentById, uploadDocument, updateDocument, deleteDocument } from "@/lib/document-service"

interface DocumentContextType {
  documents: Document[]
  loading: boolean
  error: Error | null
  selectedDocument: Document | null
  fetchDocuments: (userId: string, category?: string) => Promise<Document[]>
  fetchDocument: (id: string) => Promise<Document | null>
  uploadDocument: (file: File, metadata: DocumentMetadata) => Promise<Document>
  updateDocumentMetadata: (id: string, metadata: Partial<DocumentMetadata>) => Promise<Document>
  removeDocument: (id: string) => Promise<boolean>
  selectDocument: (document: Document | null) => void
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined)

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  const fetchDocuments = async (userId: string, category?: string): Promise<Document[]> => {
    setLoading(true)
    setError(null)
    try {
      const docs = await getDocuments(userId, category)
      setDocuments(docs)
      return docs
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch documents")
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchDocument = async (id: string): Promise<Document | null> => {
    setLoading(true)
    setError(null)
    try {
      const doc = await getDocumentById(id)
      if (doc) {
        setSelectedDocument(doc)
      }
      return doc
    } catch (err) {
      const error = err instanceof Error ? err : new Error(`Failed to fetch document with ID: ${id}`)
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const uploadNewDocument = async (file: File, metadata: DocumentMetadata): Promise<Document> => {
    setLoading(true)
    setError(null)
    try {
      const doc = await uploadDocument({ file, metadata })
      setDocuments((prev) => [...prev, doc])
      return doc
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to upload document")
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateDocumentMetadata = async (id: string, metadata: Partial<DocumentMetadata>): Promise<Document> => {
    setLoading(true)
    setError(null)
    try {
      const updatedDoc = await updateDocument(id, { metadata })
      setDocuments((prev) => prev.map((doc) => (doc.id === id ? updatedDoc : doc)))
      if (selectedDocument?.id === id) {
        setSelectedDocument(updatedDoc)
      }
      return updatedDoc
    } catch (err) {
      const error = err instanceof Error ? err : new Error(`Failed to update document with ID: ${id}`)
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const removeDocument = async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const success = await deleteDocument(id)
      if (success) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id))
        if (selectedDocument?.id === id) {
          setSelectedDocument(null)
        }
      }
      return success
    } catch (err) {
      const error = err instanceof Error ? err : new Error(`Failed to delete document with ID: ${id}`)
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const selectDocument = (document: Document | null) => {
    setSelectedDocument(document)
  }

  const value = {
    documents,
    loading,
    error,
    selectedDocument,
    fetchDocuments,
    fetchDocument,
    uploadDocument: uploadNewDocument,
    updateDocumentMetadata,
    removeDocument,
    selectDocument,
  }

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>
}

export function useDocuments() {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentProvider")
  }
  return context
}
