"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getUserData } from "@/lib/data-service"
import { EntryManager } from "@/components/dynamic-form/entry-manager"
import { communityServiceFields } from "./form-schemas"
import { Loader2 } from "lucide-react"

export function CommunityServiceTab() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [serviceData, setServiceData] = useState<any[]>([])

  useEffect(() => {
    const loadServiceData = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const userData = await getUserData(user.id)
        if (userData && userData.communityServiceData) {
          setServiceData(userData.communityServiceData)
        }
      } catch (error) {
        console.error("Error loading community service data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadServiceData()
  }, [user])

  const renderServicePreview = (entry: any) => {
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
        title="Pengabdian Masyarakat"
        description="Masukkan informasi kegiatan pengabdian masyarakat yang telah Anda lakukan."
        formFields={communityServiceFields}
        dataKey="communityServiceData"
        documentCategory="community_service"
        renderPreview={renderServicePreview}
      />
    </div>
  )
}
