export interface Lecturer {
  id: string
  nidn: string
  name: string
  frontDegree: string
  backDegree: string
  email: string
  placeOfBirth: string
  dateOfBirth: Date
  studyProgramId: string
  position: string
  employmentStatus: "Permanent" | "Contract"
  researchCount: number
  teachingHours: number
  communityServiceCount: number
  completionRate: number
  lastUpdated: Date
}
