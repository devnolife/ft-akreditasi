import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

// Schema for document version creation
const documentVersionSchema = z.object({
  fileName: z.string(),
  fileSize: z.number().int().positive(),
  url: z.string().url(),
  changeDescription: z.string().optional(),
  createdBy: z.string(),
})

// GET handler for fetching document versions
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const documentId = params.id

    // Check if document exists
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    })

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Get versions
    const versions = await prisma.documentVersion.findMany({
      where: { documentId },
      orderBy: {
        versionNumber: "desc",
      },
    })

    return NextResponse.json(versions)
  } catch (error) {
    console.error("Error fetching document versions:", error)
    return NextResponse.json({ error: "Failed to fetch document versions" }, { status: 500 })
  }
}

// POST handler for creating a new document version
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const documentId = params.id
    const body = await request.json()

    // Validate request body
    const validatedData = documentVersionSchema.parse(body)

    // Check if document exists
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        versions: {
          orderBy: {
            versionNumber: "desc",
          },
          take: 1,
        },
      },
    })

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Calculate next version number
    const nextVersionNumber = document.versions.length > 0 ? document.versions[0].versionNumber + 1 : 1

    // Create new version
    const newVersion = await prisma.documentVersion.create({
      data: {
        ...validatedData,
        documentId,
        versionNumber: nextVersionNumber,
      },
    })

    // Update document with new file info
    await prisma.document.update({
      where: { id: documentId },
      data: {
        fileName: validatedData.fileName,
        fileSize: validatedData.fileSize,
        url: validatedData.url,
        version: nextVersionNumber,
      },
    })

    return NextResponse.json(newVersion, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error creating document version:", error)
    return NextResponse.json({ error: "Failed to create document version" }, { status: 500 })
  }
}
