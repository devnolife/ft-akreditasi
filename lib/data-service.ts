'use server'

import prisma from "./prisma"

// User data operations
export async function getUserData(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        personal_data: true,
        research_projects: {
          orderBy: { updated_at: 'desc' },
          include: { documents: true }
        },
        community_services: {
          orderBy: { updated_at: 'desc' },
          include: { documents: true }
        },
        publications: {
          orderBy: { updated_at: 'desc' },
          include: { documents: true }
        },
        intellectual_props: {
          orderBy: { updated_at: 'desc' },
          include: { documents: true }
        },
        recognitions: {
          orderBy: { updated_at: 'desc' },
          include: { documents: true }
        },
        study_program: true,
      }
    })
    return user
  } catch (error) {
    console.error("Error fetching user data:", error)
    throw new Error("Failed to fetch user data")
  }
}

export async function saveUserData(userId: string, data: any) {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error("User not found")
    }

    // Handle personal data
    if (data.personalData) {
      await prisma.personal_data.upsert({
        where: { user_id: userId },
        update: data.personalData,
        create: {
          ...data.personalData,
          user_id: userId,
        },
      })
    }

    // Handle research data
    if (data.researchData) {
      // First delete existing research data if replacing the entire array
      if (Array.isArray(data.researchData)) {
        await prisma.research_project.deleteMany({
          where: { user_id: userId },
        })

        // Then create new research projects
        await prisma.research_project.createMany({
          data: data.researchData.map((project: any) => ({
            ...project,
            user_id: userId,
            tanggal_mulai: new Date(project.tanggal_mulai),
            tanggal_selesai: project.tanggal_selesai ? new Date(project.tanggal_selesai) : null,
          })),
        })
      }
    }

    // Handle community service data
    if (data.communityServiceData) {
      if (Array.isArray(data.communityServiceData)) {
        await prisma.community_service.deleteMany({
          where: { user_id: userId },
        })

        await prisma.community_service.createMany({
          data: data.communityServiceData.map((service: any) => ({
            ...service,
            user_id: userId,
            tanggal_mulai: new Date(service.tanggal_mulai),
            tanggal_selesai: service.tanggal_selesai ? new Date(service.tanggal_selesai) : null,
          })),
        })
      }
    }

    // Handle publication data
    if (data.publicationData) {
      if (Array.isArray(data.publicationData)) {
        await prisma.publication.deleteMany({
          where: { user_id: userId },
        })

        await prisma.publication.createMany({
          data: data.publicationData.map((publication: any) => ({
            ...publication,
            user_id: userId,
            tahun: Number.parseInt(publication.tahun),
            jumlah_sitasi: publication.jumlah_sitasi ? Number.parseInt(publication.jumlah_sitasi) : null,
          })),
        })
      }
    }

    // Handle intellectual property data
    if (data.intellectualPropData) {
      if (Array.isArray(data.intellectualPropData)) {
        await prisma.intellectual_prop.deleteMany({
          where: { user_id: userId },
        })

        await prisma.intellectual_prop.createMany({
          data: data.intellectualPropData.map((prop: any) => ({
            ...prop,
            user_id: userId,
            tanggal_pendaftaran: prop.tanggal_pendaftaran ? new Date(prop.tanggal_pendaftaran) : null,
            tanggal_pemberian: prop.tanggal_pemberian ? new Date(prop.tanggal_pemberian) : null,
            tanggal_berakhir: prop.tanggal_berakhir ? new Date(prop.tanggal_berakhir) : null,
          })),
        })
      }
    }

    // Handle recognition data
    if (data.recognitionData) {
      if (Array.isArray(data.recognitionData)) {
        await prisma.recognition.deleteMany({
          where: { user_id: userId },
        })

        await prisma.recognition.createMany({
          data: data.recognitionData.map((recognition: any) => ({
            ...recognition,
            user_id: userId,
            tanggal: new Date(recognition.tanggal),
          })),
        })
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error saving user data:", error)
    throw new Error("Failed to save user data")
  }
}

export async function deleteUserData(userId: string) {
  try {
    // This will cascade delete all related data due to our schema setup
    await prisma.user.delete({
      where: { id: userId },
    })
    return { success: true }
  } catch (error) {
    console.error("Error deleting user data:", error)
    throw new Error("Failed to delete user data")
  }
}

// Research project operations
export async function getResearchProjects(userId: string) {
  try {
    const projects = await prisma.research_project.findMany({
      where: { user_id: userId },
      include: {
        documents: true,
      },
      orderBy: {
        updated_at: "desc",
      },
    })
    return projects
  } catch (error) {
    console.error("Error fetching research projects:", error)
    throw new Error("Failed to fetch research projects")
  }
}

export async function getResearchProjectById(projectId: string) {
  try {
    const project = await prisma.research_project.findUnique({
      where: { id: projectId },
      include: {
        documents: true,
      },
    })
    return project
  } catch (error) {
    console.error("Error fetching research project:", error)
    throw new Error("Failed to fetch research project")
  }
}

export async function createResearchProject(data: any) {
  try {
    const project = await prisma.research_project.create({
      data: {
        ...data,
        tanggal_mulai: new Date(data.tanggal_mulai),
        tanggal_selesai: data.tanggal_selesai ? new Date(data.tanggal_selesai) : null,
      },
    })
    return project
  } catch (error) {
    console.error("Error creating research project:", error)
    throw new Error("Failed to create research project")
  }
}

export async function updateResearchProject(projectId: string, data: any) {
  try {
    const project = await prisma.research_project.update({
      where: { id: projectId },
      data: {
        ...data,
        tanggal_mulai: new Date(data.tanggal_mulai),
        tanggal_selesai: data.tanggal_selesai ? new Date(data.tanggal_selesai) : null,
      },
    })
    return project
  } catch (error) {
    console.error("Error updating research project:", error)
    throw new Error("Failed to update research project")
  }
}

export async function deleteResearchProject(projectId: string) {
  try {
    await prisma.research_project.delete({
      where: { id: projectId },
    })
    return { success: true }
  } catch (error) {
    console.error("Error deleting research project:", error)
    throw new Error("Failed to delete research project")
  }
}

// Add these functions to handle personal data operations

// Get personal data for a specific user
export async function getPersonalData(userId: string) {
  try {
    const response = await fetch(`/api/users/personal-data?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch personal data')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching personal data:', error)
    throw error
  }
}

// Save or update personal data for a specific user
export async function savePersonalData(userId: string, data: any) {
  try {
    const response = await fetch('/api/users/personal-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        data,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to save personal data')
    }

    return await response.json()
  } catch (error) {
    console.error('Error saving personal data:', error)
    throw error
  }
}
