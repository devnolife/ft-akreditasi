"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw, Download, Filter } from "lucide-react"

interface ProdiHeaderProps {
  title: string
  description?: string
  onRefresh?: () => void
}

export function ProdiHeader({ title, description, onRefresh }: ProdiHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Program Studi</h1>
        <p className="text-muted-foreground">
          Fakultas Teknik - Kelola dosen dan lacak data akreditasi untuk program studi Anda
        </p>
      </div>
      <div className="flex items-center gap-2">
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Segarkan
          </Button>
        )}
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="default" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Ekspor
        </Button>
      </div>
    </div>
  )
}
