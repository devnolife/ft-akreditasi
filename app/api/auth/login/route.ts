import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const requestHeaders = Object.fromEntries([...request.headers.entries()])
    const body = await request.json().catch(err => {
      throw new Error("Invalid request body")
    })

    const { username, password } = body

    // Validasi input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username dan password harus diisi' },
        { status: 400 }
      )
    }

    // Cari user berdasarkan username
    let user
    try {
      user = await prisma.user.findUnique({
        where: { username },
        include: {
          personal_data: true
        }
      })
    } catch (dbError) {
      console.error("API Login - Database error when finding user:", dbError)
      return NextResponse.json(
        { error: 'Terjadi kesalahan database' },
        { status: 500 }
      )
    }

    // Jika user tidak ditemukan
    if (!user) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      )
    }

    // Verifikasi password
    let isValidPassword
    try {
      isValidPassword = await bcrypt.compare(password, user.password)
    } catch (bcryptError) {
      console.error("API Login - Error comparing passwords:", bcryptError)
      return NextResponse.json(
        { error: 'Terjadi kesalahan otentikasi' },
        { status: 500 }
      )
    }

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      )
    }

    // Buat JWT token
    let token
    try {
      token = sign(
        {
          userId: user.id,
          username: user.username,
          role: user.role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      )
    } catch (jwtError) {
      console.error("API Login - Error generating JWT token:", jwtError)
      return NextResponse.json(
        { error: 'Terjadi kesalahan saat membuat token' },
        { status: 500 }
      )
    }

    // Hapus password dari response
    const { password: _, ...userWithoutPassword } = user


    // Buat response with cookies
    const responseData = {
      user: userWithoutPassword,
      success: true,
      token: token
    }


    const response = NextResponse.json(responseData)

    // Atur token dalam cookie - secure dalam production
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 86400, // 1 hari dalam detik
      path: '/'
    }

    // Set token cookie
    try {
      // Set-Cookie header untuk memastikan browser menyimpan cookie
      response.cookies.set('token', token, cookieOptions)

      // Tambahkan Set-Cookie header secara manual sebagai cadangan
      const cookieHeader = response.headers.get('Set-Cookie') || '';
      if (!cookieHeader.includes('token=')) {
        const tokenCookie = `token=${token}; Path=/; Max-Age=86400; ${process.env.NODE_ENV === 'production' ? 'Secure; ' : ''}HttpOnly; SameSite=Lax`;
        response.headers.set('Set-Cookie', cookieHeader ? `${cookieHeader}, ${tokenCookie}` : tokenCookie);
      }

      console.log("API Login - Cookie successfully set")
    } catch (cookieError) {
      console.error("API Login - Error setting cookie:", cookieError)
      // Continue anyway since we're returning the token in response body too
    }

    return response

  } catch (error) {
    console.error('API Login - Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    )
  }
} 
