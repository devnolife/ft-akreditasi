"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getUserFromStorage } from "@/lib/auth-service"
import { getUserData } from "@/lib/data-service"
import { BookOpen, GraduationCap, HandHeart, LightbulbIcon, Medal, User } from "lucide-react"

export default function FormsPage() {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = getUserFromStorage()

    if (!storedUser) {
      router.push("/login")
      return
    }

    setUser(storedUser)

    // Load user data
    const loadData = async () => {
      try {
        const data = await getUserData(storedUser.id)
        setUserData(data || {})
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const calculateProgress = () => {
    if (!userData) return 0

    const categories = [
      userData.personalData ? 1 : 0,
      userData.researchData && userData.researchData.length > 0 ? 1 : 0,
      userData.communityServiceData && userData.communityServiceData.length > 0 ? 1 : 0,
      userData.publicationData && userData.publicationData.length > 0 ? 1 : 0,
      userData.intellectualPropertyData && userData.intellectualPropertyData.length > 0 ? 1 : 0,
      userData.recognitionData && userData.recognitionData.length > 0 ? 1 : 0,
    ]

    const completedCategories = categories.reduce((sum, val) => sum + val, 0)
    return Math.round((completedCategories / categories.length) * 100)
  }

  const formCategories = [
    {
      id: "personal",
      title: "Personal Information",
      description: "Basic personal and contact information",
      path: "/forms/personal",
      icon: <User className="h-5 w-5" />,
      isComplete: !!userData?.personalData,
    },
    {
      id: "research",
      title: "Research Data",
      description: "Research projects, funding, and student involvement",
      path: "/forms/research",
      icon: <GraduationCap className="h-5 w-5" />,
      isComplete: userData?.researchData && userData.researchData.length > 0,
      count: userData?.researchData?.length || 0,
    },
    {
      id: "communityService",
      title: "Community Service",
      description: "Community engagement and service activities",
      path: "/forms/community-service",
      icon: <HandHeart className="h-5 w-5" />,
      isComplete: userData?.communityServiceData && userData.communityServiceData.length > 0,
      count: userData?.communityServiceData?.length || 0,
    },
    {
      id: "publications",
      title: "Publications",
      description: "Academic publications and journal articles",
      path: "/forms/publications",
      icon: <BookOpen className="h-5 w-5" />,
      isComplete: userData?.publicationData && userData.publicationData.length > 0,
      count: userData?.publicationData?.length || 0,
    },
    {
      id: "intellectualProperty",
      title: "Intellectual Property Rights",
      description: "Patents, copyrights, and other intellectual property",
      path: "/forms/intellectual-property",
      icon: <LightbulbIcon className="h-5 w-5" />,
      isComplete: userData?.intellectualPropertyData && userData.intellectualPropertyData.length > 0,
      count: userData?.intellectualPropertyData?.length || 0,
    },
    {
      id: "recognition",
      title: "Recognition",
      description: "Awards, honors, and professional recognition",
      path: "/forms/recognition",
      icon: <Medal className="h-5 w-5" />,
      isComplete: userData?.recognitionData && userData.recognitionData.length > 0,
      count: userData?.recognitionData?.length || 0,
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Entry Forms</h1>
        <p className="text-muted-foreground mt-1">Complete the following forms to build your accreditation profile</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Completion Progress</CardTitle>
          <CardDescription>Track your progress in completing all required information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={calculateProgress()} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0%</span>
              <span>{calculateProgress()}% Complete</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {formCategories.map((category, index) => (
          <Card
            key={category.id}
            className={category.isComplete ? "border-green-200 bg-green-50/50 dark:bg-green-950/10" : ""}
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="inline-flex items-center justify-center rounded-full w-6 h-6 bg-primary text-primary-foreground text-sm">
                    {index + 1}
                  </span>
                  {category.title}
                  {category.isComplete && (
                    <span className="text-xs font-normal text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      Completed
                    </span>
                  )}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </div>
              <div
                className={`rounded-full p-2 ${
                  category.isComplete ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                }`}
              >
                {category.icon}
              </div>
            </CardHeader>
            <CardContent>
              {typeof category.count === "number" && (
                <div className="text-sm mb-2">
                  <span className="font-medium">{category.count}</span> {category.count === 1 ? "entry" : "entries"}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant={category.isComplete ? "outline" : "default"} className="w-full">
                <Link href={category.path}>{category.isComplete ? "Edit Data" : "Enter Data"}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <Button asChild>
          <Link href="/summary">View Complete Summary</Link>
        </Button>
      </div>
    </div>
  )
}
