import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { DocumentCategory } from "@prisma/client"

// Schema for document creation
const documentSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  fileName: z.string(),
  fileSize: z.number().int().positive(),
  fileType: z.string(),
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  category: z.nativeEnum(DocumentCategory),
  tags: z.array(z.string()).default([]),
  userId: z.string(),
  researchProjectId: z.string().optional(),
  communityServiceId: z.string().optional(),
  publicationId: z.string().optional(),
  intellectualPropId: z.string().optional(),
  recognitionId: z.string().optional(),
})

// GET handler for fetching documents
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")
    const category = searchParams.get("category") as DocumentCategory | null
    const searchTerm = searchParams.get("search")

    // Build where clause
    const whereClause: any = {}
    if (userId) {
      whereClause.userId = userId
    }
    if (category) {
      whereClause.category = category
    }
    if (searchTerm) {
      whereClause.OR = [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
        { fileName: { contains: searchTerm, mode: "insensitive" } },
      ]
    }

    const documents = await prisma.document.findMany({
      where: whereClause,
      include: {
        versions: {
          orderBy: {
            versionNumber: "desc",
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}

// POST handler for creating a document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = documentSchema.parse(body)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create document with initial version
    const document = await prisma.document.create({
      data: {
        ...validatedData,
        versions: {
          create: {
            versionNumber: 1,
            fileName: validatedData.fileName,
            fileSize: validatedData.fileSize,
            url: validatedData.url,
            changeDescription: "Initial upload",
            createdBy: validatedData.userId,
          },
        },
      },
      include: {
        versions: true,
      },
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error creating document:", error)
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 })
  }
}
