import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { DocumentCategory } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()

    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as DocumentCategory
    const tags = JSON.parse(formData.get("tags") as string || "[]") as string[]
    const relatedItemId = formData.get("relatedItemId") as string

    if (!file || !title || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real-world scenario, you would:
    // 1. Upload the file to a storage service (S3, Azure, etc.)
    // 2. Get the URL of the uploaded file
    // For this example, we'll simulate that with a placeholder URL

    const fileBytes = await file.arrayBuffer()
    const buffer = Buffer.from(fileBytes)

    // Mock upload, in production use a real storage service like AWS S3
    const fileUrl = `https://example.com/uploads/${file.name}`
    const thumbnailUrl = `https://example.com/thumbnails/${file.name}`

    // Create document record in database
    const document = await prisma.document.create({
      data: {
        judul: title,
        deskripsi: description,
        nama_file: file.name,
        ukuran_file: buffer.length,
        tipe_file: file.type,
        url: fileUrl,
        url_thumbnail: thumbnailUrl,
        kategori: category,
        tag: tags,
        user_id: session.user.id,
        // Connect to related item based on category
        ...(category === "RESEARCH" && relatedItemId && {
          research_project: { connect: { id: relatedItemId } }
        }),
        ...(category === "COMMUNITY_SERVICE" && relatedItemId && {
          community_service: { connect: { id: relatedItemId } }
        }),
        ...(category === "PUBLICATION" && relatedItemId && {
          publication: { connect: { id: relatedItemId } }
        }),
        ...(category === "INTELLECTUAL_PROPERTY" && relatedItemId && {
          intellectual_prop: { connect: { id: relatedItemId } }
        }),
        ...(category === "RECOGNITION" && relatedItemId && {
          recognition: { connect: { id: relatedItemId } }
        }),
      }
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error("Error uploading document:", error)
    return NextResponse.json({ error: "Failed to upload document" }, { status: 500 })
  }
} 
