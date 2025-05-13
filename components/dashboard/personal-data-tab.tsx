"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { EntryManager } from "@/components/dynamic-form/entry-manager"
import { personalDataFields } from "./form-schemas"
import { Loader2 } from "lucide-react"

interface PersonalDataTabProps {
  userData: any;
  isLoading: boolean;
}

export function PersonalDataTab({ userData, isLoading }: PersonalDataTabProps) {
  const { user } = useAuth()
  const [personalData, setPersonalData] = useState<any>(null)
  const initialDataProcessed = useRef(false)

  useEffect(() => {
    // Only process the userData if it exists and we haven't processed it yet
    // or if userData has changed (via deep comparison or another mechanism)
    if (userData?.personal_data && (!initialDataProcessed.current || !personalData)) {
      setPersonalData(userData.personal_data)
      initialDataProcessed.current = true
    }
  }, [userData, personalData])

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
        initialData={personalData}
      />
    </div>
  )
}
