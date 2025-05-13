"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { EntryManager } from "@/components/dynamic-form/entry-manager"
import { researchFields } from "./form-schemas"
import { Loader2 } from "lucide-react"

interface ResearchTabProps {
  userData: any;
  isLoading: boolean;
}

export function ResearchTab({ userData, isLoading }: ResearchTabProps) {
  const { user } = useAuth()
  const [researchData, setResearchData] = useState<any[]>([])
  const dataProcessed = useRef(false)

  useEffect(() => {
    if (userData?.research_projects && !dataProcessed.current) {
      setResearchData(userData.research_projects)
      dataProcessed.current = true
    }
  }, [userData])

  const renderResearchPreview = (entry: any) => {
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
        title="Penelitian"
        description="Masukkan informasi penelitian yang telah atau sedang Anda lakukan."
        formFields={researchFields}
        dataKey="researchData"
        documentCategory="research"
        renderPreview={renderResearchPreview}
        initialData={researchData}
      />
    </div>
  )
}
