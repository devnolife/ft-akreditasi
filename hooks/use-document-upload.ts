"use client"

import { useState } from "react"
import { uploadDocument, updateDocument } from "@/lib/document-service"
import type { Document, DocumentMetadata } from "@/types/document"

export type UploadStatus = "idle" | "uploading" | "success" | "error"

export interface UseDocumentUploadProps {
  category: string
  userId: string
  onSuccess?: (document: Document) => void
  onError?: (error: Error) => void
}

export function useDocumentUpload({ category, userId, onSuccess, onError }: UseDocumentUploadProps) {
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)
  const [document, setDocument] = useState<Document | null>(null)

  const upload = async (file: File, metadata: DocumentMetadata) => {
    try {
      setStatus("uploading")
      setProgress(0)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 10
          return newProgress >= 95 ? 95 : newProgress
        })
      }, 300)

      // Upload the document
      const uploadedDoc = await uploadDocument({
        file,
        metadata: {
          ...metadata,
          category,
          userId,
          uploadDate: new Date().toISOString(),
          fileSize: file.size,
          fileType: file.type,
          fileName: file.name,
        },
      })

      clearInterval(progressInterval)
      setProgress(100)
      setStatus("success")
      setDocument(uploadedDoc)

      if (onSuccess) {
        onSuccess(uploadedDoc)
      }

      return uploadedDoc
    } catch (err) {
      setStatus("error")
      const error = err instanceof Error ? err : new Error("Unknown error occurred during upload")
      setError(error)

      if (onError) {
        onError(error)
      }

      throw error
    }
  }

  const updateMetadata = async (docId: string, metadata: Partial<DocumentMetadata>) => {
    try {
      setStatus("uploading")

      const updatedDoc = await updateDocument(docId, { metadata })

      setStatus("success")
      setDocument(updatedDoc)

      if (onSuccess) {
        onSuccess(updatedDoc)
      }

      return updatedDoc
    } catch (err) {
      setStatus("error")
      const error = err instanceof Error ? err : new Error("Unknown error occurred during metadata update")
      setError(error)

      if (onError) {
        onError(error)
      }

      throw error
    }
  }

  const reset = () => {
    setStatus("idle")
    setProgress(0)
    setError(null)
    setDocument(null)
  }

  return {
    upload,
    updateMetadata,
    reset,
    status,
    progress,
    error,
    document,
  }
}
