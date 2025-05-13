"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { EntryManager } from "@/components/dynamic-form/entry-manager"
import { communityServiceFields } from "./form-schemas"
import { Loader2 } from "lucide-react"

interface CommunityServiceTabProps {
  userData: any;
  isLoading: boolean;
}

export function CommunityServiceTab({ userData, isLoading }: CommunityServiceTabProps) {
  const { user } = useAuth()
  const [communityServiceData, setCommunityServiceData] = useState<any[]>([])

  useEffect(() => {
    if (userData && userData.community_services) {
      setCommunityServiceData(userData.community_services)
    }
  }, [userData])

  const renderCommunityServicePreview = (entry: any) => {
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
        title="Pengabdian Masyarakat"
        description="Masukkan informasi kegiatan pengabdian masyarakat yang telah Anda lakukan."
        formFields={communityServiceFields}
        dataKey="communityServiceData"
        documentCategory="community_service"
        renderPreview={renderCommunityServicePreview}
        initialData={communityServiceData}
      />
    </div>
  )
}
