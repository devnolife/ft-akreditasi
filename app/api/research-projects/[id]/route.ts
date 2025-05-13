import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

// Schema for research project update
const researchProjectUpdateSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  role: z.string().optional(),
  startDate: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  endDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  ongoing: z.boolean().optional(),
  fundingSource: z.string().optional(),
  fundingAmount: z.string().optional(),
  studentInvolvement: z.boolean().optional(),
  numberOfStudents: z.string().optional(),
  publicationStatus: z.string().optional(),
  journalName: z.string().optional(),
  focus: z.string().optional(),
  scheme: z.string().optional(),
  location: z.string().optional(),
})

// GET handler for fetching a specific research project
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id

    const project = await prisma.researchProject.findUnique({
      where: { id: projectId },
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
    })

    if (!project) {
      return NextResponse.json({ error: "Research project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error fetching research project:", error)
    return NextResponse.json({ error: "Failed to fetch research project" }, { status: 500 })
  }
}

// PATCH handler for updating a research project
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id
    const body = await request.json()

    // Validate request body
    const validatedData = researchProjectUpdateSchema.parse(body)

    // Check if project exists
    const existingProject = await prisma.researchProject.findUnique({
      where: { id: projectId },
    })

    if (!existingProject) {
      return NextResponse.json({ error: "Research project not found" }, { status: 404 })
    }

    // Update project
    const project = await prisma.researchProject.update({
      where: { id: projectId },
      data: validatedData,
    })

    return NextResponse.json(project)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error updating research project:", error)
    return NextResponse.json({ error: "Failed to update research project" }, { status: 500 })
  }
}

// DELETE handler for deleting a research project
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id

    // Check if project exists
    const existingProject = await prisma.researchProject.findUnique({
      where: { id: projectId },
    })

    if (!existingProject) {
      return NextResponse.json({ error: "Research project not found" }, { status: 404 })
    }

    // Delete project
    await prisma.researchProject.delete({
      where: { id: projectId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting research project:", error)
    return NextResponse.json({ error: "Failed to delete research project" }, { status: 500 })
  }
}
