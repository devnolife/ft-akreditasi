"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileUp, List, Grid } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface DocumentManagerProps {
  title: string
  description: string
  category: string
}

export function DocumentManager({ title, description, category }: DocumentManagerProps) {
  const { user } = useAuth()
  const [view, setView] = useState<"list" | "grid">("list")

  // This is a simplified version that doesn't actually upload files yet
  return (
    <Card className="border-none shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Button variant="outline" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <FileUp className="h-4 w-4 mr-2" />
            Unggah Dokumen
          </Button>
        </div>
        <CardDescription className="text-blue-50">{description}</CardDescription>
      </CardHeader>

      <CardContent className="p-4">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="recent">Terbaru</TabsTrigger>
              <TabsTrigger value="important">Penting</TabsTrigger>
            </TabsList>

            <div className="flex space-x-2">
              <Button variant={view === "list" ? "default" : "outline"} size="sm" onClick={() => setView("list")}>
                <List className="h-4 w-4" />
              </Button>
              <Button variant={view === "grid" ? "default" : "outline"} size="sm" onClick={() => setView("grid")}>
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="m-0">
            <div className="text-center py-8 text-muted-foreground">
              Belum ada dokumen yang diunggah. Klik tombol "Unggah Dokumen" untuk menambahkan dokumen.
            </div>
          </TabsContent>

          <TabsContent value="recent" className="m-0">
            <div className="text-center py-8 text-muted-foreground">Belum ada dokumen terbaru.</div>
          </TabsContent>

          <TabsContent value="important" className="m-0">
            <div className="text-center py-8 text-muted-foreground">Belum ada dokumen penting.</div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
