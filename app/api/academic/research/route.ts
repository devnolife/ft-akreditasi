import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET: Retrieve user's research projects
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = request.nextUrl.searchParams.get("userId") || session.user.id

    // Only allow users to access their own data unless they're an admin
    if (session.user.id !== userId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const researchProjects = await prisma.research_project.findMany({
      where: { user_id: userId },
      include: {
        documents: true,
      },
      orderBy: {
        updated_at: 'desc',
      },
    })

    return NextResponse.json(researchProjects, { status: 200 })
  } catch (error) {
    console.error("Error fetching research projects:", error)
    return NextResponse.json({ error: "Failed to fetch research projects" }, { status: 500 })
  }
}

// POST: Create a new research project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    if (!data.judul) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const researchProject = await prisma.research_project.create({
      data: {
        ...data,
        user_id: session.user.id,
        tanggal_mulai: data.tanggal_mulai ? new Date(data.tanggal_mulai) : new Date(),
        tanggal_selesai: data.tanggal_selesai ? new Date(data.tanggal_selesai) : null,
        tahun_pelaksanaan: data.tahun_pelaksanaan ? parseInt(data.tahun_pelaksanaan) : null,
        tahun_pengajuan_pertama: data.tahun_pengajuan_pertama ? parseInt(data.tahun_pengajuan_pertama) : null,
      }
    })

    return NextResponse.json(researchProject, { status: 201 })
  } catch (error) {
    console.error("Error creating research project:", error)
    return NextResponse.json({ error: "Failed to create research project" }, { status: 500 })
  }
}

// PUT: Update a research project
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: "Research project ID is required" }, { status: 400 })
    }

    // Check if the user owns this research project
    const researchProject = await prisma.research_project.findUnique({
      where: { id: data.id },
    })

    if (!researchProject) {
      return NextResponse.json({ error: "Research project not found" }, { status: 404 })
    }

    if (researchProject.user_id !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updatedResearchProject = await prisma.research_project.update({
      where: { id: data.id },
      data: {
        ...data,
        tanggal_mulai: data.tanggal_mulai ? new Date(data.tanggal_mulai) : undefined,
        tanggal_selesai: data.tanggal_selesai ? new Date(data.tanggal_selesai) : null,
        tahun_pelaksanaan: data.tahun_pelaksanaan ? parseInt(data.tahun_pelaksanaan) : null,
        tahun_pengajuan_pertama: data.tahun_pengajuan_pertama ? parseInt(data.tahun_pengajuan_pertama) : null,
        updated_at: new Date(),
      }
    })

    return NextResponse.json(updatedResearchProject, { status: 200 })
  } catch (error) {
    console.error("Error updating research project:", error)
    return NextResponse.json({ error: "Failed to update research project" }, { status: 500 })
  }
}

// DELETE: Delete a research project
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = request.nextUrl.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Research project ID is required" }, { status: 400 })
    }

    // Check if the user owns this research project
    const researchProject = await prisma.research_project.findUnique({
      where: { id },
    })

    if (!researchProject) {
      return NextResponse.json({ error: "Research project not found" }, { status: 404 })
    }

    if (researchProject.user_id !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete the research project
    await prisma.research_project.delete({
      where: { id },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting research project:", error)
    return NextResponse.json({ error: "Failed to delete research project" }, { status: 500 })
  }
} 
