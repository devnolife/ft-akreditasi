import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { DocumentCategory } from "@prisma/client"

// Schema for document update
const documentUpdateSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.nativeEnum(DocumentCategory).optional(),
  researchProjectId: z.string().optional().nullable(),
  communityServiceId: z.string().optional().nullable(),
  publicationId: z.string().optional().nullable(),
  intellectualPropId: z.string().optional().nullable(),
  recognitionId: z.string().optional().nullable(),
})

// GET handler for fetching a specific document
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const documentId = params.id

    const document = await prisma.document.findUnique({
      where: { id: documentId },
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
    })

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error("Error fetching document:", error)
    return NextResponse.json({ error: "Failed to fetch document" }, { status: 500 })
  }
}

// PATCH handler for updating a document
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const documentId = params.id
    const body = await request.json()

    // Validate request body
    const validatedData = documentUpdateSchema.parse(body)

    // Check if document exists
    const existingDocument = await prisma.document.findUnique({
      where: { id: documentId },
    })

    if (!existingDocument) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Update document
    const document = await prisma.document.update({
      where: { id: documentId },
      data: validatedData,
    })

    return NextResponse.json(document)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error updating document:", error)
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 })
  }
}

// DELETE handler for deleting a document
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const documentId = params.id

    // Check if document exists
    const existingDocument = await prisma.document.findUnique({
      where: { id: documentId },
    })

    if (!existingDocument) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Delete document
    await prisma.document.delete({
      where: { id: documentId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 })
  }
}
