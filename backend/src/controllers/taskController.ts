import { Context } from "koa";
import {
  createTask,
  getTasksForProject,
  getTaskForUser,
  updateTaskForUser,
  deleteTaskForUser,
  updateTaskDoneForUser,
} from "../services/taskService";
import { TaskPayload } from "../types/Task";
import { BadRequestError } from "../errors/AppError";

export async function createTaskHandler(ctx: Context) {
  const { projectId } = ctx.params;
  const taskData = ctx.request.body as Partial<TaskPayload>;

  if (typeof taskData.title !== "string" || !taskData.title.trim()) {
    throw new BadRequestError("Title is required", "invalid-title");
  }

  const cleanDescription =
    typeof taskData.description === "string" ? taskData.description.trim() : taskData.description;

  const task = await createTask(projectId, ctx.state.userId, {
    ...taskData,
    title: taskData.title.trim(),
    description: cleanDescription,
  });

  ctx.status = 201;
  ctx.body = task;
}

export async function getTasksHandler(ctx: Context) {
  const { projectId } = ctx.params;
  ctx.body = await getTasksForProject(projectId, ctx.state.userId);
}

export async function getTaskHandler(ctx: Context) {
  const { projectId, taskId } = ctx.params;
  ctx.body = await getTaskForUser(taskId, projectId, ctx.state.userId);
}

export async function updateTaskHandler(ctx: Context) {
  const { projectId, taskId } = ctx.params;
  const payload = ctx.request.body as Partial<TaskPayload>;

  if (payload.title !== undefined) {
    if (typeof payload.title !== "string" || !payload.title.trim()) {
      throw new BadRequestError("Title must be a non-empty string", "invalid-title");
    }
    payload.title = payload.title.trim();
  }

  if (payload.description !== undefined && typeof payload.description === "string") {
    payload.description = payload.description.trim();
  }

  ctx.body = await updateTaskForUser(taskId, projectId, ctx.state.userId, payload);
}

export async function deleteTaskHandler(ctx: Context) {
  const { projectId, taskId } = ctx.params;
  await deleteTaskForUser(taskId, projectId, ctx.state.userId);
  ctx.body = { success: true };
}

export async function updateTaskDoneHandler(ctx: Context) {
  const { projectId, taskId } = ctx.params;
  const { done } = ctx.request.body as { done?: unknown };

  if (typeof done !== "boolean") {
    throw new BadRequestError("done must be a boolean", "invalid-done");
  }

  ctx.body = await updateTaskDoneForUser(taskId, projectId, ctx.state.userId, done);
}
