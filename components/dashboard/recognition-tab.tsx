"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { EntryManager } from "@/components/dynamic-form/entry-manager"
import { recognitionFields } from "./form-schemas"
import { Loader2 } from "lucide-react"

interface RecognitionTabProps {
  userData: any;
  isLoading: boolean;
}

export function RecognitionTab({ userData, isLoading }: RecognitionTabProps) {
  const { user } = useAuth()
  const [recognitionData, setRecognitionData] = useState<any[]>([])

  useEffect(() => {
    if (userData && userData.recognitions) {
      setRecognitionData(userData.recognitions)
    }
  }, [userData])

  const renderRecognitionPreview = (entry: any) => {
    return entry.judul
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
        title="Penghargaan"
        description="Masukkan informasi penghargaan dan rekognisi yang telah Anda terima."
        formFields={recognitionFields}
        dataKey="recognitionData"
        documentCategory="recognition"
        renderPreview={renderRecognitionPreview}
        initialData={recognitionData}
      />
    </div>
  )
}
