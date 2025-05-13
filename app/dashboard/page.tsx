"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { getUserData } from "@/lib/data-service"
import { BookOpen, GraduationCap, HandHeart, LightbulbIcon, Medal, User } from "lucide-react"
import { PersonalDataTab } from "@/components/dashboard/personal-data-tab"
import { ResearchTab } from "@/components/dashboard/research-tab"
import { CommunityServiceTab } from "@/components/dashboard/community-service-tab"
import { PublicationsTab } from "@/components/dashboard/publications-tab"
import { IntellectualPropertyTab } from "@/components/dashboard/intellectual-property-tab"
import { RecognitionTab } from "@/components/dashboard/recognition-tab"
import { UserProfile } from "@/components/user-profile"

export default function Dashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("data-diri")
  const [personalData, setPersonalData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const userData = await getUserData(user.id)
        if (userData && userData.personalData) {
          setPersonalData(userData.personalData)
        } else {
          // Set default personal data if none exists
          setPersonalData({
            fullName: user.name,
            email: user.email,
            position: "Lecturer",
            department: "Computer Science",
          })
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        // Set default personal data if error occurs
        setPersonalData({
          fullName: user?.name,
          email: user?.email,
          position: "Lecturer",
          department: "Computer Science",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [user])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl p-6 mb-8 text-white">
        <h1 className="text-3xl font-bold">Dashboard Dosen</h1>
        <p className="mt-2 text-teal-50">Selamat datang, {user?.name || "Dosen"}. Kelola data akademik Anda di sini.</p>
      </div>

      {!isLoading && personalData && (
        <div className="mb-8">
          <UserProfile user={user} personalData={personalData} />
        </div>
      )}

      <Card className="border-none shadow-lg overflow-hidden">
        <Tabs defaultValue="data-diri" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-slate-50 border-b">
            <TabsList className="h-auto p-0 bg-transparent w-full justify-start overflow-x-auto flex-nowrap">
              <TabsTrigger
                value="data-diri"
                className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:text-teal-700 rounded-none px-6 py-4 h-auto"
              >
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>Data Diri</span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="penelitian"
                className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:text-teal-700 rounded-none px-6 py-4 h-auto"
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  <span>Penelitian</span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="pengabdian"
                className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:text-teal-700 rounded-none px-6 py-4 h-auto"
              >
                <div className="flex items-center gap-2">
                  <HandHeart className="h-5 w-5" />
                  <span>Pengabdian</span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="publikasi"
                className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:text-teal-700 rounded-none px-6 py-4 h-auto"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Publikasi</span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="haki"
                className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:text-teal-700 rounded-none px-6 py-4 h-auto"
              >
                <div className="flex items-center gap-2">
                  <LightbulbIcon className="h-5 w-5" />
                  <span>HAKI</span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="rekognisi"
                className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:text-teal-700 rounded-none px-6 py-4 h-auto"
              >
                <div className="flex items-center gap-2">
                  <Medal className="h-5 w-5" />
                  <span>Rekognisi</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="p-6">
            <TabsContent value="data-diri" className="m-0">
              <PersonalDataTab />
            </TabsContent>

            <TabsContent value="penelitian" className="m-0">
              <ResearchTab />
            </TabsContent>

            <TabsContent value="pengabdian" className="m-0">
              <CommunityServiceTab />
            </TabsContent>

            <TabsContent value="publikasi" className="m-0">
              <PublicationsTab />
            </TabsContent>

            <TabsContent value="haki" className="m-0">
              <IntellectualPropertyTab />
            </TabsContent>

            <TabsContent value="rekognisi" className="m-0">
              <RecognitionTab />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}
