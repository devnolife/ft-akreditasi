"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getUserData } from "@/lib/data-service"
import { EntryManager } from "@/components/dynamic-form/entry-manager"
import { personalDataFields } from "./form-schemas"
import { Loader2 } from "lucide-react"

export function PersonalDataTab() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [personalData, setPersonalData] = useState<any>(null)

  useEffect(() => {
    const loadPersonalData = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const userData = await getUserData(user.id)
        if (userData && userData.personalData) {
          setPersonalData(userData.personalData)
        }
      } catch (error) {
        console.error("Error loading personal data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPersonalData()
  }, [user])

  const renderPersonalDataPreview = (entry: any) => {
    return `${entry.frontDegree || ""} ${entry.name} ${entry.backDegree || ""}`.trim()
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
        title="Data Diri"
        description="Masukkan informasi data diri Anda sebagai dosen."
        formFields={personalDataFields}
        dataKey="personalData"
        documentCategory="personal"
        renderPreview={renderPersonalDataPreview}
      />
    </div>
  )
}
