"use client"

import { useEffect, useState } from "react"
import { ResearchProjectsList } from "@/components/research-projects-list"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { getResearchProjects } from "@/lib/research-service"
import type { ResearchProject } from "@/types/research"

const ResearchDashboard = () => {
  const [researchProjects, setResearchProjects] = useState<ResearchProject[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await getResearchProjects("current-user-id")
        setResearchProjects(data)
      } catch (error) {
        console.error("Error fetching research data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="container max-w-7xl mx-auto py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Research Projects</h1>
        <div>
          <Button variant="outline" size="sm" className="mr-2">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      </div>

      <Card className="w-[95%]">
        <CardContent className="pl-2">
          <Tabs defaultvalue="all" className="w-[100%]">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              {isLoading ? <p>Loading research projects...</p> : <ResearchProjectsList projects={researchProjects} />}
            </TabsContent>
            <TabsContent value="active">
              {isLoading ? (
                <p>Loading active research projects...</p>
              ) : (
                <ResearchProjectsList projects={researchProjects.filter((project) => project.status === "active")} />
              )}
            </TabsContent>
            <TabsContent value="completed">
              {isLoading ? (
                <p>Loading completed research projects...</p>
              ) : (
                <ResearchProjectsList projects={researchProjects.filter((project) => project.status === "completed")} />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResearchDashboard
