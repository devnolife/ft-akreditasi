import type { Lecturer } from "@/types/lecturer"

// Mock data for study programs
const studyPrograms = [
  { id: "cs", name: "Computer Science", facultyId: "engineering" },
  { id: "ee", name: "Electrical Engineering", facultyId: "engineering" },
  { id: "me", name: "Mechanical Engineering", facultyId: "engineering" },
  { id: "ce", name: "Civil Engineering", facultyId: "engineering" },
  { id: "ba", name: "Business Administration", facultyId: "business" },
  { id: "acc", name: "Accounting", facultyId: "business" },
  { id: "fin", name: "Finance", facultyId: "business" },
  { id: "eco", name: "Economics", facultyId: "business" },
]

// Mock data for lecturers with study program assignments
const lecturers: Lecturer[] = [
  {
    id: "1",
    nidn: "1234567890",
    name: "Dr. John Smith",
    frontDegree: "Dr.",
    backDegree: "Ph.D.",
    email: "john.smith@university.edu",
    placeOfBirth: "New York",
    dateOfBirth: new Date("1975-05-15"),
    studyProgramId: "cs",
    position: "Professor",
    employmentStatus: "Permanent",
    researchCount: 12,
    teachingHours: 120,
    communityServiceCount: 5,
    completionRate: 85,
    lastUpdated: new Date("2023-11-10"),
  },
  {
    id: "2",
    nidn: "0987654321",
    name: "Dr. Jane Doe",
    frontDegree: "Dr.",
    backDegree: "Ph.D.",
    email: "jane.doe@university.edu",
    placeOfBirth: "Boston",
    dateOfBirth: new Date("1980-08-22"),
    studyProgramId: "cs",
    position: "Associate Professor",
    employmentStatus: "Permanent",
    researchCount: 8,
    teachingHours: 90,
    communityServiceCount: 3,
    completionRate: 92,
    lastUpdated: new Date("2023-11-12"),
  },
  {
    id: "3",
    nidn: "5678901234",
    name: "Prof. Robert Johnson",
    frontDegree: "Prof.",
    backDegree: "D.Sc.",
    email: "robert.johnson@university.edu",
    placeOfBirth: "Chicago",
    dateOfBirth: new Date("1972-03-10"),
    studyProgramId: "ee",
    position: "Professor",
    employmentStatus: "Permanent",
    researchCount: 15,
    teachingHours: 150,
    communityServiceCount: 7,
    completionRate: 78,
    lastUpdated: new Date("2023-11-05"),
  },
  {
    id: "4",
    nidn: "4321098765",
    name: "Dr. Emily Chen",
    frontDegree: "Dr.",
    backDegree: "Ph.D.",
    email: "emily.chen@university.edu",
    placeOfBirth: "San Francisco",
    dateOfBirth: new Date("1985-11-28"),
    studyProgramId: "cs",
    position: "Assistant Professor",
    employmentStatus: "Contract",
    researchCount: 5,
    teachingHours: 80,
    communityServiceCount: 2,
    completionRate: 65,
    lastUpdated: new Date("2023-11-15"),
  },
  {
    id: "5",
    nidn: "9876543210",
    name: "Dr. Michael Brown",
    frontDegree: "Dr.",
    backDegree: "Ph.D.",
    email: "michael.brown@university.edu",
    placeOfBirth: "Los Angeles",
    dateOfBirth: new Date("1978-07-03"),
    studyProgramId: "me",
    position: "Associate Professor",
    employmentStatus: "Permanent",
    researchCount: 10,
    teachingHours: 110,
    communityServiceCount: 4,
    completionRate: 88,
    lastUpdated: new Date("2023-11-08"),
  },
  {
    id: "6",
    nidn: "6543210987",
    name: "Prof. Sarah Wilson",
    frontDegree: "Prof.",
    backDegree: "D.Eng.",
    email: "sarah.wilson@university.edu",
    placeOfBirth: "Seattle",
    dateOfBirth: new Date("1970-12-15"),
    studyProgramId: "ce",
    position: "Professor",
    employmentStatus: "Permanent",
    researchCount: 18,
    teachingHours: 130,
    communityServiceCount: 9,
    completionRate: 95,
    lastUpdated: new Date("2023-11-02"),
  },
  {
    id: "7",
    nidn: "2345678901",
    name: "Dr. David Lee",
    frontDegree: "Dr.",
    backDegree: "Ph.D.",
    email: "david.lee@university.edu",
    placeOfBirth: "Houston",
    dateOfBirth: new Date("1982-04-20"),
    studyProgramId: "ba",
    position: "Assistant Professor",
    employmentStatus: "Contract",
    researchCount: 6,
    teachingHours: 85,
    communityServiceCount: 2,
    completionRate: 72,
    lastUpdated: new Date("2023-11-18"),
  },
  {
    id: "8",
    nidn: "8765432109",
    name: "Dr. Lisa Martinez",
    frontDegree: "Dr.",
    backDegree: "Ph.D.",
    email: "lisa.martinez@university.edu",
    placeOfBirth: "Miami",
    dateOfBirth: new Date("1979-09-08"),
    studyProgramId: "acc",
    position: "Associate Professor",
    employmentStatus: "Permanent",
    researchCount: 9,
    teachingHours: 100,
    communityServiceCount: 5,
    completionRate: 83,
    lastUpdated: new Date("2023-11-07"),
  },
  {
    id: "9",
    nidn: "3456789012",
    name: "Prof. Thomas White",
    frontDegree: "Prof.",
    backDegree: "D.B.A.",
    email: "thomas.white@university.edu",
    placeOfBirth: "Dallas",
    dateOfBirth: new Date("1968-06-25"),
    studyProgramId: "fin",
    position: "Professor",
    employmentStatus: "Permanent",
    researchCount: 14,
    teachingHours: 140,
    communityServiceCount: 8,
    completionRate: 90,
    lastUpdated: new Date("2023-11-03"),
  },
  {
    id: "10",
    nidn: "7654321098",
    name: "Dr. Jennifer Taylor",
    frontDegree: "Dr.",
    backDegree: "Ph.D.",
    email: "jennifer.taylor@university.edu",
    placeOfBirth: "Atlanta",
    dateOfBirth: new Date("1983-02-12"),
    studyProgramId: "eco",
    position: "Assistant Professor",
    employmentStatus: "Contract",
    researchCount: 7,
    teachingHours: 75,
    communityServiceCount: 3,
    completionRate: 68,
    lastUpdated: new Date("2023-11-20"),
  },
]

export async function getProdiLecturers(studyProgramId: string): Promise<Lecturer[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredLecturers = lecturers.filter((lecturer) => lecturer.studyProgramId === studyProgramId)
      resolve(filteredLecturers)
    }, 500)
  })
}

export async function getProdiStatistics(studyProgramId: string): Promise<{
  totalLecturers: number
  completedProfiles: number
  averageCompletionRate: number
  totalPublications: number
  totalResearch: number
  totalTeaching: number
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredLecturers = lecturers.filter((lecturer) => lecturer.studyProgramId === studyProgramId)
      const totalLecturers = filteredLecturers.length
      const completedProfiles = filteredLecturers.filter((lecturer) => lecturer.completionRate === 100).length
      const averageCompletionRate =
        totalLecturers > 0
          ? filteredLecturers.reduce((sum, lecturer) => sum + lecturer.completionRate, 0) / totalLecturers
          : 0
      const totalPublications = 100 // Mock data
      const totalResearch = 50 // Mock data
      const totalTeaching = 200 // Mock data

      resolve({
        totalLecturers,
        completedProfiles,
        averageCompletionRate,
        totalPublications,
        totalResearch,
        totalTeaching,
      })
    }, 500)
  })
}
