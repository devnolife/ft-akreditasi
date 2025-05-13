"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FormBuilder, type FormField } from "./form-builder"
import { Plus, Edit, Trash2, FileText } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { getUserData, saveUserData } from "@/lib/data-service"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import type { DocumentCategory } from "@/types/document"

interface EntryManagerProps {
  title: string
  description: string
  formFields: FormField[]
  dataKey: string
  documentCategory: DocumentCategory
  renderPreview: (entry: any) => string
  initialData?: any
}

export function EntryManager({
  title,
  description,
  formFields,
  dataKey,
  documentCategory,
  renderPreview,
  initialData,
}: EntryManagerProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [entries, setEntries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentEntry, setCurrentEntry] = useState<any>(null)
  const [currentEntryIndex, setCurrentEntryIndex] = useState<number | null>(null)

  // Create a ref to track if initialData has been processed
  const initialDataProcessed = useRef(false);

  useEffect(() => {
    // If we've already processed initialData and it's provided, skip API fetching
    if (initialData && !initialDataProcessed.current) {
      setEntries(Array.isArray(initialData) ? initialData : [initialData].filter(Boolean));
      setIsLoading(false);
      initialDataProcessed.current = true;
      return;
    }

    // Skip the data fetching if initialData was already processed
    if (initialDataProcessed.current) {
      return;
    }

    // Map from dataKey to the corresponding field in the user data
    const dataKeyToPrismaField: Record<string, string> = {
      'personalData': 'personal_data',
      'researchData': 'research_projects',
      'communityServiceData': 'community_services',
      'publicationData': 'publications',
      'intellectualPropData': 'intellectual_props',
      'recognitionData': 'recognitions'
    };

    const loadEntries = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        // Fetch data from API
        const userData = await getUserData(user.id)
        const prismaField = dataKeyToPrismaField[dataKey];

        if (userData && prismaField && userData[prismaField as keyof typeof userData]) {
          const dataValue = userData[prismaField as keyof typeof userData];
          if (dataValue) {
            setEntries(Array.isArray(dataValue) ? dataValue : [dataValue].filter(Boolean))
          } else {
            setEntries([])
          }
        } else {
          setEntries([])
        }
        initialDataProcessed.current = true;
      } catch (error) {
        console.error(`Error loading ${dataKey}:`, error)
        toast({
          title: "Error",
          description: `Failed to load ${title.toLowerCase()} data.`,
          variant: "destructive",
        })
        setEntries([])
      } finally {
        setIsLoading(false)
      }
    }

    loadEntries()
    // Only re-run if these dependencies change AND initialData hasn't been processed
  }, [user?.id, dataKey])

  const handleAddEntry = async (formData: any) => {
    if (!user) return

    try {
      const newEntry = {
        id: crypto.randomUUID(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Update local state first
      const updatedEntries = [...entries, newEntry]
      setEntries(updatedEntries)
      setIsAddDialogOpen(false) // Close dialog immediately after local update

      // Then save to backend - don't need to update state again
      await saveUserData(user.id, {
        [dataKey]: updatedEntries,
      })

      toast({
        title: "Success",
        description: `${title} added successfully.`,
      })
    } catch (error) {
      console.error(`Error adding ${dataKey}:`, error)
      toast({
        title: "Error",
        description: `Failed to add ${title.toLowerCase()}.`,
        variant: "destructive",
      })
    }
  }

  const handleEditEntry = async (formData: any) => {
    if (!user || currentEntryIndex === null) return

    try {
      const updatedEntry = {
        ...entries[currentEntryIndex],
        ...formData,
        updatedAt: new Date().toISOString(),
      }

      // Update local state first
      const updatedEntries = [...entries]
      updatedEntries[currentEntryIndex] = updatedEntry
      setEntries(updatedEntries)

      // Reset state and close dialog immediately
      setIsEditDialogOpen(false)
      setCurrentEntry(null)
      setCurrentEntryIndex(null)

      // Then save to backend without updating state again
      await saveUserData(user.id, {
        [dataKey]: updatedEntries,
      })

      toast({
        title: "Success",
        description: `${title} updated successfully.`,
      })
    } catch (error) {
      console.error(`Error updating ${dataKey}:`, error)
      toast({
        title: "Error",
        description: `Failed to update ${title.toLowerCase()}.`,
        variant: "destructive",
      })
    }
  }

  const handleDeleteEntry = async (index: number) => {
    if (!user) return

    if (!window.confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)) {
      return
    }

    try {
      const updatedEntries = [...entries]
      updatedEntries.splice(index, 1)

      setEntries(updatedEntries)

      // Save to backend
      await saveUserData(user.id, {
        [dataKey]: updatedEntries,
      })

      toast({
        title: "Success",
        description: `${title} deleted successfully.`,
      })
    } catch (error) {
      console.error(`Error deleting ${dataKey}:`, error)
      toast({
        title: "Error",
        description: `Failed to delete ${title.toLowerCase()}.`,
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (entry: any, index: number) => {
    setCurrentEntry(entry)
    setCurrentEntryIndex(index)
    setIsEditDialogOpen(true)
  }

  // Find the image field name if it exists
  const getImageFieldName = () => {
    const imageField = formFields.find((field) => field.type === "file" && field.name.includes("Image"))
    return imageField ? imageField.name : null
  }

  const imageFieldName = getImageFieldName()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="mr-2 h-4 w-4" />
              Tambah {title}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah {title} Baru</DialogTitle>
            </DialogHeader>
            <FormBuilder
              fields={formFields}
              onSubmit={handleAddEntry}
              documentCategory={documentCategory}
              relatedItemId={user?.id}
              submitLabel="Simpan"
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
        </div>
      ) : entries.length === 0 ? (
        <Card className="bg-slate-50 border border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-slate-100 p-3 mb-4">
              <FileText className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-700">Belum ada {title.toLowerCase()}</h3>
            <p className="text-slate-500 text-center max-w-md mt-1">
              Klik tombol "Tambah {title}" untuk menambahkan {title.toLowerCase()} baru.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry, index) => (
            <Card key={entry.id || index} className="overflow-hidden hover:shadow-md transition-shadow">
              {imageFieldName && entry[imageFieldName] && (
                <div className="aspect-video relative">
                  <Image
                    src={entry[imageFieldName] || "/placeholder.svg"}
                    alt={renderPreview(entry)}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader className={imageFieldName && entry[imageFieldName] ? "pt-4 pb-2" : ""}>
                <CardTitle className="text-lg line-clamp-2">{renderPreview(entry)}</CardTitle>
                {entry.createdAt && (
                  <CardDescription>
                    {new Date(entry.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                )}
              </CardHeader>
              <CardFooter className="flex justify-end gap-2 pt-2 pb-4">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(entry, index)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteEntry(index)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Hapus
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {title}</DialogTitle>
          </DialogHeader>
          {currentEntry && (
            <FormBuilder
              fields={formFields}
              onSubmit={handleEditEntry}
              documentCategory={documentCategory}
              relatedItemId={user?.id}
              submitLabel="Update"
              initialData={currentEntry}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
