import { api } from "./api";
import type { ITask, ITaskPayload } from "../types/types";

// Errors are normalized in the axios interceptor.

const normalizePayload = (payload: Partial<ITaskPayload>) => {
  const { deadline, ...rest } = payload;
  return {
    ...rest,
    ...(deadline !== undefined && {
      deadline: deadline instanceof Date ? deadline.toISOString() : deadline,
    }),
  };
};

export async function getTasks(projectId: string): Promise<ITask[]> {
  const response = await api.get(`/projects/${projectId}/tasks`);
  return response.data as ITask[];
}

export async function getTask(projectId: string, taskId: string): Promise<ITask> {
  const response = await api.get(`/projects/${projectId}/tasks/${taskId}`);
  return response.data as ITask;
}

export async function createTask(projectId: string, payload: ITaskPayload): Promise<ITask> {
  const response = await api.post(`/projects/${projectId}/tasks`, normalizePayload(payload));
  return response.data as ITask;
}

export async function updateTask(
  projectId: string,
  taskId: string,
  payload: Partial<ITaskPayload>,
): Promise<ITask> {
  const response = await api.put(
    `/projects/${projectId}/tasks/${taskId}`,
    normalizePayload(payload),
  );
  return response.data as ITask;
}

export async function deleteTask(projectId: string, taskId: string): Promise<void> {
  await api.delete(`/projects/${projectId}/tasks/${taskId}`);
}

export async function updateTaskDone(
  projectId: string,
  taskId: string,
  done: boolean,
): Promise<ITask> {
  const response = await api.patch(`/projects/${projectId}/tasks/${taskId}/done`, { done });
  return response.data as ITask;
}
