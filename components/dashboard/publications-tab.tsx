"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { EntryManager } from "@/components/dynamic-form/entry-manager"
import { publicationFields } from "./form-schemas"
import { Loader2 } from "lucide-react"

interface PublicationsTabProps {
  userData: any;
  isLoading: boolean;
}

export function PublicationsTab({ userData, isLoading }: PublicationsTabProps) {
  const { user } = useAuth()
  const [publicationData, setPublicationData] = useState<any[]>([])

  useEffect(() => {
    if (userData && userData.publications) {
      setPublicationData(userData.publications)
    }
  }, [userData])

  const renderPublicationPreview = (entry: any) => {
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
        title="Publikasi"
        description="Masukkan informasi publikasi karya ilmiah Anda."
        formFields={publicationFields}
        dataKey="publicationData"
        documentCategory="publication"
        renderPreview={renderPublicationPreview}
        initialData={publicationData}
      />
    </div>
  )
}
