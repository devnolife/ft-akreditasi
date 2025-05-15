"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { EntryManager } from "@/components/dynamic-form/entry-manager"
import { communityServiceFields } from "./form-schemas"
import {
  BadgeCheck, Calendar, ChevronDown, ChevronUp, Clock, CoinsIcon,
  ExternalLink, FileText, Hash, Loader2, MapPin, Search, User, Users,
  Filter, ArrowUpDown
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"

interface CommunityServiceTabProps {
  userData: any;
  isLoading: boolean;
  apiEndpoint?: string;
  onDataChange?: () => Promise<void>;
}

// Updated interface to include all fields from the API
interface CommunityService {
  id_proposal: string;
  judul: string;
  kategori: string;
  stt_penetapan: string;
  total_dana?: string;
  total_biaya?: string;
  sumber_dana: string;
  tahun?: number;
  nm_mitra?: string;
  institusi_mitra?: string;
  bidang_mitra?: string;
  pelaporan?: string;
  nm_jenis?: string;
  lokasi?: string;
  name?: string;
  email?: string;
  id_dosen?: string;
  id_periode?: string;
  tugas_ketua?: string;
  sinta?: string;
  l_belakang?: string;
  surat_mitra?: string;
  moa_mitra?: string;
  loa_mitra?: string;
  cv_mitra?: string;
  karya_dosen?: string;
  file_proposal?: string;
  alasan?: string;
  b_kegiatan?: number;
  b_tahap1?: number;
  b_tahap2?: number;
  stt_usulan?: string;
  stt_adm?: string;
  sink?: string;
  step?: string;
  stt_bayar70?: string;
  bukti_bayar70?: string;
  rek_bayar70?: string;
  jml_bayar70?: string;
  layak30?: string;
  stt_bayar30?: string;
  bukti_bayar30?: string;
  rek_bayar30?: string;
  jml_bayar30?: string;
  id_bidang?: string;
  id_tema?: string;
  id_topik?: string;
  id_rumpun_1?: string;
  id_rumpun_2?: string;
  id_rumpun_3?: string;
  prioritas_riset?: string;
  created_at?: string;
  updated_at?: string;
  nidn?: string;
  id_jenis?: string;
}

export function CommunityServiceTab({ userData, isLoading: initialLoading, apiEndpoint, onDataChange }: CommunityServiceTabProps) {
  const { user } = useAuth()
  const [communityServiceData, setCommunityServiceData] = useState<CommunityService[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [yearFilter, setYearFilter] = useState<number | null>(null)

  // Fetch data from API
  useEffect(() => {
    const fetchCommunityServices = async () => {
      if (!user?.username) return;

      setLoading(true);
      try {
        const response = await fetch(`https://simpelmas.unismuh.ac.id/api/karya_dosen/${user.username}/pengabdian`);

        if (!response.ok) {
          throw new Error('Failed to fetch community service data');
        }

        const data = await response.json();

        if (data.status === "success" && data.data) {
          // Convert object of objects to array
          const servicesArray = Object.values(data.data) as CommunityService[];
          setCommunityServiceData(servicesArray);
        } else {
          setCommunityServiceData([]);
        }
      } catch (err) {
        console.error('Error fetching community service data:', err);
        setError('Gagal memuat data pengabdian masyarakat');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityServices();
  }, [user?.username]);

  const renderStatusBadge = (status: string) => {
    if (!status) return null;

    switch (status.toLowerCase()) {
      case 'diterima':
        return <Badge className="bg-green-500">Diterima</Badge>;
      case 'ditolak':
        return <Badge variant="destructive">Ditolak</Badge>;
      case 'pending':
      case 'submit':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const renderPaymentStatusBadge = (status: string) => {
    if (!status) return null;

    switch (status.toLowerCase()) {
      case 'paid':
        return <Badge className="bg-green-500">Dibayar</Badge>;
      case 'unpaid':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Belum Dibayar</Badge>;
      default:
        return <Badge variant="secondary">Kosong</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Tidak ada data';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const renderCommunityServicePreview = (entry: any) => {
    return entry.judul
  }

  const filteredData = communityServiceData.filter(service => {
    const matchesSearch = service.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.nm_mitra?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.lokasi?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = !statusFilter || service.stt_penetapan === statusFilter
    const matchesYear = !yearFilter || service.tahun === yearFilter

    return matchesSearch && matchesStatus && matchesYear
  })

  const getStatusCounts = () => {
    return communityServiceData.reduce((acc, service) => {
      const status = service.stt_penetapan || 'unknown'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  const getTotalFunding = () => {
    return communityServiceData.reduce((total, service) => {
      return total + parseInt(service.total_dana || service.total_biaya || "0")
    }, 0)
  }

  if (initialLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between animate-pulse">
          <div className="h-8 w-64 bg-muted rounded-lg" />
          <div className="h-8 w-32 bg-muted rounded-lg" />
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-3/4 bg-muted rounded-lg" />
              <div className="h-4 w-1/2 bg-muted rounded-lg mt-2" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-16 bg-muted rounded-lg" />
                  ))}
                </div>
                <div className="space-y-4">
                  {[1, 2].map((j) => (
                    <div key={j} className="h-16 bg-muted rounded-lg" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 text-center"
      >
        <p className="text-red-500">{error}</p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Coba Lagi
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Pengabdian Masyarakat</h2>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Export Data
          </Button>
        </div>

        {communityServiceData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Pengabdian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{communityServiceData.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Pengabdian masyarakat aktif
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Pendanaan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(getTotalFunding())}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Dari seluruh pengabdian
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(getStatusCounts()).map(([status, count]) => (
                    <Badge
                      key={status}
                      variant={status.toLowerCase() === 'diterima' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {status}: {count}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan judul, mitra, atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                Semua Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('diterima')}>
                Diterima
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('ditolak')}>
                Ditolak
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className="gap-2" onClick={() => setYearFilter(null)}>
            <ArrowUpDown className="h-4 w-4" />
            Urutkan
          </Button>
        </div>

        {filteredData.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-12 border-2 border-dashed rounded-xl"
          >
            <div className="flex flex-col items-center gap-2">
              <Users className="h-8 w-8 text-muted-foreground" />
              <h3 className="font-semibold text-lg">Tidak Ada Data</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter || yearFilter
                  ? "Tidak ada data yang sesuai dengan filter yang dipilih."
                  : "Belum ada data pengabdian masyarakat yang tersedia."}
              </p>
              {(searchQuery || statusFilter || yearFilter) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter(null)
                    setYearFilter(null)
                  }}
                  className="mt-2"
                >
                  Reset Filter
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 gap-6"
          >
            {filteredData.map((service, index) => (
              <motion.div
                key={service.id_proposal}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg border-primary/10 hover:border-primary/20">
                  <CardHeader className="border-b bg-card transition-colors">
                    <div className="space-y-2">
                      <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">
                        {service.judul}
                      </CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 text-primary">
                          <Calendar className="h-4 w-4" />
                          <span>{service.tahun || 'Tahun tidak diketahui'}</span>
                        </div>
                        {service.nm_jenis && (
                          <>
                            <span className="mx-1">•</span>
                            <span>{service.nm_jenis}</span>
                          </>
                        )}
                        {service.created_at && (
                          <>
                            <span className="mx-1">•</span>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              <span>{formatDate(service.created_at)}</span>
                            </div>
                          </>
                        )}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 transition-colors hover:bg-muted/50"
                        >
                          <BadgeCheck className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Status Pengabdian</p>
                            <div className="mt-1">{renderStatusBadge(service.stt_penetapan)}</div>
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50"
                        >
                          <Hash className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Kategori</p>
                            <p className="mt-1">{service.kategori || 'Tidak ada data'}</p>
                          </div>
                        </motion.div>

                        {service.lokasi && (
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50"
                          >
                            <MapPin className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Lokasi</p>
                              <p className="mt-1">{service.lokasi}</p>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50"
                        >
                          <Users className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Mitra</p>
                            <p className="mt-1">
                              {service.nm_mitra || 'Tidak ada data mitra'}
                              {service.institusi_mitra && (
                                <span className="block text-sm text-muted-foreground mt-0.5">
                                  {service.institusi_mitra}
                                </span>
                              )}
                            </p>
                            {service.bidang_mitra && (
                              <Badge variant="outline" className="mt-2">
                                {service.bidang_mitra}
                              </Badge>
                            )}
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50"
                        >
                          <CoinsIcon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Pendanaan</p>
                            <p className="mt-1">{service.sumber_dana || 'Tidak ada data'}</p>
                            <p className="font-medium text-lg text-primary mt-1">
                              {formatCurrency(parseInt(service.total_dana || service.total_biaya || "0"))}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="border-t bg-card px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">Status:</p>
                        <Badge variant="outline" className="font-medium">
                          {service.pelaporan || 'Belum Dilaporkan'}
                        </Badge>
                      </div>
                      {service.stt_bayar70 && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">Pembayaran:</p>
                            {renderPaymentStatusBadge(service.stt_bayar70)}
                          </div>
                        </>
                      )}
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 group-hover:border-primary group-hover:text-primary transition-colors"
                        >
                          <span>Lihat Detail</span>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden flex flex-col max-h-[90vh]">
                        <DialogHeader className="px-6 py-4 border-b bg-background sticky top-0 z-10">
                          <DialogTitle className="text-2xl font-semibold leading-relaxed">
                            {service.judul}
                          </DialogTitle>
                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            <Badge variant="outline" className="text-primary border-primary">
                              {service.tahun || 'Tahun tidak diketahui'}
                            </Badge>
                            {service.nm_jenis && (
                              <Badge variant="outline">{service.nm_jenis}</Badge>
                            )}
                            <Badge>{service.kategori}</Badge>
                            {renderStatusBadge(service.stt_penetapan)}
                          </div>
                        </DialogHeader>

                        <div className="flex-1 overflow-y-auto">
                          <div className="p-6 space-y-8">
                            {/* Informasi Umum */}
                            <section className="bg-muted/30 rounded-xl overflow-hidden">
                              <div className="flex items-center gap-2 p-4 border-b bg-muted/50">
                                <User className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">Informasi Umum</h3>
                              </div>
                              <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    {service.name && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Nama Pengabdi</p>
                                        <p className="mt-1">{service.name}</p>
                                      </div>
                                    )}
                                    {service.email && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                                        <p className="mt-1">{service.email}</p>
                                      </div>
                                    )}
                                    {service.nidn && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">NIDN</p>
                                        <p className="mt-1">{service.nidn}</p>
                                      </div>
                                    )}
                                  </div>
                                  <div className="space-y-4">
                                    {service.lokasi && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Lokasi</p>
                                        <p className="mt-1">{service.lokasi}</p>
                                      </div>
                                    )}
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Tanggal Dibuat</p>
                                      <p className="mt-1">{formatDate(service.created_at)}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Terakhir Diperbarui</p>
                                      <p className="mt-1">{formatDate(service.updated_at)}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </section>

                            {/* Mitra */}
                            {(service.nm_mitra || service.institusi_mitra || service.bidang_mitra) && (
                              <section className="bg-muted/30 rounded-xl overflow-hidden">
                                <div className="flex items-center gap-2 p-4 border-b bg-muted/50">
                                  <Users className="h-5 w-5 text-primary" />
                                  <h3 className="text-lg font-semibold">Informasi Mitra</h3>
                                </div>
                                <div className="p-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      {service.nm_mitra && (
                                        <div>
                                          <p className="text-sm font-medium text-muted-foreground">Nama Mitra</p>
                                          <p className="mt-1">{service.nm_mitra}</p>
                                        </div>
                                      )}
                                      {service.institusi_mitra && (
                                        <div className="mt-4">
                                          <p className="text-sm font-medium text-muted-foreground">Institusi</p>
                                          <p className="mt-1">{service.institusi_mitra}</p>
                                        </div>
                                      )}
                                    </div>
                                    {service.bidang_mitra && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Bidang</p>
                                        <p className="mt-1">{service.bidang_mitra}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </section>
                            )}

                            {/* Tugas dan Latar Belakang */}
                            {(service.tugas_ketua || service.l_belakang) && (
                              <section className="bg-muted/30 rounded-xl overflow-hidden">
                                <div className="flex items-center gap-2 p-4 border-b bg-muted/50">
                                  <FileText className="h-5 w-5 text-primary" />
                                  <h3 className="text-lg font-semibold">Tugas & Latar Belakang</h3>
                                </div>
                                <div className="p-4">
                                  {service.tugas_ketua && (
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground mb-2">Tugas Ketua</p>
                                      <p className="whitespace-pre-line leading-relaxed">{service.tugas_ketua}</p>
                                    </div>
                                  )}
                                  {service.l_belakang && (
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground mb-2">Latar Belakang</p>
                                      <p className="whitespace-pre-line leading-relaxed">{service.l_belakang}</p>
                                    </div>
                                  )}
                                </div>
                              </section>
                            )}

                            {/* Finansial */}
                            <section className="bg-muted/30 rounded-xl overflow-hidden">
                              <div className="flex items-center gap-2 p-4 border-b bg-muted/50">
                                <CoinsIcon className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">Informasi Finansial</h3>
                              </div>
                              <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Sumber Dana</p>
                                      <p className="mt-1">{service.sumber_dana || 'Tidak ada data'}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Total Dana</p>
                                      <p className="mt-1 text-lg font-semibold text-primary">
                                        {formatCurrency(parseInt(service.total_dana || service.total_biaya || "0"))}
                                      </p>
                                    </div>
                                    {service.b_kegiatan && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Biaya Kegiatan</p>
                                        <p className="mt-1">{formatCurrency(service.b_kegiatan)}</p>
                                      </div>
                                    )}
                                  </div>
                                  <div className="space-y-4">
                                    {service.b_tahap1 && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Biaya Tahap 1</p>
                                        <p className="mt-1">{formatCurrency(service.b_tahap1)}</p>
                                      </div>
                                    )}
                                    {service.b_tahap2 && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Biaya Tahap 2</p>
                                        <p className="mt-1">{formatCurrency(service.b_tahap2)}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </section>

                            {/* Status */}
                            <section className="bg-muted/30 rounded-xl overflow-hidden">
                              <div className="flex items-center gap-2 p-4 border-b bg-muted/50">
                                <BadgeCheck className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">Status & Pelaporan</h3>
                              </div>
                              <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    {service.stt_usulan && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Status Usulan</p>
                                        <p className="mt-1">{service.stt_usulan}</p>
                                      </div>
                                    )}
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Status Penetapan</p>
                                      <div className="mt-1">{renderStatusBadge(service.stt_penetapan)}</div>
                                    </div>
                                    {service.pelaporan && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Status Pelaporan</p>
                                        <p className="mt-1">{service.pelaporan}</p>
                                      </div>
                                    )}
                                  </div>
                                  <div className="space-y-4">
                                    {service.stt_bayar70 && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Pembayaran 70%</p>
                                        <div className="mt-1">{renderPaymentStatusBadge(service.stt_bayar70)}</div>
                                      </div>
                                    )}
                                    {service.stt_bayar30 && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Pembayaran 30%</p>
                                        <div className="mt-1">{renderPaymentStatusBadge(service.stt_bayar30)}</div>
                                      </div>
                                    )}
                                    {service.layak30 && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Kelayakan 30%</p>
                                        <p className="mt-1">{service.layak30}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </section>

                            {/* Dokumen */}
                            {(service.file_proposal || service.surat_mitra || service.moa_mitra || service.loa_mitra || service.cv_mitra || service.karya_dosen) && (
                              <section className="bg-muted/30 rounded-xl overflow-hidden">
                                <div className="flex items-center gap-2 p-4 border-b bg-muted/50">
                                  <FileText className="h-5 w-5 text-primary" />
                                  <h3 className="text-lg font-semibold">Dokumen</h3>
                                </div>
                                <div className="p-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {service.file_proposal && (
                                      <div className="flex items-center gap-3 p-3 rounded-lg bg-background/60">
                                        <FileText className="h-5 w-5 text-blue-500" />
                                        <div>
                                          <p className="text-sm font-medium">Proposal</p>
                                          <p className="text-sm text-muted-foreground mt-0.5 break-all">
                                            {service.file_proposal}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                    {service.surat_mitra && (
                                      <div className="flex items-center gap-3 p-3 rounded-lg bg-background/60">
                                        <FileText className="h-5 w-5 text-blue-500" />
                                        <div>
                                          <p className="text-sm font-medium">Surat Mitra</p>
                                          <p className="text-sm text-muted-foreground mt-0.5 break-all">
                                            {service.surat_mitra}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                    {service.moa_mitra && (
                                      <div className="flex items-center gap-3 p-3 rounded-lg bg-background/60">
                                        <FileText className="h-5 w-5 text-blue-500" />
                                        <div>
                                          <p className="text-sm font-medium">MOA Mitra</p>
                                          <p className="text-sm text-muted-foreground mt-0.5 break-all">
                                            {service.moa_mitra}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                    {service.loa_mitra && (
                                      <div className="flex items-center gap-3 p-3 rounded-lg bg-background/60">
                                        <FileText className="h-5 w-5 text-blue-500" />
                                        <div>
                                          <p className="text-sm font-medium">LOA Mitra</p>
                                          <p className="text-sm text-muted-foreground mt-0.5 break-all">
                                            {service.loa_mitra}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                    {service.cv_mitra && (
                                      <div className="flex items-center gap-3 p-3 rounded-lg bg-background/60">
                                        <FileText className="h-5 w-5 text-blue-500" />
                                        <div>
                                          <p className="text-sm font-medium">CV Mitra</p>
                                          <p className="text-sm text-muted-foreground mt-0.5 break-all">
                                            {service.cv_mitra}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                    {service.karya_dosen && (
                                      <div className="flex items-center gap-3 p-3 rounded-lg bg-background/60">
                                        <FileText className="h-5 w-5 text-blue-500" />
                                        <div>
                                          <p className="text-sm font-medium">Karya Dosen</p>
                                          <p className="text-sm text-muted-foreground mt-0.5 break-all">
                                            {service.karya_dosen}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </section>
                            )}

                            {/* Technical IDs */}
                            <section className="bg-muted/30 rounded-xl overflow-hidden">
                              <div className="flex items-center gap-2 p-4 border-b bg-muted/50">
                                <Hash className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">Identifikasi Teknis</h3>
                              </div>
                              <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-3">
                                    {service.id_proposal && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">ID Proposal</p>
                                        <p className="text-sm mt-1 font-mono">{service.id_proposal}</p>
                                      </div>
                                    )}
                                    {service.id_dosen && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">ID Dosen</p>
                                        <p className="text-sm mt-1 font-mono">{service.id_dosen}</p>
                                      </div>
                                    )}
                                    {service.id_jenis && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">ID Jenis</p>
                                        <p className="text-sm mt-1 font-mono">{service.id_jenis}</p>
                                      </div>
                                    )}
                                  </div>
                                  <div className="space-y-3">
                                    {service.id_bidang && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">ID Bidang</p>
                                        <p className="text-sm mt-1 font-mono">{service.id_bidang}</p>
                                      </div>
                                    )}
                                    {service.id_tema && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">ID Tema</p>
                                        <p className="text-sm mt-1 font-mono">{service.id_tema}</p>
                                      </div>
                                    )}
                                    {service.id_topik && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">ID Topik</p>
                                        <p className="text-sm mt-1 font-mono">{service.id_topik}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </section>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="border-t pt-6">
        <EntryManager
          title="Tambah Data Pengabdian Masyarakat"
          description="Masukkan informasi kegiatan pengabdian masyarakat yang telah Anda lakukan."
          formFields={communityServiceFields}
          dataKey="communityServiceData"
          documentCategory="community_service"
          renderPreview={renderCommunityServicePreview}
          initialData={[]}
        />
      </div>
    </div>
  )
}
