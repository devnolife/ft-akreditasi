// Mock user data for authentication testing
export const mockData = {
  users: [
    {
      id: "1",
      name: "Dosen Fakultas",
      username: "dosen",
      password: "password",
      role: "lecturer",
      email: "dosen@university.edu",
      department: "Computer Science",
      lastLogin: "2025-05-09T14:30:22Z",
    },
    {
      id: "2",
      name: "Admin System",
      username: "admin",
      password: "password",
      role: "admin",
      email: "admin@university.edu",
      department: "IT Administration",
      lastLogin: "2025-05-10T09:15:45Z",
    },
    {
      id: "3",
      name: "Koordinator Prodi",
      username: "prodi",
      password: "password",
      role: "prodi",
      email: "prodi@university.edu",
      department: "Computer Science",
      programId: "55202",
      programName: "Teknik Informatika",
      lastLogin: "2025-05-10T08:20:15Z",
    },
    {
      id: "user-prodi-1",
      name: "Program Coordinator",
      username: "prodi",
      password: "password",
      email: "prodi@university.edu",
      role: "prodi",
      department: "Computer Science",
      programId: "prog-001",
      programName: "Computer Science",
      lastLogin: "2023-05-01T08:30:00Z",
    },
  ],
  roles: {
    lecturer: {
      permissions: ["view_own", "edit_own", "submit_data"],
    },
    admin: {
      permissions: ["view_all", "edit_all", "delete_all", "approve_all", "manage_users", "view_reports", "export_data"],
    },
    prodi: {
      permissions: ["view_program", "edit_program", "approve_program", "view_program_reports", "export_program_data"],
    },
  },
  // Mock data for study programs
  studyPrograms: [
    {
      id: "55202",
      name: "Teknik Informatika",
      facultyId: "1",
      facultyName: "Fakultas Teknik",
      totalLecturers: 12,
      accreditationStatus: "A",
      head: "Dr. Ahmad Sudrajat",
    },
    {
      id: "55201",
      name: "Sistem Informasi",
      facultyId: "1",
      facultyName: "Fakultas Teknik",
      totalLecturers: 8,
      accreditationStatus: "B",
      head: "Dr. Budi Santoso",
    },
    {
      id: "57101",
      name: "Manajemen",
      facultyId: "2",
      facultyName: "Fakultas Ekonomi",
      totalLecturers: 15,
      accreditationStatus: "A",
      head: "Dr. Citra Dewi",
    },
    {
      id: "prog-001",
      name: "Computer Science",
      faculty: "Engineering",
      code: "CS",
      level: "Undergraduate",
      accreditationStatus: "A",
      accreditationExpiry: "2025-12-31",
    },
    {
      id: "prog-002",
      name: "Information Systems",
      faculty: "Engineering",
      code: "IS",
      level: "Undergraduate",
      accreditationStatus: "B",
      accreditationExpiry: "2024-06-30",
    },
  ],
  // Mock data for lecturers by program
  lecturersByProgram: {
    "55202": [
      {
        id: "101",
        nidn: "0931087901",
        name: "MUHYIDDIN A M HAYAT",
        frontTitle: "",
        backTitle: "S.Kom, MT",
        position: "lecturer",
        email: "muhyiddin@unismuh.ac.id",
        completionStatus: 85,
        lastUpdated: "2025-05-01T10:15:30Z",
      },
      {
        id: "102",
        nidn: "0915067802",
        name: "INDRA SAMSIE",
        frontTitle: "",
        backTitle: "S.Kom, M.Kom",
        position: "senior_lecturer",
        email: "indra@unismuh.ac.id",
        completionStatus: 92,
        lastUpdated: "2025-05-03T14:22:10Z",
      },
      {
        id: "103",
        nidn: "0908107503",
        name: "ANDI LUKMAN",
        frontTitle: "Dr.",
        backTitle: "S.T, M.T",
        position: "associate_professor",
        email: "lukman@unismuh.ac.id",
        completionStatus: 78,
        lastUpdated: "2025-04-28T09:45:22Z",
      },
      {
        id: "104",
        nidn: "0922097604",
        name: "NURWAHIDAH",
        frontTitle: "",
        backTitle: "S.Kom, M.Cs",
        position: "lecturer",
        email: "nurwahidah@unismuh.ac.id",
        completionStatus: 65,
        lastUpdated: "2025-05-05T11:30:45Z",
      },
      {
        id: "105",
        nidn: "0910088201",
        name: "AHMAD RIZAL",
        frontTitle: "",
        backTitle: "S.T, M.Eng",
        position: "lecturer",
        email: "rizal@unismuh.ac.id",
        completionStatus: 45,
        lastUpdated: "2025-04-20T08:15:30Z",
      },
    ],
  },
  // Mock data for program statistics
  programStats: {
    "55202": {
      totalDocuments: 145,
      completionRate: 72,
      documentsByCategory: {
        research: 45,
        teaching: 38,
        community: 22,
        recognition: 15,
        intellectual: 25,
      },
      recentActivity: [
        { date: "2025-05-10", count: 8 },
        { date: "2025-05-09", count: 5 },
        { date: "2025-05-08", count: 12 },
        { date: "2025-05-07", count: 7 },
        { date: "2025-05-06", count: 10 },
        { date: "2025-05-05", count: 6 },
        { date: "2025-05-04", count: 9 },
      ],
      pendingSubmissions: 8,
    },
  },
}

// Define types for our authentication system
export type User = {
  id: string
  name: string
  username: string
  password: string
  role: string
  email: string
  department: string
  programId?: string
  programName?: string
  lastLogin: string
}

export type Role = {
  permissions: string[]
}

export type AuthUser = Omit<User, "password"> & {
  permissions: string[]
}

export type StudyProgram = {
  id: string
  name: string
  facultyId: string
  facultyName: string
  totalLecturers: number
  accreditationStatus: string
  head: string
}

export type Lecturer = {
  id: string
  nidn: string
  name: string
  frontTitle: string
  backTitle: string
  position: string
  email: string
  completionStatus: number
  lastUpdated: string
}

export type ProgramStats = {
  totalDocuments: number
  completionRate: number
  documentsByCategory: {
    research: number
    teaching: number
    community: number
    recognition: number
    intellectual: number
  }
  recentActivity: Array<{ date: string; count: number }>
  pendingSubmissions: number
}
