import prisma from "../services/prisma";
import { TaskPayload } from "../types/Task";

export default class PrismaTaskRepository {
  async createTask(data: { task: TaskPayload; projectId: string }) {
    const { task, projectId } = data;

    return prisma.task.create({
      data: {
        ...task,
        projectId,
      },
    });
  }

  async getTasksByProject(projectId: string) {
    return prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateTask(taskId: string, projectId: string, data: Partial<TaskPayload>) {
    const updateResult = await prisma.task.updateMany({
      where: { id: taskId, projectId },
      data,
    });

    if (updateResult.count === 0) return null;

    return prisma.task.findFirst({ where: { id: taskId, projectId } });
  }

  async deleteTask(taskId: string, projectId: string) {
    const deleteResult = await prisma.task.deleteMany({
      where: { id: taskId, projectId },
    });

    return deleteResult.count > 0;
  }

  async updateTaskDone(taskId: string, projectId: string, done: boolean) {
    const updateResult = await prisma.task.updateMany({
      where: { id: taskId, projectId },
      data: { done },
    });

    if (updateResult.count === 0) return null;

    return prisma.task.findFirst({ where: { id: taskId, projectId } });
  }

  async getTaskById(taskId: string, projectId: string) {
    return prisma.task.findFirst({
      where: {
        id: taskId,
        projectId: projectId,
      },
    });
  }
}
