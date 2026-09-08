import TaskRepository from "../repositories/TaskRepository";
import ProjectRepository from "../repositories/ProjectRepository";
import { TaskPayload, TaskDTO } from "../types/Task";

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

/**
 * Create Task
 */
export async function createTask(
  projectId: string,
  userId: string,
  taskData: TaskPayload,
): Promise<TaskDTO> {
  // Ensure project belongs to user
  const project = await projectRepo.getProjectByIdForUser(projectId, userId);
  if (!project) throw new Error("Project not found or access denied");

  // Business rules
  if (!taskData.title || taskData.title.trim().length < 3) {
    throw new Error("Title must be at least 3 characters long");
  }

  // Normalize date
  const normalizedData: TaskPayload = taskData.deadline
    ? { ...taskData, deadline: new Date(taskData.deadline) }
    : taskData;

  const task = await taskRepo.createTask({
    projectId,
    task: normalizedData,
  });

  return toTaskDTO(task);
}

/**
 * Get all tasks for project
 */
export async function getTasksForProject(projectId: string, userId: string): Promise<TaskDTO[]> {
  const project = await projectRepo.getProjectByIdForUser(projectId, userId);
  if (!project) throw new Error("Project not found or access denied");

  const tasks = await taskRepo.getTasksByProject(projectId);
  return tasks.map(toTaskDTO);
}

/**
 * Get single task
 */
export async function getTaskForUser(
  taskId: string,
  projectId: string,
  userId: string,
): Promise<TaskDTO> {
  const project = await projectRepo.getProjectByIdForUser(projectId, userId);
  if (!project) throw new Error("Project not found or access denied");

  const task = await taskRepo.getTaskById(taskId, projectId);
  if (!task) throw new Error("Task not found");

  return toTaskDTO(task);
}

/**
 * Update task
 */
export async function updateTaskForUser(
  taskId: string,
  projectId: string,
  userId: string,
  data: Partial<TaskPayload>,
): Promise<TaskDTO> {
  const project = await projectRepo.getProjectByIdForUser(projectId, userId);
  if (!project) throw new Error("Project not found or access denied");

  const existing = await taskRepo.getTaskById(taskId, projectId);
  if (!existing) throw new Error("Task not found");

  if (data.title && data.title.trim().length < 3) {
    throw new Error("Title must be at least three characters long");
  }

  if (data.deadline !== undefined) {
    const parsed = new Date(data.deadline);
    if (isNaN(parsed.getTime())) throw new Error("Invalid deadline date");
    data.deadline = parsed;
  }

  const updated = await taskRepo.updateTask(taskId, projectId, data);
  if (!updated) throw new Error("Task not found or access denied");

  return toTaskDTO(updated);
}

/**
 * Delete task
 */
export async function deleteTaskForUser(
  taskId: string,
  projectId: string,
  userId: string,
): Promise<void> {
  const project = await projectRepo.getProjectByIdForUser(projectId, userId);
  if (!project) throw new Error("Project not found or access denied");

  const deleted = await taskRepo.deleteTask(taskId, projectId);
  if (!deleted) throw new Error("Task not found or access denied");
}

/**
 * Update only the `done` field
 */
export async function updateTaskDoneForUser(
  taskId: string,
  projectId: string,
  userId: string,
  done: boolean,
): Promise<TaskDTO> {
  const project = await projectRepo.getProjectByIdForUser(projectId, userId);
  if (!project) throw new Error("Project not found or access denied");

  const existing = await taskRepo.getTaskById(taskId, projectId);
  if (!existing) throw new Error("Task not found");

  const updated = await taskRepo.updateTaskDone(taskId, projectId, done);
  if (!updated) throw new Error("Task not found or access denied");

  return toTaskDTO(updated);
}
