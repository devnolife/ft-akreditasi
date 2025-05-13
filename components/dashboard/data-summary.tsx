"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/AuthContext"
import { getUserData } from "@/lib/data-service"
import { BookOpen, GraduationCap, HandHeart, LightbulbIcon, Medal, User } from "lucide-react"

export function DataSummary() {
  const { user } = useAuth()
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [completionRates, setCompletionRates] = useState({
    personalData: 0,
    researchData: 0,
    communityServiceData: 0,
    publicationData: 0,
    intellectualPropertyData: 0,
    recognitionData: 0,
    overall: 0,
  })

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const data = await getUserData(user.id)
        setUserData(data || {})
        calculateCompletionRates(data)
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [user])

  const calculateCompletionRates = (data: any) => {
    if (!data) {
      setCompletionRates({
        personalData: 0,
        researchData: 0,
        communityServiceData: 0,
        publicationData: 0,
        intellectualPropertyData: 0,
        recognitionData: 0,
        overall: 0,
      })
      return
    }

    // Calculate completion rate for each category
    const personalDataRate =
      data.personalData && Array.isArray(data.personalData) && data.personalData.length > 0 ? 100 : 0
    const researchDataRate =
      data.researchData && Array.isArray(data.researchData) && data.researchData.length > 0 ? 100 : 0
    const communityServiceDataRate =
      data.communityServiceData && Array.isArray(data.communityServiceData) && data.communityServiceData.length > 0
        ? 100
        : 0
    const publicationDataRate =
      data.publicationData && Array.isArray(data.publicationData) && data.publicationData.length > 0 ? 100 : 0
    const intellectualPropertyDataRate =
      data.intellectualPropertyData &&
      Array.isArray(data.intellectualPropertyData) &&
      data.intellectualPropertyData.length > 0
        ? 100
        : 0
    const recognitionDataRate =
      data.recognitionData && Array.isArray(data.recognitionData) && data.recognitionData.length > 0 ? 100 : 0

    // Calculate overall completion rate
    const overall = Math.round(
      (personalDataRate +
        researchDataRate +
        communityServiceDataRate +
        publicationDataRate +
        intellectualPropertyDataRate +
        recognitionDataRate) /
        6,
    )

    setCompletionRates({
      personalData: personalDataRate,
      researchData: researchDataRate,
      communityServiceData: communityServiceDataRate,
      publicationData: publicationDataRate,
      intellectualPropertyData: intellectualPropertyDataRate,
      recognitionData: recognitionDataRate,
      overall,
    })
  }

  if (isLoading) {
    return <div className="h-24 flex items-center justify-center">Loading...</div>
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Ringkasan Data</CardTitle>
        <CardDescription>Progres pengisian data akademik Anda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-500" />
              <span>Data Diri</span>
            </div>
            <span className="font-medium">{completionRates.personalData}%</span>
          </div>
          <Progress value={completionRates.personalData} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-emerald-500" />
              <span>Penelitian</span>
            </div>
            <span className="font-medium">{completionRates.researchData}%</span>
          </div>
          <Progress value={completionRates.researchData} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <HandHeart className="h-4 w-4 text-rose-500" />
              <span>Pengabdian</span>
            </div>
            <span className="font-medium">{completionRates.communityServiceData}%</span>
          </div>
          <Progress value={completionRates.communityServiceData} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-amber-500" />
              <span>Publikasi</span>
            </div>
            <span className="font-medium">{completionRates.publicationData}%</span>
          </div>
          <Progress value={completionRates.publicationData} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <LightbulbIcon className="h-4 w-4 text-purple-500" />
              <span>HAKI</span>
            </div>
            <span className="font-medium">{completionRates.intellectualPropertyData}%</span>
          </div>
          <Progress value={completionRates.intellectualPropertyData} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <Medal className="h-4 w-4 text-cyan-500" />
              <span>Rekognisi</span>
            </div>
            <span className="font-medium">{completionRates.recognitionData}%</span>
          </div>
          <Progress value={completionRates.recognitionData} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="w-full space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Kelengkapan Data</span>
            <span className="text-lg font-bold">{completionRates.overall}%</span>
          </div>
          <Progress value={completionRates.overall} className="h-3" />
        </div>
      </CardFooter>
    </Card>
  )
}
