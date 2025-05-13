import prisma from "./prisma"

// User data operations
export async function getUserData(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        personalData: true,
      },
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
      await prisma.personalData.upsert({
        where: { userId },
        update: data.personalData,
        create: {
          ...data.personalData,
          userId,
        },
      })
    }

    // Handle research data
    if (data.researchData) {
      // First delete existing research data if replacing the entire array
      if (Array.isArray(data.researchData)) {
        await prisma.researchProject.deleteMany({
          where: { userId },
        })

        // Then create new research projects
        await prisma.researchProject.createMany({
          data: data.researchData.map((project: any) => ({
            ...project,
            userId,
            startDate: new Date(project.startDate),
            endDate: project.endDate ? new Date(project.endDate) : null,
          })),
        })
      }
    }

    // Handle community service data
    if (data.communityServiceData) {
      if (Array.isArray(data.communityServiceData)) {
        await prisma.communityService.deleteMany({
          where: { userId },
        })

        await prisma.communityService.createMany({
          data: data.communityServiceData.map((service: any) => ({
            ...service,
            userId,
            startDate: new Date(service.startDate),
            endDate: service.endDate ? new Date(service.endDate) : null,
          })),
        })
      }
    }

    // Handle publication data
    if (data.publicationData) {
      if (Array.isArray(data.publicationData)) {
        await prisma.publication.deleteMany({
          where: { userId },
        })

        await prisma.publication.createMany({
          data: data.publicationData.map((publication: any) => ({
            ...publication,
            userId,
            year: Number.parseInt(publication.year),
            citationCount: publication.citationCount ? Number.parseInt(publication.citationCount) : null,
          })),
        })
      }
    }

    // Handle intellectual property data
    if (data.intellectualPropData) {
      if (Array.isArray(data.intellectualPropData)) {
        await prisma.intellectualProp.deleteMany({
          where: { userId },
        })

        await prisma.intellectualProp.createMany({
          data: data.intellectualPropData.map((prop: any) => ({
            ...prop,
            userId,
            filingDate: prop.filingDate ? new Date(prop.filingDate) : null,
            grantDate: prop.grantDate ? new Date(prop.grantDate) : null,
            expiryDate: prop.expiryDate ? new Date(prop.expiryDate) : null,
          })),
        })
      }
    }

    // Handle recognition data
    if (data.recognitionData) {
      if (Array.isArray(data.recognitionData)) {
        await prisma.recognition.deleteMany({
          where: { userId },
        })

        await prisma.recognition.createMany({
          data: data.recognitionData.map((recognition: any) => ({
            ...recognition,
            userId,
            date: new Date(recognition.date),
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
    const projects = await prisma.researchProject.findMany({
      where: { userId },
      include: {
        documents: true,
      },
      orderBy: {
        updatedAt: "desc",
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
    const project = await prisma.researchProject.findUnique({
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
    const project = await prisma.researchProject.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
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
    const project = await prisma.researchProject.update({
      where: { id: projectId },
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
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
    await prisma.researchProject.delete({
      where: { id: projectId },
    })
    return { success: true }
  } catch (error) {
    console.error("Error deleting research project:", error)
    throw new Error("Failed to delete research project")
  }
}
