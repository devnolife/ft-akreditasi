"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { EntryManager } from "@/components/dynamic-form/entry-manager"
import { intellectualPropertyFields } from "./form-schemas"
import { Loader2 } from "lucide-react"

interface IntellectualPropertyTabProps {
  userData: any;
  isLoading: boolean;
}

export function IntellectualPropertyTab({ userData, isLoading }: IntellectualPropertyTabProps) {
  const { user } = useAuth()
  const [intellectualPropData, setIntellectualPropData] = useState<any[]>([])

  useEffect(() => {
    if (userData && userData.intellectual_props) {
      setIntellectualPropData(userData.intellectual_props)
    }
  }, [userData])

  const renderIntellectualPropPreview = (entry: any) => {
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
        title="Hak Kekayaan Intelektual"
        description="Masukkan informasi hak kekayaan intelektual yang telah Anda daftarkan."
        formFields={intellectualPropertyFields}
        dataKey="intellectualPropData"
        documentCategory="intellectual_property"
        renderPreview={renderIntellectualPropPreview}
        initialData={intellectualPropData}
      />
    </div>
  )
}
