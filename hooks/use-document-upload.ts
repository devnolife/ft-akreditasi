"use client"

import { useState } from "react"
import { updateDocument } from "@/lib/document-service"
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

      // Create FormData for the upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', metadata.title || file.name)
      formData.append('category', category)

      if (metadata.description) {
        formData.append('description', metadata.description)
      }

      if (metadata.tags && metadata.tags.length > 0) {
        formData.append('tags', JSON.stringify(metadata.tags))
      }

      if (metadata.relatedItemId) {
        formData.append('relatedItemId', metadata.relatedItemId)
      }

      // Upload using the API endpoint
      const xhr = new XMLHttpRequest()

      // Progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100
          setProgress(percentComplete)
        }
      })

      // Promise-based XHR request
      const uploadPromise = new Promise<Document>((resolve, reject) => {
        xhr.open('POST', '/api/documents/upload')

        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            const uploadedDoc = JSON.parse(xhr.responseText)
            resolve(uploadedDoc)
          } else {
            let errorMessage = 'Upload failed'
            try {
              const errorResponse = JSON.parse(xhr.responseText)
              errorMessage = errorResponse.error || errorMessage
            } catch (e) { }
            reject(new Error(errorMessage))
          }
        }

        xhr.onerror = function () {
          reject(new Error('Network error occurred during upload'))
        }

        xhr.send(formData)
      })

      // Wait for upload to complete
      const uploadedDoc = await uploadPromise

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
