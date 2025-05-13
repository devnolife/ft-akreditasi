import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET handler for fetching a specific user with search params
export async function GET(request: NextRequest) {
  try {
    // Get user ID from URL search parameters
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

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
