"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getUserData } from "@/lib/data-service"
import { EntryManager } from "@/components/dynamic-form/entry-manager"
import { publicationFields } from "./form-schemas"
import { Loader2 } from "lucide-react"

export function PublicationsTab() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [publicationData, setPublicationData] = useState<any[]>([])

  useEffect(() => {
    const loadPublicationData = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const userData = await getUserData(user.id)
        if (userData && userData.publicationData) {
          setPublicationData(userData.publicationData)
        }
      } catch (error) {
        console.error("Error loading publication data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPublicationData()
  }, [user])

  const renderPublicationPreview = (entry: any) => {
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
        title="Publikasi"
        description="Masukkan informasi publikasi ilmiah yang telah Anda hasilkan."
        formFields={publicationFields}
        dataKey="publicationData"
        documentCategory="publication"
        renderPreview={renderPublicationPreview}
      />
    </div>
  )
}
