import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

// Schema for research project creation
const researchProjectSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  role: z.string().optional(),
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  ongoing: z.boolean().default(false),
  fundingSource: z.string().optional(),
  fundingAmount: z.string().optional(),
  studentInvolvement: z.boolean().default(false),
  numberOfStudents: z.string().optional(),
  publicationStatus: z.string().optional(),
  journalName: z.string().optional(),
  focus: z.string().optional(),
  scheme: z.string().optional(),
  location: z.string().optional(),
  userId: z.string(),
})

// GET handler for fetching research projects
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    // Build where clause
    const whereClause: any = {}
    if (userId) {
      whereClause.userId = userId
    }

    const projects = await prisma.researchProject.findMany({
      where: whereClause,
      include: {
        documents: true,
        user: {
          select: {
            name: true,
            email: true,
            nidn: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching research projects:", error)
    return NextResponse.json({ error: "Failed to fetch research projects" }, { status: 500 })
  }
}

// POST handler for creating a research project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = researchProjectSchema.parse(body)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create research project
    const project = await prisma.researchProject.create({
      data: validatedData,
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error creating research project:", error)
    return NextResponse.json({ error: "Failed to create research project" }, { status: 500 })
  }
}
