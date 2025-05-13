import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

// Schema for user update
const userUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  nidn: z.string().optional(),
  frontDegree: z.string().optional(),
  backDegree: z.string().optional(),
  role: z.enum(["ADMIN", "LECTURER", "PRODI"]).optional(),
  studyProgramId: z.string().optional(),
})

// GET handler for fetching a specific user
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        personalData: true,
        studyProgram: true,
        researchProjects: {
          orderBy: {
            updatedAt: "desc",
          },
        },
        communityServices: {
          orderBy: {
            updatedAt: "desc",
          },
        },
        publications: {
          orderBy: {
            updatedAt: "desc",
          },
        },
        intellectualProps: {
          orderBy: {
            updatedAt: "desc",
          },
        },
        recognitions: {
          orderBy: {
            updatedAt: "desc",
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
    const userId = params.id
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

    // Check if NIDN is unique if provided
    if (validatedData.nidn && validatedData.nidn !== existingUser.nidn) {
      const existingNidn = await prisma.user.findUnique({
        where: { nidn: validatedData.nidn },
      })

      if (existingNidn) {
        return NextResponse.json({ error: "User with this NIDN already exists" }, { status: 400 })
      }
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
    const userId = params.id

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
