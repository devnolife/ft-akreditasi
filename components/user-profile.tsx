"use client"

export function UserProfile({ user, personalData }) {
  const getInitials = () => {
    if (personalData?.fullName) {
      return personalData.fullName
        .split(" ")
        .map((name) => name[0])
        .join("")
    }
    if (user?.name) {
      return user.name
        .split(" ")
        .map((name) => name[0])
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
            <h2 className="text-2xl font-bold text-slate-800">{personalData?.fullName || user?.name || "User"}</h2>
            <p className="text-slate-600 mt-1">
              {personalData?.position || "Position"} - {personalData?.department || "Department"}
            </p>
            <p className="text-sm mt-2 text-slate-500">
              {personalData?.email || user?.email || "email@example.com"} • {personalData?.phone || "Phone"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="font-medium mb-3 text-slate-700">Academic Information</h3>
          <dl className="space-y-2">
            <div className="grid grid-cols-2">
              <dt className="text-slate-500">Position:</dt>
              <dd className="font-medium">{personalData?.position || "-"}</dd>
            </div>
            <div className="grid grid-cols-2">
              <dt className="text-slate-500">Department:</dt>
              <dd className="font-medium">{personalData?.department || "-"}</dd>
            </div>
            <div className="grid grid-cols-2">
              <dt className="text-slate-500">Specialization:</dt>
              <dd className="font-medium">{personalData?.specialization || "-"}</dd>
            </div>
            <div className="grid grid-cols-2">
              <dt className="text-slate-500">Highest Degree:</dt>
              <dd className="font-medium">{personalData?.highestDegree || "-"}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="font-medium mb-3 text-slate-700">Contact Information</h3>
          <dl className="space-y-2">
            <div className="grid grid-cols-2">
              <dt className="text-slate-500">Email:</dt>
              <dd className="font-medium">{personalData?.email || user?.email || "-"}</dd>
            </div>
            <div className="grid grid-cols-2">
              <dt className="text-slate-500">Phone:</dt>
              <dd className="font-medium">{personalData?.phone || "-"}</dd>
            </div>
            <div className="grid grid-cols-2">
              <dt className="text-slate-500">Employee ID:</dt>
              <dd className="font-medium">{personalData?.employeeId || "-"}</dd>
            </div>
          </dl>
        </div>
      </div>

      {personalData?.bio && (
        <div className="px-6 pb-6">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-slate-700">Biography</h3>
            <p className="text-slate-600">{personalData.bio}</p>
          </div>
        </div>
      )}
    </div>
  )
}
