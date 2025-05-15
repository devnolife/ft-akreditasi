import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || 'https://sicekcok.if.unismuh.ac.id/graphql'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const nidn = searchParams.get('nidn')

    if (!nidn) {
      return NextResponse.json({ error: 'NIDN is required' }, { status: 400 })
    }

    // First check if user exists in our database
    const existingUser = await prisma.user.findFirst({
      where: {
        username: nidn
      },
      include: {
        personal_data: true,
        study_program: true
      }
    })

    // Always fetch from GraphQL to compare
    const graphqlQuery = `
      query Dosen {
        dosen(nidn: "${nidn}") {
          nidn
          nama
          gelar_depan
          gelar_belakang
          tempat_lahir
          tanggal_lahir
          email
          prodiId
        }
      }
    `

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: graphqlQuery
      })
    })

    const data = await response.json()

    if (data.errors) {
      return NextResponse.json({ error: 'GraphQL query failed' }, { status: 500 })
    }

    const dosenData = data.data.dosen

    if (!dosenData) {
      return NextResponse.json({ error: 'Dosen not found' }, { status: 404 })
    }

    // Compare data if user exists in database
    if (existingUser) {
      const isDataDifferent =
        existingUser.name !== dosenData.nama ||
        existingUser.front_degree !== dosenData.gelar_depan ||
        existingUser.back_degree !== dosenData.gelar_belakang ||
        existingUser.personal_data?.tempat_lahir !== dosenData.tempat_lahir ||
        (existingUser.personal_data?.tanggal_lahir?.toISOString().split('T')[0] !==
          new Date(dosenData.tanggal_lahir).toISOString().split('T')[0]);

      if (isDataDifferent) {
        // Update user data if different
        const updatedUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name: dosenData.nama,
            front_degree: dosenData.gelar_depan,
            back_degree: dosenData.gelar_belakang,
            personal_data: {
              update: {
                tempat_lahir: dosenData.tempat_lahir,
                tanggal_lahir: dosenData.tanggal_lahir ? new Date(dosenData.tanggal_lahir) : null,
              }
            }
          },
          include: {
            personal_data: true,
            study_program: true
          }
        })

        return NextResponse.json({
          user: updatedUser,
          dataComparison: {
            isDifferent: true,
            message: 'Data was updated from GraphQL'
          }
        })
      }

      return NextResponse.json({
        user: existingUser,
        dataComparison: {
          isDifferent: false,
          message: 'Data matches between database and GraphQL'
        }
      })
    }

    // Create new user if not exists
    const newUser = await prisma.user.create({
      data: {
        username: dosenData.nidn,
        name: dosenData.nama,
        front_degree: dosenData.gelar_depan,
        back_degree: dosenData.gelar_belakang,
        password: dosenData.nidn, // Adding required password field
        personal_data: {
          create: {
            tempat_lahir: dosenData.tempat_lahir,
            tanggal_lahir: dosenData.tanggal_lahir ? new Date(dosenData.tanggal_lahir) : null,
          }
        }
      },
      include: {
        personal_data: true,
        study_program: true
      }
    })

    return NextResponse.json({
      user: newUser,
      dataComparison: {
        isDifferent: false,
        message: 'New user created from GraphQL data'
      }
    })
  } catch (error) {
    console.error('Error in graphql-profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
