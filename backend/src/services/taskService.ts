import TaskRepository from "../repositories/TaskRepository";
import ProjectRepository from "../repositories/ProjectRepository";
import { TaskPayload, TaskDTO } from "../types/Task";

const taskRepo = new TaskRepository();
const projectRepo = new ProjectRepository();

export async function createTask(
  projectId: string,
  userId: string,
  taskData: TaskPayload
): Promise<TaskDTO> {

  
  const project = await projectRepo.getProjectByIdForUser(projectId, userId);
  if (!project) {
    throw new Error("Project not found or access denied");
  }

  
  if (!taskData.title || taskData.title.length < 3) {
    throw new Error("Title must be at least 3 characters long");
  }

  if (taskData.deadline && isNaN(new Date(taskData.deadline).getTime())) {
    throw new Error("Invalid deadline date");
  }

  
  const task = await taskRepo.createTask({
    projectId,
    task: taskData,
  });

  
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


export async function getTasksForProject(
  projectId: string,
  userId: string
): Promise<TaskDTO[]> {

  const project = await projectRepo.getProjectByIdForUser(projectId, userId);
  if (!project) {
    throw new Error("Project not found or access denied");
  }

  const tasks = await taskRepo.getTasksByProject(projectId);

  return tasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description ?? undefined,
    done: task.done,
    deadline: task.deadline ?? undefined,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

export async function updateTaskForUser(
  taskId: string,
  projectId: string,
  userId: string,
  data: Partial<TaskPayload>
): Promise<TaskDTO> {

  const project = await projectRepo.getProjectByIdForUser(projectId, userId);
  if (!project) {
    throw new Error("Project not found or access denied");
  }

  const task = await taskRepo.getTaskById(taskId, projectId);
  if (!task) {
    throw new Error("Task not found");
  }

  if (data.title && data.title.length < 3) {
    throw new Error("Title must be at least three characters long");
  }

  if (data.deadline && isNaN(new Date(data.deadline).getTime())) {
    throw new Error("Invalid deadline date");
  }

  const updated = await taskRepo.updateTask(taskId, projectId, data);

  if (!updated) {
    throw new Error("Task not found or access denied");
  }

  return {
    id: updated.id,
    title: updated.title,
    description: updated.description ?? undefined,
    done: updated.done,
    deadline: updated.deadline ?? undefined,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
}

export async function deleteTaskForUser(
  taskId: string,
  projectId: string,
  userId: string
): Promise<void> {

  const project = await projectRepo.getProjectByIdForUser(projectId, userId);
  if (!project) {
    throw new Error("Project not found or access denied");
  }

  const deleted = await taskRepo.deleteTask(taskId, projectId);

  if (!deleted) {
    throw new Error("Task not found or access denied");
  }

  return;
}

export async function getTaskForUser(
  taskId: string,
  projectId: string,
  userId: string
): Promise<TaskDTO> {

  const project = await projectRepo.getProjectByIdForUser(projectId, userId);
  if (!project) {
    throw new Error("Project not found or access denied");
  }

  const task = await taskRepo.getTaskById(taskId, projectId);
  if (!task) {
    throw new Error("Task not found");
  }

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

export async function updateTaskDoneForUser(
  taskId: string,
  projectId: string,
  userId: string,
  done: boolean
): Promise<TaskDTO> {

  const project = await projectRepo.getProjectByIdForUser(projectId, userId);
  if (!project) {
    throw new Error("Project not found or access denied");
  }

  const task = await taskRepo.getTaskById(taskId, projectId);
  if (!task) {
    throw new Error("Task not found");
  }

  const updated = await taskRepo.updateTaskDone(taskId, projectId, done);

  if (!updated) {
    throw new Error("Task not found or access denied");
  }

  return {
    id: updated.id,
    title: updated.title,
    description: updated.description ?? undefined,
    done: updated.done,
    deadline: updated.deadline ?? undefined,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
}
