"use client"

interface UserProfileProps {
  user: any;
  personalData: any;
}

export function UserProfile({ user, personalData }: UserProfileProps) {
  const getInitials = () => {
    if (personalData?.nama) {
      return personalData.nama
        .split(" ")
        .map((name: string) => name[0])
        .join("")
    }
    if (user?.name) {
      return user.name
        .split(" ")
        .map((name: string) => name[0])
        .join("")
    }
    return "U"
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-teal-600">{getInitials()}</span>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-800">
              {personalData?.front_degree ? `${personalData.front_degree} ` : ""}
              {personalData?.nama || user?.name || "Pengguna"}
              {personalData?.back_degree ? ` ${personalData.back_degree}` : ""}
            </h2>
            <p className="text-slate-600 mt-1">
              {personalData?.jabatan || "Jabatan"} - {personalData?.spesialisasi || "Departemen"}
            </p>
            <p className="text-sm mt-2 text-slate-500">
              {user?.username || "email@contoh.com"} • {personalData?.telepon || "Telepon"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="font-medium mb-3 text-slate-700">Informasi Akademik</h3>
          <dl className="space-y-2">
            <div className="grid grid-cols-2">
              <dt className="text-slate-500">Jabatan:</dt>
              <dd className="font-medium">{personalData?.jabatan || "-"}</dd>
            </div>
            <div className="grid grid-cols-2">
              <dt className="text-slate-500">Status:</dt>
              <dd className="font-medium">{personalData?.status_kepegawaian || "-"}</dd>
            </div>
            <div className="grid grid-cols-2">
              <dt className="text-slate-500">Bidang Keahlian:</dt>
              <dd className="font-medium">{personalData?.spesialisasi || "-"}</dd>
            </div>
            <div className="grid grid-cols-2">
              <dt className="text-slate-500">Gelar Tertinggi:</dt>
              <dd className="font-medium">{personalData?.gelar_tertinggi || "-"}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="font-medium mb-3 text-slate-700">Informasi Kontak</h3>
          <dl className="space-y-2">
            <div className="grid grid-cols-2">
              <dt className="text-slate-500">Email:</dt>
              <dd className="font-medium">{user?.username || "-"}</dd>
            </div>
            <div className="grid grid-cols-2">
              <dt className="text-slate-500">Telepon:</dt>
              <dd className="font-medium">{personalData?.telepon || "-"}</dd>
            </div>
            <div className="grid grid-cols-2">
              <dt className="text-slate-500">NIP/NIDN:</dt>
              <dd className="font-medium">{personalData?.nomor_pegawai || "-"}</dd>
            </div>
          </dl>
        </div>
      </div>

      {personalData?.biografi && (
        <div className="px-6 pb-6">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-slate-700">Biografi</h3>
            <p className="text-slate-600">{personalData.biografi}</p>
          </div>
        </div>
      )}
    </div>
  )
}
