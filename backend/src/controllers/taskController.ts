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

/**
 * Create task
 */
export async function createTaskHandler(ctx: Context) {
  const userId = ctx.state.userId;
  const { projectId } = ctx.params;
  const taskData = ctx.request.body as TaskPayload;

  // Controller validation: shape
  if (!taskData?.title) {
    ctx.status = 400;
    ctx.body = { message: "Title is required" };
    return;
  }

  if (typeof taskData.title !== "string") {
    ctx.status = 400;
    ctx.body = { message: "Title must be a string" };
    return;
  }

  const cleanTitle = taskData.title.trim();
  if (!cleanTitle) {
    ctx.status = 400;
    ctx.body = { message: "Title cannot be empty" };
    return;
  }

  const cleanDescription =
    typeof taskData.description === "string" ? taskData.description.trim() : taskData.description;

  try {
    const task = await createTask(projectId, userId, {
      ...taskData,
      title: cleanTitle,
      description: cleanDescription,
    });

    ctx.status = 201;
    ctx.body = task;
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: (err as Error).message };
  }
}

/**
 * Get all tasks for a project
 */
export async function getTasksHandler(ctx: Context) {
  const userId = ctx.state.userId;
  const { projectId } = ctx.params;

  try {
    const tasks = await getTasksForProject(projectId, userId);
    ctx.status = 200;
    ctx.body = tasks;
  } catch (err) {
    ctx.status = 404;
    ctx.body = { message: (err as Error).message };
  }
}

/**
 * Get single task
 */
export async function getTaskHandler(ctx: Context) {
  const userId = ctx.state.userId;
  const { projectId, taskId } = ctx.params;

  try {
    const task = await getTaskForUser(taskId, projectId, userId);
    ctx.status = 200;
    ctx.body = task;
  } catch (err) {
    ctx.status = 404;
    ctx.body = { message: (err as Error).message };
  }
}

/**
 * Update task
 */
export async function updateTaskHandler(ctx: Context) {
  const userId = ctx.state.userId;
  const { projectId, taskId } = ctx.params;
  const payload = ctx.request.body as Partial<TaskPayload>;

  if (payload.title !== undefined) {
    if (typeof payload.title !== "string") {
      ctx.status = 400;
      ctx.body = { message: "Title must be a string" };
      return;
    }

    const clean = payload.title.trim();
    if (!clean) {
      ctx.status = 400;
      ctx.body = { message: "Title cannot be empty" };
      return;
    }

    payload.title = clean;
  }

  if (payload.description !== undefined && typeof payload.description === "string") {
    payload.description = payload.description.trim();
  }

  try {
    const task = await updateTaskForUser(taskId, projectId, userId, payload);
    ctx.status = 200;
    ctx.body = task;
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: (err as Error).message };
  }
}

/**
 * Delete task
 */
export async function deleteTaskHandler(ctx: Context) {
  const userId = ctx.state.userId;
  const { projectId, taskId } = ctx.params;

  try {
    await deleteTaskForUser(taskId, projectId, userId);
    ctx.status = 200;
    ctx.body = { success: true };
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: (err as Error).message };
  }
}

/**
 * Update done
 */
export async function updateTaskDoneHandler(ctx: Context) {
  const userId = ctx.state.userId;
  const { projectId, taskId } = ctx.params;
  const { done } = ctx.request.body as { done?: unknown };

  if (typeof done !== "boolean") {
    ctx.status = 400;
    ctx.body = { message: "done must be a boolean" };
    return;
  }

  try {
    const task = await updateTaskDoneForUser(taskId, projectId, userId, done);
    ctx.status = 200;
    ctx.body = task;
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: (err as Error).message };
  }
}
