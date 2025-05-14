"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileText, GraduationCap, HandHeart, LightbulbIcon, Medal } from "lucide-react"

interface DashboardMetric {
  title: string
  value: number
  icon: React.ReactNode
  description: string
}

interface DashboardAnalyticsProps {
  userId: string
}

export function DashboardAnalytics({ userId }: DashboardAnalyticsProps) {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true)

        // In a real app, you would fetch this data from an API
        // For demo purposes, we'll use mock data
        const response = await fetch(`/api/users/profile?userId=${userId}`)
        const userData = await response.json()

        // Calculate metrics
        const metricsData: DashboardMetric[] = [
          {
            title: "Penelitian",
            value: userData.research_projects?.length || 0,
            icon: <GraduationCap className="h-5 w-5 text-blue-500" />,
            description: "Total penelitian yang telah dilakukan"
          },
          {
            title: "Pengabdian",
            value: userData.community_services?.length || 0,
            icon: <HandHeart className="h-5 w-5 text-green-500" />,
            description: "Total pengabdian masyarakat"
          },
          {
            title: "Publikasi",
            value: userData.publications?.length || 0,
            icon: <BookOpen className="h-5 w-5 text-purple-500" />,
            description: "Total publikasi ilmiah"
          },
          {
            title: "HAKI",
            value: userData.intellectual_props?.length || 0,
            icon: <LightbulbIcon className="h-5 w-5 text-amber-500" />,
            description: "Total Hak Kekayaan Intelektual"
          },
          {
            title: "Rekognisi",
            value: userData.recognitions?.length || 0,
            icon: <Medal className="h-5 w-5 text-red-500" />,
            description: "Total penghargaan dan rekognisi"
          },
          {
            title: "Dokumen",
            value: userData.documents?.length || 0,
            icon: <FileText className="h-5 w-5 text-gray-500" />,
            description: "Total dokumen yang diunggah"
          }
        ]

        setMetrics(metricsData)
      } catch (error) {
        console.error("Error fetching metrics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchMetrics()
    }
  }, [userId])

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-1 px-3 py-2">
              <CardTitle className="text-base h-5 bg-gray-200 rounded-md"></CardTitle>
            </CardHeader>
            <CardContent className="px-3 py-2">
              <div className="text-2xl font-bold h-6 w-10 bg-gray-200 rounded-md"></div>
              <p className="text-xs text-muted-foreground mt-1 h-3 w-28 bg-gray-200 rounded-md"></p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {metrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-1 px-3 py-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-medium">{metric.title}</CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent className="px-3 py-2">
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 
