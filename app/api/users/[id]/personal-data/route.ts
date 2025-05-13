import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

// Schema for personal data
const personalDataSchema = z.object({
  placeOfBirth: z.string().optional(),
  dateOfBirth: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  gender: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  employeeId: z.string().optional(),
  position: z.string().optional(),
  employmentStatus: z.string().optional(),
  specialization: z.string().optional(),
  highestDegree: z.string().optional(),
  institution: z.string().optional(),
  graduationYear: z.number().int().optional(),
  bio: z.string().optional(),
  photoUrl: z.string().optional(),
})

// GET handler for fetching personal data
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    const personalData = await prisma.personalData.findUnique({
      where: { userId },
    })

    if (!personalData) {
      return NextResponse.json({ error: "Personal data not found" }, { status: 404 })
    }

    return NextResponse.json(personalData)
  } catch (error) {
    console.error("Error fetching personal data:", error)
    return NextResponse.json({ error: "Failed to fetch personal data" }, { status: 500 })
  }
}

// PUT handler for creating or updating personal data
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id
    const body = await request.json()

    // Validate request body
    const validatedData = personalDataSchema.parse(body)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Upsert personal data
    const personalData = await prisma.personalData.upsert({
      where: { userId },
      update: validatedData,
      create: {
        ...validatedData,
        userId,
      },
    })

    return NextResponse.json(personalData)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error updating personal data:", error)
    return NextResponse.json({ error: "Failed to update personal data" }, { status: 500 })
  }
}
