import prisma from "../services/prisma";
import { ProjectPayload } from "../types/Project";


export default class PrismaProjectRepository {
  async createProject(data: { title: string; userId: string }) {
    return prisma.project.create({
      data,
    });
  }

  // Returns all projects that belong to a specific user
  async getProjectsByUser(userId: string) {
    return prisma.project.findMany({
      where: { userId },
    });
  }

  // Only returns the project if it belongs to the user
  async getProjectByIdForUser(projectId: string, userId: string) {
    return prisma.project.findFirst({
      where: {
        id: projectId,
        userId: userId,
      },
    });
  }

  async updateProject(projectId: string, userId: string, data: Partial<ProjectPayload>) {
    const updateResult = await prisma.project.updateMany({
      where: { id: projectId, userId },
      data,
    });

    if (updateResult.count === 0) return null;

    return prisma.project.findFirst({ where: { id: projectId, userId } });
  }

  async deleteProject(projectId: string, userId: string) {
    const deleteResult = await prisma.project.deleteMany({
      where: { id: projectId, userId },
    });

    return deleteResult.count > 0;
  }
}
