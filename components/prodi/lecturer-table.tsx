"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreHorizontal, Eye, Edit, FileText, Mail, AlertTriangle } from "lucide-react"
import type { Lecturer } from "@/lib/auth/mockData"

interface LecturerTableProps {
  lecturers: Lecturer[]
  isLoading?: boolean
}

export function LecturerTable({ lecturers, isLoading = false }: LecturerTableProps) {
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedLecturers = [...lecturers].sort((a, b) => {
    if (sortField === "completionStatus") {
      return sortDirection === "asc" ? a.completionStatus - b.completionStatus : b.completionStatus - a.completionStatus
    }

    if (sortField === "lastUpdated") {
      return sortDirection === "asc"
        ? new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
        : new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    }

    const aValue = a[sortField as keyof Lecturer]
    const bValue = b[sortField as keyof Lecturer]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  const getCompletionStatusColor = (status: number) => {
    if (status >= 90) return "bg-green-100 text-green-800 hover:bg-green-200"
    if (status >= 50) return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    return "bg-red-100 text-red-800 hover:bg-red-200"
  }

  const getCompletionStatusText = (status: number) => {
    if (status >= 90) return "Lengkap"
    if (status >= 50) return "Sebagian"
    return "Belum Lengkap"
  }

  const getPositionText = (position: string) => {
    switch (position) {
      case "lecturer":
        return "Dosen"
      case "senior_lecturer":
        return "Lektor"
      case "associate_professor":
        return "Lektor Kepala"
      case "professor":
        return "Profesor"
      default:
        return position
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="py-4">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
                <div className="h-3 w-1/2 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (lecturers.length === 0) {
    return (
      <div className="py-8 text-center">
        <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Tidak Ada Data</h3>
        <p className="text-muted-foreground">Tidak ada data dosen yang tersedia untuk program studi ini.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">
              <Button variant="ghost" className="p-0 font-medium text-left" onClick={() => handleSort("name")}>
                Nama Dosen
                {sortField === "name" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 font-medium text-left" onClick={() => handleSort("position")}>
                Jabatan
                {sortField === "position" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
              </Button>
            </TableHead>
            <TableHead>NIDN</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="p-0 font-medium text-left"
                onClick={() => handleSort("completionStatus")}
              >
                Status
                {sortField === "completionStatus" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 font-medium text-left" onClick={() => handleSort("lastUpdated")}>
                Terakhir Diperbarui
                {sortField === "lastUpdated" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
              </Button>
            </TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLecturers.map((lecturer) => (
            <TableRow key={lecturer.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(lecturer.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {lecturer.frontTitle} {lecturer.name} {lecturer.backTitle}
                    </div>
                    <div className="text-sm text-muted-foreground">{lecturer.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getPositionText(lecturer.position)}</TableCell>
              <TableCell>{lecturer.nidn}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getCompletionStatusColor(lecturer.completionStatus)}>
                  {getCompletionStatusText(lecturer.completionStatus)} ({lecturer.completionStatus}%)
                </Badge>
              </TableCell>
              <TableCell>{formatDate(lecturer.lastUpdated)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Buka menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      Lihat Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Data
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 mr-2" />
                      Lihat Dokumen
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Mail className="h-4 w-4 mr-2" />
                      Kirim Email
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
