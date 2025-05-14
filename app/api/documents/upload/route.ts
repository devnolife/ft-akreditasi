import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { uploadFile } from "@/lib/minio-upload"
import prisma from "@/lib/prisma"
import { DocumentCategory as PrismaDocumentCategory } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()

    // Get required fields
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const category = formData.get("category") as string

    // Get optional fields
    const description = formData.get("description") as string || ""
    const relatedItemId = formData.get("relatedItemId") as string || ""
    const tags = formData.get("tags")
      ? JSON.parse(formData.get("tags") as string)
      : []

    // Validate required fields
    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 })
    }

    // Prepare metadata for MinIO
    const metadata = {
      userId: session.user.id,
      category,
      title: title || file.name,
      description,
      relatedItemId,
      tags
    }

    // Upload file to MinIO
    const uploadResult = await uploadFile(formData, metadata)

    if (!uploadResult.success) {
      return NextResponse.json({
        error: "Upload failed",
        details: uploadResult.error
      }, { status: 500 })
    }

    // Create database record for the document
    let relatedItemField = {}

    // Set the related item field based on the category
    if (relatedItemId) {
      switch (category) {
        case "research":
          relatedItemField = { research_project: { connect: { id: relatedItemId } } }
          break

        case "community_service":
          relatedItemField = { community_service: { connect: { id: relatedItemId } } }
          break

        case "publication":
          relatedItemField = { publication: { connect: { id: relatedItemId } } }
          break

        case "intellectual_property":
          relatedItemField = { intellectual_prop: { connect: { id: relatedItemId } } }
          break

        case "recognition":
          relatedItemField = { recognition: { connect: { id: relatedItemId } } }
          break
      }
    }

    // Create the document record in the database
    const document = await prisma.document.create({
      data: {
        judul: title || file.name,
        deskripsi: description,
        nama_file: file.name,
        ukuran_file: file.size,
        tipe_file: file.type,
        url: uploadResult.url,
        url_thumbnail: file.type.startsWith("image/") ? uploadResult.url : null,
        kategori: category.toUpperCase() as PrismaDocumentCategory,
        tag: tags,
        versi: 1,
        user: { connect: { id: session.user.id } },
        ...relatedItemField,
        versions: {
          create: {
            nomor_versi: 1,
            nama_file: file.name,
            ukuran_file: file.size,
            url: uploadResult.url,
            deskripsi_perubahan: "Initial upload",
            created_by: session.user.id,
          },
        },
      },
      include: {
        versions: true,
      },
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error("Error uploading document:", error)
    return NextResponse.json({
      error: "Failed to upload document",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 
