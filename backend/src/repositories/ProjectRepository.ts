import prisma from "../services/prisma";
import { ProjectPayload, ProjectStatus, ProjectPriority } from "../types/Project";

export default class PrismaProjectRepository {
  async createProject(data: { project: ProjectPayload; userId: string }) {
    const { project, userId } = data;

    return prisma.project.create({
      data: {
        ...project,
        userId,
      },
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

  async getFilteredProjects(
    userId: string,
    filters: {
      search?: string;
      status?: ProjectStatus;
      priority?: ProjectPriority;
    },
  ) {
    return prisma.project.findMany({
      where: {
        userId,
        title: filters.search ? { contains: filters.search, mode: "insensitive" } : undefined,
        status: filters.status || undefined,
        priority: filters.priority || undefined,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
