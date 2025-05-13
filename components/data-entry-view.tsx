"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Judul harus memiliki minimal 2 karakter.",
  }),
  type: z.string({
    required_error: "Silakan pilih jenis data.",
  }),
  description: z.string().min(10, {
    message: "Deskripsi harus memiliki minimal 10 karakter.",
  }),
  date: z.string({
    required_error: "Silakan masukkan tanggal.",
  }),
  attachments: z.string().optional(),
})

export function DataEntryView() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      attachments: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log(values)
      toast({
        title: "Data berhasil disimpan",
        description: "Data Anda telah berhasil disimpan ke sistem.",
      })
      form.reset()
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Formulir Entri Data</CardTitle>
          <CardDescription>
            Masukkan data akademik, penelitian, atau pengabdian masyarakat Anda di sini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan judul" {...field} />
                    </FormControl>
                    <FormDescription>Judul kegiatan atau publikasi Anda.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Data</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis data" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="research">Penelitian</SelectItem>
                        <SelectItem value="publication">Publikasi</SelectItem>
                        <SelectItem value="teaching">Pengajaran</SelectItem>
                        <SelectItem value="community">Pengabdian Masyarakat</SelectItem>
                        <SelectItem value="award">Penghargaan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Kategori data yang ingin Anda masukkan.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Masukkan deskripsi lengkap" className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormDescription>Deskripsi lengkap tentang kegiatan atau publikasi Anda.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>Tanggal kegiatan atau publikasi.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="attachments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lampiran (URL)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/dokumen" {...field} />
                    </FormControl>
                    <FormDescription>URL ke dokumen pendukung (opsional).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan Data"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline">Batal</Button>
          <Button variant="secondary" onClick={() => form.reset()}>
            Reset
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
