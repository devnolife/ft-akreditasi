"use client"

import { useRouter } from "next/navigation"
import { Calendar, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ResearchProject } from "@/types/research"

interface ResearchProjectCardProps {
  project: ResearchProject
}

export function ResearchProjectCard({ project }: ResearchProjectCardProps) {
  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "diterima":
        return "bg-green-100 text-green-800 border-green-300"
      case "menunggu":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "ditolak":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const handleViewDetails = () => {
    router.push(`/dashboard/research/${project.id_proposal}`)
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-3">
        <Badge className={`mb-2 ${getStatusColor(project.stt_penetapan)}`}>{project.stt_penetapan}</Badge>
        <CardTitle className="line-clamp-2 text-base">{project.judul}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <div className="mb-2 flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{project.tahun}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{project.leader}</span>
          </div>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Skema</span>
            <span className="font-medium">{project.scheme_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sumber Dana</span>
            <span className="font-medium">{project.sumber_dana}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fokus</span>
            <span className="font-medium">{project.focus}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/20 p-2">
        <Button variant="outline" className="w-full h-7 text-xs" onClick={handleViewDetails}>
          Lihat Detail
        </Button>
      </CardFooter>
    </Card>
  )
}
