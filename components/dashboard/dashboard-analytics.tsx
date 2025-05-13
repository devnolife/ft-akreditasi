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
            icon: <GraduationCap className="h-6 w-6 text-blue-500" />,
            description: "Total penelitian yang telah dilakukan"
          },
          {
            title: "Pengabdian",
            value: userData.community_services?.length || 0,
            icon: <HandHeart className="h-6 w-6 text-green-500" />,
            description: "Total pengabdian masyarakat"
          },
          {
            title: "Publikasi",
            value: userData.publications?.length || 0,
            icon: <BookOpen className="h-6 w-6 text-purple-500" />,
            description: "Total publikasi ilmiah"
          },
          {
            title: "HAKI",
            value: userData.intellectual_props?.length || 0,
            icon: <LightbulbIcon className="h-6 w-6 text-amber-500" />,
            description: "Total Hak Kekayaan Intelektual"
          },
          {
            title: "Rekognisi",
            value: userData.recognitions?.length || 0,
            icon: <Medal className="h-6 w-6 text-red-500" />,
            description: "Total penghargaan dan rekognisi"
          },
          {
            title: "Dokumen",
            value: userData.documents?.length || 0,
            icon: <FileText className="h-6 w-6 text-gray-500" />,
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl h-6 bg-gray-200 rounded-md"></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold h-8 w-12 bg-gray-200 rounded-md"></div>
              <p className="text-xs text-muted-foreground mt-2 h-4 w-32 bg-gray-200 rounded-md"></p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">{metric.title}</CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 
