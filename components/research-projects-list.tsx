"use client"

import { useState } from "react"
import { ResearchProjectCard } from "./research-project-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import type { ResearchProject } from "@/types/research"

interface ResearchProjectsListProps {
  projects: ResearchProject[]
}

export function ResearchProjectsList({ projects }: ResearchProjectsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [yearFilter, setYearFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Get unique years from projects
  const years = [...new Set(projects.map((project) => project.tahun))].sort((a, b) => b - a)

  // Get unique statuses from projects
  const statuses = [...new Set(projects.map((project) => project.stt_penetapan))]

  // Filter projects based on search term and filters
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.leader.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesYear = yearFilter === "all" || project.tahun.toString() === yearFilter

    const matchesStatus = statusFilter === "all" || project.stt_penetapan === statusFilter

    return matchesSearch && matchesYear && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan judul atau peneliti..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[130px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tahun</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div>
          {filteredProjects.map((project, index) => (
            <ResearchProjectCard key={index} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Tidak ada data penelitian yang ditemukan.</p>
        </div>
      )}
    </div>
  )
}
