"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getUserData } from "@/lib/data-service"
import { EntryManager } from "@/components/dynamic-form/entry-manager"
import { researchFields } from "./form-schemas"
import { Loader2 } from "lucide-react"

export function ResearchTab() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [researchData, setResearchData] = useState<any[]>([])

  useEffect(() => {
    const loadResearchData = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const userData = await getUserData(user.id)
        if (userData && userData.researchData) {
          setResearchData(userData.researchData)
        }
      } catch (error) {
        console.error("Error loading research data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadResearchData()
  }, [user])

  const renderResearchPreview = (entry: any) => {
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
        title="Penelitian"
        description="Masukkan informasi penelitian yang telah atau sedang Anda lakukan."
        formFields={researchFields}
        dataKey="researchData"
        documentCategory="research"
        renderPreview={renderResearchPreview}
      />
    </div>
  )
}
