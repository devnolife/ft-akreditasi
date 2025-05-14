"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Save, User, Phone, MapPin, Briefcase, GraduationCap, Building } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { getUserData, savePersonalData } from "@/lib/data-service"
import { useToast } from "@/hooks/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const personalDataSchema = z.object({
  tempat_lahir: z.string().optional(),
  tanggal_lahir: z.date().optional().nullable(),
  jenis_kelamin: z.enum(["Laki-laki", "Perempuan"]).optional(),
  alamat: z.string().optional(),
  telepon: z.string().optional(),
  nomor_pegawai: z.string().optional(),
  jabatan: z.string().optional(),
  status_kepegawaian: z.string().optional(),
  spesialisasi: z.string().optional(),
  gelar_tertinggi: z.string().optional(),
  institusi: z.string().optional(),
  tahun_lulus: z.string().optional(),
  biografi: z.string().optional(),
  url_foto: z.string().optional(),
})

type PersonalDataFormValues = z.infer<typeof personalDataSchema>

export function PersonalDataManager() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [personalData, setPersonalData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<PersonalDataFormValues>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      tempat_lahir: "",
      tanggal_lahir: null,
      jenis_kelamin: undefined,
      alamat: "",
      telepon: "",
      nomor_pegawai: "",
      jabatan: "",
      status_kepegawaian: "",
      spesialisasi: "",
      gelar_tertinggi: "",
      institusi: "",
      tahun_lulus: "",
      biografi: "",
      url_foto: "",
    },
  })

  useEffect(() => {
    const loadPersonalData = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const userData = await getUserData(user.id)
        if (userData) {
          setPersonalData(userData.personal_data || {})

          // Set form values from loaded data
          if (userData.personal_data) {
            const data = userData.personal_data
            form.reset({
              tempat_lahir: data.tempat_lahir || "",
              tanggal_lahir: data.tanggal_lahir ? new Date(data.tanggal_lahir) : null,
              jenis_kelamin: data.jenis_kelamin as "Laki-laki" | "Perempuan" | undefined,
              alamat: data.alamat || "",
              telepon: data.telepon || "",
              nomor_pegawai: data.nomor_pegawai || "",
              jabatan: data.jabatan || "",
              status_kepegawaian: data.status_kepegawaian || "",
              spesialisasi: data.spesialisasi || "",
              gelar_tertinggi: data.gelar_tertinggi || "",
              institusi: data.institusi || "",
              tahun_lulus: data.tahun_lulus ? String(data.tahun_lulus) : "",
              biografi: data.biografi || "",
              url_foto: data.url_foto || "",
            })
          }
        }
      } catch (error) {
        console.error("Error loading personal data:", error)
        toast({
          title: "Error",
          description: "Gagal memuat data diri.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadPersonalData()
  }, [user, form])

  const onSubmit = async (values: PersonalDataFormValues) => {
    if (!user) return

    try {
      const updatedData = {
        ...values,
        tahun_lulus: values.tahun_lulus ? parseInt(values.tahun_lulus) : null,
      }

      await savePersonalData(user.id, updatedData)

      // Update local state
      setPersonalData(updatedData)
      setIsDialogOpen(false)

      toast({
        title: "Berhasil",
        description: "Data diri berhasil diperbarui.",
      })
    } catch (error) {
      console.error("Error saving personal data:", error)
      toast({
        title: "Error",
        description: "Gagal menyimpan data diri.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-400">Data Diri</h2>
          <p className="text-muted-foreground">Informasi detail tentang profil dosen</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-all hover:shadow">
              <Edit className="mr-2 h-4 w-4" />
              Edit Data Diri
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl text-teal-800 dark:text-teal-400 flex items-center gap-2">
                <User className="h-5 w-5" />
                Edit Data Diri
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="p-4 rounded-lg border">
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Informasi Dasar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nomor_pegawai"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NIP/NIDN</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan NIP/NIDN" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="jenis_kelamin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jenis Kelamin</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih jenis kelamin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                              <SelectItem value="Perempuan">Perempuan</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tempat_lahir"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tempat Lahir</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan tempat lahir" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tanggal_lahir"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Tanggal Lahir</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                >
                                  {field.value ? (
                                    format(field.value, "dd MMMM yyyy")
                                  ) : (
                                    <span>Pilih tanggal</span>
                                  )}
                                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value || undefined}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="telepon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nomor Telepon</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan nomor telepon" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg border">
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Informasi Akademik</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="jabatan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jabatan Akademik</FormLabel>
                          <FormControl>
                            <Input placeholder="Contoh: Lektor, Profesor" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status_kepegawaian"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status Kepegawaian</FormLabel>
                          <FormControl>
                            <Input placeholder="Contoh: PNS, Kontrak" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="spesialisasi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bidang Keahlian</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan bidang keahlian" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gelar_tertinggi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gelar Tertinggi</FormLabel>
                          <FormControl>
                            <Input placeholder="Contoh: S3, Doktor" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="institusi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institusi Pendidikan Terakhir</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan institusi pendidikan" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tahun_lulus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tahun Lulus</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Contoh: 2020" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg border">
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Informasi Tambahan</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="alamat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alamat</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Masukkan alamat lengkap" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="biografi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Biografi Singkat</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ceritakan tentang pengalaman dan keahlian Anda"
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 rounded-lg transition-all hover:shadow"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-teal-600 text-white flex items-center justify-center">
                <User className="h-7 w-7" />
              </div>
              <div>
                <CardTitle className="text-lg text-teal-800 dark:text-teal-400">{user?.name || 'Dosen'}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Badge variant="outline" className="bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 rounded-full">
                    {personalData?.jabatan || "Dosen"}
                  </Badge>
                  <span>•</span>
                  <span>{personalData?.nomor_pegawai || "NIP/NIDN"}</span>
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-teal-700 hover:text-teal-800 hover:bg-teal-100 dark:text-teal-400 dark:hover:bg-teal-900/30"
              onClick={() => setIsDialogOpen(true)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="rounded-lg p-4 border">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 flex items-center">
                  <User className="h-4 w-4 mr-2 text-teal-700 dark:text-teal-500" />
                  Informasi Pribadi
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400">Tempat, Tanggal Lahir</h4>
                      <p className="text-sm">
                        {personalData?.tempat_lahir || "-"}
                        {personalData?.tanggal_lahir ? `, ${format(new Date(personalData.tanggal_lahir), "dd MMMM yyyy")}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-slate-400 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400">Jenis Kelamin</h4>
                      <p className="text-sm">{personalData?.jenis_kelamin || "-"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400">Telepon</h4>
                      <p className="text-sm">{personalData?.telepon || "-"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400">Alamat</h4>
                      <p className="text-sm">{personalData?.alamat || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg p-4 border">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-teal-700 dark:text-teal-500" />
                  Informasi Akademik
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Briefcase className="h-4 w-4 text-slate-400 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400">Jabatan Akademik</h4>
                      <p className="text-sm">{personalData?.jabatan || "-"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Building className="h-4 w-4 text-slate-400 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400">Status Kepegawaian</h4>
                      <p className="text-sm">{personalData?.status_kepegawaian || "-"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <GraduationCap className="h-4 w-4 text-slate-400 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400">Bidang Keahlian</h4>
                      <p className="text-sm">{personalData?.spesialisasi || "-"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <GraduationCap className="h-4 w-4 text-slate-400 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400">Gelar Tertinggi</h4>
                      <p className="text-sm">{personalData?.gelar_tertinggi || "-"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Building className="h-4 w-4 text-slate-400 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400">Pendidikan Terakhir</h4>
                      <p className="text-sm">
                        {personalData?.institusi || "-"}
                        {personalData?.tahun_lulus ? ` (${personalData.tahun_lulus})` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {personalData?.biografi && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 flex items-center">
                <User className="h-4 w-4 mr-2 text-teal-700 dark:text-teal-500" />
                Biografi
              </h3>
              <p className="text-sm leading-relaxed">{personalData.biografi}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
