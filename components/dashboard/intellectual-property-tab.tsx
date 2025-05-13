"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getUserData } from "@/lib/data-service"
import { EntryManager } from "@/components/dynamic-form/entry-manager"
import { intellectualPropertyFields } from "./form-schemas"
import { Loader2 } from "lucide-react"

export function IntellectualPropertyTab() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [ipData, setIpData] = useState<any[]>([])

  useEffect(() => {
    const loadIpData = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const userData = await getUserData(user.id)
        if (userData && userData.intellectualPropertyData) {
          setIpData(userData.intellectualPropertyData)
        }
      } catch (error) {
        console.error("Error loading intellectual property data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadIpData()
  }, [user])

  const renderIpPreview = (entry: any) => {
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
        title="Hak Kekayaan Intelektual"
        description="Masukkan informasi HAKI yang telah Anda dapatkan."
        formFields={intellectualPropertyFields}
        dataKey="intellectualPropertyData"
        documentCategory="intellectual_property"
        renderPreview={renderIpPreview}
      />
    </div>
  )
}
