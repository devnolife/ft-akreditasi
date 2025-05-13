"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getUserData } from "@/lib/data-service"
import { EntryManager } from "@/components/dynamic-form/entry-manager"
import { recognitionFields } from "./form-schemas"
import { Loader2 } from "lucide-react"

export function RecognitionTab() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [recognitionData, setRecognitionData] = useState<any[]>([])

  useEffect(() => {
    const loadRecognitionData = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const userData = await getUserData(user.id)
        if (userData && userData.recognitionData) {
          setRecognitionData(userData.recognitionData)
        }
      } catch (error) {
        console.error("Error loading recognition data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRecognitionData()
  }, [user])

  const renderRecognitionPreview = (entry: any) => {
    return entry.title
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <EntryManager
        title="Rekognisi"
        description="Masukkan informasi penghargaan dan rekognisi yang telah Anda terima."
        formFields={recognitionFields}
        dataKey="recognitionData"
        documentCategory="recognition"
        renderPreview={renderRecognitionPreview}
      />
    </div>
  )
}
