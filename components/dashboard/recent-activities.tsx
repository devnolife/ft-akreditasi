"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileText, GraduationCap, HandHeart, LightbulbIcon, Medal, User } from "lucide-react"

interface Activity {
  id: string
  type: 'research' | 'community' | 'publication' | 'intellectual' | 'recognition' | 'document' | 'profile'
  title: string
  date: string
  description: string
}

interface RecentActivitiesProps {
  userId: string
}

export function RecentActivities({ userId }: RecentActivitiesProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true)

        // In a real app, you would fetch from an API
        // For demo purposes, we'll generate mock data
        const response = await fetch(`/api/users/profile?userId=${userId}`)
        const userData = await response.json()

        const allItems = [
          ...(userData.research_projects || []).map((item: any) => ({
            id: item.id,
            type: 'research' as const,
            title: item.judul,
            date: new Date(item.updated_at).toLocaleDateString('id-ID'),
            description: `Penelitian: ${item.judul}`
          })),
          ...(userData.community_services || []).map((item: any) => ({
            id: item.id,
            type: 'community' as const,
            title: item.judul,
            date: new Date(item.updated_at).toLocaleDateString('id-ID'),
            description: `Pengabdian: ${item.judul}`
          })),
          ...(userData.publications || []).map((item: any) => ({
            id: item.id,
            type: 'publication' as const,
            title: item.judul,
            date: new Date(item.updated_at).toLocaleDateString('id-ID'),
            description: `Publikasi: ${item.judul}`
          }))
        ]

        // Sort by date (newest first) and take the first 5
        const recentActivities = allItems
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5)

        setActivities(recentActivities)
      } catch (error) {
        console.error("Error fetching activities:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchActivities()
    }
  }, [userId])

  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'research': return <GraduationCap className="h-5 w-5 text-blue-500" />
      case 'community': return <HandHeart className="h-5 w-5 text-green-500" />
      case 'publication': return <BookOpen className="h-5 w-5 text-purple-500" />
      case 'intellectual': return <LightbulbIcon className="h-5 w-5 text-amber-500" />
      case 'recognition': return <Medal className="h-5 w-5 text-red-500" />
      case 'document': return <FileText className="h-5 w-5 text-gray-500" />
      case 'profile': return <User className="h-5 w-5 text-indigo-500" />
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="mt-1">{getIcon(activity.type)}</div>
              <div>
                <p className="font-medium text-sm">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.date}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Belum ada aktivitas terbaru.</p>
        )}
      </CardContent>
    </Card>
  )
} 
