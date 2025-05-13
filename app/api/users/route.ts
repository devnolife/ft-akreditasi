import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

// Schema for user creation
const userCreateSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
  nidn: z.string().optional(),
  frontDegree: z.string().optional(),
  backDegree: z.string().optional(),
  role: z.enum(["ADMIN", "LECTURER", "PRODI"]).default("LECTURER"),
  studyProgramId: z.string().optional(),
})

// GET handler for fetching users
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get("role")
    const studyProgramId = searchParams.get("studyProgramId")

    // Build where clause
    const whereClause: any = {}
    if (role) {
      whereClause.role = role
    }
    if (studyProgramId) {
      whereClause.studyProgramId = studyProgramId
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        personalData: true,
        studyProgram: true,
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// POST handler for creating a user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = userCreateSchema.parse(body)

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Check if NIDN is unique if provided
    if (validatedData.nidn) {
      const existingNidn = await prisma.user.findUnique({
        where: { nidn: validatedData.nidn },
      })

      if (existingNidn) {
        return NextResponse.json({ error: "User with this NIDN already exists" }, { status: 400 })
      }
    }

    // Create user
    const user = await prisma.user.create({
      data: validatedData,
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
