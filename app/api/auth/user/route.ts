import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { jwtVerify } from 'jose'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  console.log("User API - Request received")

  try {
    // Get token from cookie
    const token = request.cookies.get('token')?.value

    console.log("User API - Token cookie exists:", !!token)
    if (token) {
      console.log("User API - Token from cookie (preview):", `${token.substring(0, 15)}...`)
    }

    // Check for Authorization header if cookie is missing
    const authHeader = request.headers.get('authorization')
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
    console.log("User API - Token in Authorization header:", !!headerToken)

    // Use token from cookie or header
    const finalToken = token || headerToken
    console.log("User API - Final token source:", token ? "cookie" : headerToken ? "header" : "none")

    if (!finalToken) {
      console.log("User API - No token found, returning not logged in")
      return NextResponse.json({ isLoggedIn: false }, { status: 401 })
    }

    // Verify token
    console.log("User API - Verifying token")
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

    try {
      const { payload } = await jwtVerify(finalToken, secret)
      console.log("User API - Token verified, user data:", {
        userId: payload.userId,
        username: payload.username,
        role: payload.role
      })

      // Get user from database
      const user = await prisma.user.findUnique({
        where: {
          id: payload.userId as string
        },
        include: {
          personal_data: true,
          study_program: true
        }
      })

      if (!user) {
        console.log("User API - User from token not found in database")
        return NextResponse.json({ isLoggedIn: false }, { status: 401 })
      }

      // Don't return password
      const { password, ...userWithoutPassword } = user
      console.log("User API - User data fetched successfully, returning response")

      return NextResponse.json({
        isLoggedIn: true,
        user: userWithoutPassword
      })
    } catch (verifyError) {
      console.error("User API - Token verification failed:", verifyError)
      return NextResponse.json({ isLoggedIn: false, error: 'Invalid token' }, { status: 401 })
    }
  } catch (error) {
    console.error("User API - Error processing request:", error)
    return NextResponse.json({ isLoggedIn: false, error: 'Server error' }, { status: 500 })
  }
} 
