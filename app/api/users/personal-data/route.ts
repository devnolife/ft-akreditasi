import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET: Retrieve user personal data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Only allow users to access their own data unless they're an admin
    if (session.user.id !== userId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const personalData = await prisma.personal_data.findUnique({
      where: { user_id: userId },
    })

    return NextResponse.json(personalData || {}, { status: 200 })
  } catch (error) {
    console.error("Error fetching personal data:", error)
    return NextResponse.json({ error: "Failed to fetch personal data" }, { status: 500 })
  }
}

// POST: Create or update personal data
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId, data } = await request.json()

    if (!userId || !data) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    // Only allow users to update their own data unless they're an admin
    if (session.user.id !== userId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if personal data exists
    const existingData = await prisma.personal_data.findUnique({
      where: { user_id: userId },
    })

    let personalData

    if (existingData) {
      // Update existing record
      personalData = await prisma.personal_data.update({
        where: { user_id: userId },
        data: {
          tempat_lahir: data.tempat_lahir,
          tanggal_lahir: data.tanggal_lahir ? new Date(data.tanggal_lahir) : null,
          jenis_kelamin: data.jenis_kelamin,
          alamat: data.alamat,
          telepon: data.telepon,
          nomor_pegawai: data.nomor_pegawai,
          jabatan: data.jabatan,
          status_kepegawaian: data.status_kepegawaian,
          spesialisasi: data.spesialisasi,
          gelar_tertinggi: data.gelar_tertinggi,
          institusi: data.institusi,
          tahun_lulus: data.tahun_lulus,
          biografi: data.biografi,
          url_foto: data.url_foto,
          updated_at: new Date(),
        },
      })
    } else {
      // Create new record
      personalData = await prisma.personal_data.create({
        data: {
          user_id: userId,
          tempat_lahir: data.tempat_lahir,
          tanggal_lahir: data.tanggal_lahir ? new Date(data.tanggal_lahir) : null,
          jenis_kelamin: data.jenis_kelamin,
          alamat: data.alamat,
          telepon: data.telepon,
          nomor_pegawai: data.nomor_pegawai,
          jabatan: data.jabatan,
          status_kepegawaian: data.status_kepegawaian,
          spesialisasi: data.spesialisasi,
          gelar_tertinggi: data.gelar_tertinggi,
          institusi: data.institusi,
          tahun_lulus: data.tahun_lulus,
          biografi: data.biografi,
          url_foto: data.url_foto,
        },
      })
    }

    return NextResponse.json(personalData, { status: 200 })
  } catch (error) {
    console.error("Error updating personal data:", error)
    return NextResponse.json({ error: "Failed to update personal data" }, { status: 500 })
  }
} 
