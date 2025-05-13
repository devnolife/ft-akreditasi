import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function LecturersPage() {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Daftar Dosen</h1>
        <p className="text-muted-foreground">Kelola dan lihat semua dosen di Universitas Muhammadiyah Makassar</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="text" placeholder="Cari dosen..." />
          <Button type="submit">Cari</Button>
        </div>
        <Button asChild>
          <Link href="/dashboard/lecturer-form">Tambah Dosen</Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="active">Aktif</TabsTrigger>
          <TabsTrigger value="on-leave">Cuti</TabsTrigger>
          <TabsTrigger value="inactive">Tidak Aktif</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Semua Dosen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex flex-col space-y-4">
                  {/* Lecturer 1 */}
                  <div className="flex flex-col items-start justify-between gap-4 rounded-lg border p-4 sm:flex-row">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/diverse-group.png" alt="Avatar" />
                        <AvatarFallback>FM</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">Dr. Ahmad Fauzi, M.Kom</p>
                        <p className="text-sm text-muted-foreground">Teknik Informatika</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge className="bg-green-500 hover:bg-green-600">Aktif</Badge>
                          <Badge variant="outline">Dosen Tetap</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <Button variant="outline" size="sm">
                        Lihat Detail
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>

                  {/* Lecturer 2 */}
                  <div className="flex flex-col items-start justify-between gap-4 rounded-lg border p-4 sm:flex-row">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/diverse-group.png" alt="Avatar" />
                        <AvatarFallback>SN</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">Dr. Siti Nurhaliza, M.Pd</p>
                        <p className="text-sm text-muted-foreground">Pendidikan Bahasa Inggris</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">Cuti</Badge>
                          <Badge variant="outline">Dosen Tetap</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <Button variant="outline" size="sm">
                        Lihat Detail
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>

                  {/* Lecturer 3 */}
                  <div className="flex flex-col items-start justify-between gap-4 rounded-lg border p-4 sm:flex-row">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/diverse-group.png" alt="Avatar" />
                        <AvatarFallback>BH</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">Budi Hartono, S.E., M.M.</p>
                        <p className="text-sm text-muted-foreground">Manajemen</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge className="bg-green-500 hover:bg-green-600">Aktif</Badge>
                          <Badge variant="outline">Dosen Tidak Tetap</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <Button variant="outline" size="sm">
                        Lihat Detail
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>

                  {/* Lecturer 4 */}
                  <div className="flex flex-col items-start justify-between gap-4 rounded-lg border p-4 sm:flex-row">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/diverse-group.png" alt="Avatar" />
                        <AvatarFallback>DP</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">Dr. Dewi Puspitasari, M.Si.</p>
                        <p className="text-sm text-muted-foreground">Kimia</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge className="bg-red-500 hover:bg-red-600">Tidak Aktif</Badge>
                          <Badge variant="outline">Dosen Tetap</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <Button variant="outline" size="sm">
                        Lihat Detail
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>

                  {/* Lecturer 5 */}
                  <div className="flex flex-col items-start justify-between gap-4 rounded-lg border p-4 sm:flex-row">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/diverse-group.png" alt="Avatar" />
                        <AvatarFallback>RS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">Rudi Santoso, S.T., M.T.</p>
                        <p className="text-sm text-muted-foreground">Teknik Sipil</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge className="bg-green-500 hover:bg-green-600">Aktif</Badge>
                          <Badge variant="outline">Dosen Tetap</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <Button variant="outline" size="sm">
                        Lihat Detail
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <Button variant="outline" className="mx-2">
                    Sebelumnya
                  </Button>
                  <Button variant="outline" className="mx-2">
                    Selanjutnya
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Dosen Aktif</CardTitle>
            </CardHeader>
            <CardContent className="h-[450px] flex items-center justify-center">
              <p className="text-muted-foreground">Daftar dosen aktif akan ditampilkan di sini</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="on-leave">
          <Card>
            <CardHeader>
              <CardTitle>Dosen Cuti</CardTitle>
            </CardHeader>
            <CardContent className="h-[450px] flex items-center justify-center">
              <p className="text-muted-foreground">Daftar dosen cuti akan ditampilkan di sini</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inactive">
          <Card>
            <CardHeader>
              <CardTitle>Dosen Tidak Aktif</CardTitle>
            </CardHeader>
            <CardContent className="h-[450px] flex items-center justify-center">
              <p className="text-muted-foreground">Daftar dosen tidak aktif akan ditampilkan di sini</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
