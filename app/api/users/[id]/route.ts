import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

// Schema for user update
const userUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  frontDegree: z.string().optional(),
  backDegree: z.string().optional(),
  role: z.enum(["ADMIN", "LECTURER", "PRODI"]).optional(),
  studyProgramId: z.string().optional(),
})

// GET handler for fetching a specific user
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get user ID from URL parameters
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId") || params.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        personal_data: true,
        study_program: true,
        research_projects: {
          orderBy: {
            updated_at: "desc",
          },
        },
        community_services: {
          orderBy: {
            updated_at: "desc",
          },
        },
        publications: {
          orderBy: {
            updated_at: "desc",
          },
        },
        intellectual_props: {
          orderBy: {
            updated_at: "desc",
          },
        },
        recognitions: {
          orderBy: {
            updated_at: "desc",
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

// PATCH handler for updating a user
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get user ID from URL parameters
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId") || params.id

    const body = await request.json()

    // Validate request body
    const validatedData = userUpdateSchema.parse(body)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: validatedData,
    })

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

// DELETE handler for deleting a user
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get user ID from URL parameters
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId") || params.id

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete user (will cascade delete all related data)
    await prisma.user.delete({
      where: { id: userId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
