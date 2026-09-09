import TaskRepository from "../repositories/TaskRepository";
import ProjectRepository from "../repositories/ProjectRepository";
import { TaskPayload, TaskDTO } from "../types/Task";
import { BadRequestError, NotFoundError } from "../errors/AppError";
import { normalizeDeadline } from "../lib/deadline";

const taskRepo = new TaskRepository();
const projectRepo = new ProjectRepository();

/**
 * Mapper: Prisma Task → TaskDTO
 */
function toTaskDTO(task: {
  id: string;
  title: string;
  description: string | null;
  done: boolean;
  deadline: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): TaskDTO {
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? undefined,
    done: task.done,
    deadline: task.deadline ?? undefined,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

/** Load a project the user owns, or throw 404. */
async function assertProjectOwned(projectId: string, userId: string) {
  const project = await projectRepo.getProjectByIdForUser(projectId, userId);
  if (!project) {
    throw new NotFoundError("Project not found or access denied", "project-not-found");
  }
  return project;
}

function assertValidTitle(title?: string) {
  if (title !== undefined && title.trim().length < 3) {
    throw new BadRequestError("Title must be at least 3 characters long", "invalid-title");
  }
}

export async function createTask(
  projectId: string,
  userId: string,
  taskData: TaskPayload,
): Promise<TaskDTO> {
  await assertProjectOwned(projectId, userId);
  assertValidTitle(taskData.title);

  const normalizedData: TaskPayload = { ...taskData };
  if (taskData.deadline !== undefined) {
    normalizedData.deadline = normalizeDeadline(taskData.deadline);
  }

  const task = await taskRepo.createTask({
    projectId,
    task: normalizedData,
  });

  return toTaskDTO(task);
}

export async function getTasksForProject(projectId: string, userId: string): Promise<TaskDTO[]> {
  await assertProjectOwned(projectId, userId);

  const tasks = await taskRepo.getTasksByProject(projectId);
  return tasks.map(toTaskDTO);
}

export async function getTaskForUser(
  taskId: string,
  projectId: string,
  userId: string,
): Promise<TaskDTO> {
  await assertProjectOwned(projectId, userId);

  const task = await taskRepo.getTaskById(taskId, projectId);
  if (!task) {
    throw new NotFoundError("Task not found", "task-not-found");
  }

  return toTaskDTO(task);
}

export async function updateTaskForUser(
  taskId: string,
  projectId: string,
  userId: string,
  data: Partial<TaskPayload>,
): Promise<TaskDTO> {
  await assertProjectOwned(projectId, userId);

  const existing = await taskRepo.getTaskById(taskId, projectId);
  if (!existing) {
    throw new NotFoundError("Task not found", "task-not-found");
  }

  assertValidTitle(data.title);

  if (data.deadline !== undefined) {
    data.deadline = normalizeDeadline(data.deadline);
  }

  const updated = await taskRepo.updateTask(taskId, projectId, data);
  if (!updated) {
    throw new NotFoundError("Task not found", "task-not-found");
  }

  return toTaskDTO(updated);
}

export async function deleteTaskForUser(
  taskId: string,
  projectId: string,
  userId: string,
): Promise<void> {
  await assertProjectOwned(projectId, userId);

  const deleted = await taskRepo.deleteTask(taskId, projectId);
  if (!deleted) {
    throw new NotFoundError("Task not found", "task-not-found");
  }
}

export async function updateTaskDoneForUser(
  taskId: string,
  projectId: string,
  userId: string,
  done: boolean,
): Promise<TaskDTO> {
  await assertProjectOwned(projectId, userId);

  const existing = await taskRepo.getTaskById(taskId, projectId);
  if (!existing) {
    throw new NotFoundError("Task not found", "task-not-found");
  }

  const updated = await taskRepo.updateTaskDone(taskId, projectId, done);
  if (!updated) {
    throw new NotFoundError("Task not found", "task-not-found");
  }

  return toTaskDTO(updated);
}
