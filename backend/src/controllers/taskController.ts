import { Context } from "koa";
import  {
  createTask,
  getTasksForProject,
  updateTaskForUser,
  deleteTaskForUser,
  getTaskForUser,
  updateTaskDoneForUser
} from "../services/taskService";
import { TaskPayload } from "../types/Task";

export async function createTaskHandler(ctx: Context) {
  const userId = ctx.state.userId; // authMiddleware coloca el userId
  const { projectId } = ctx.params;
  const taskData = ctx.request.body as TaskPayload;

  if (!taskData?.title) {
    ctx.status = 400;
    ctx.body = { error: "Title is required" };
    return;
  }

  if (typeof taskData.title !== "string") {
    ctx.status = 400;
    ctx.body = { error: "Title must be a string" };
    return;
  }

  const cleanTitle = taskData.title.trim();
  if (!cleanTitle) {
    ctx.status = 400;
    ctx.body = { error: "Title cannot be empty" };
    return;
  }

  const cleanDescription =
    typeof taskData.description === "string"
      ? taskData.description.trim()
      : taskData.description;

  let parsedDeadline: Date | undefined;
  if (taskData.deadline !== undefined) {
    const parsed = new Date(taskData.deadline);
    if (isNaN(parsed.getTime())) {
      ctx.status = 400;
      ctx.body = { error: "Invalid deadline date" };
      return;
    }
    parsedDeadline = parsed;
  }

  try {
    const task = await createTask(projectId, userId, {
      ...taskData,
      title: cleanTitle,
      description: cleanDescription,
      deadline: parsedDeadline,
    });

    ctx.status = 201;
    ctx.body = task;
  } catch (err) {
    if (err instanceof Error) {
      ctx.status = 400;
      ctx.body = { error: err.message };
      return;
    }

    ctx.status = 500;
    ctx.body = { error: "internal-error" };
  }
}

export async function getTasksHandler(ctx: Context) {
  const userId = ctx.state.userId;
  const { projectId } = ctx.params;

  try {
    const tasks = await getTasksForProject(projectId, userId);
    ctx.status = 200;
    ctx.body = tasks;
  } catch (err) {
    if (err instanceof Error) {
      ctx.status = 404;
      ctx.body = { error: err.message };
      return;
    }

    ctx.status = 500;
    ctx.body = { error: "internal-error" };
  }
}

export async function getTaskHandler(ctx: Context) {
  const userId = ctx.state.userId;
  const { projectId, taskId } = ctx.params;

  try {
    const task = await getTaskForUser(taskId, projectId, userId);
    ctx.status = 200;
    ctx.body = task;
  } catch (err) {
    if (err instanceof Error) {
      ctx.status = 404;
      ctx.body = { error: err.message };
      return;
    }

    ctx.status = 500;
    ctx.body = { error: "internal-error" };
  }
}

export async function updateTaskHandler(ctx: Context) {
  const userId = ctx.state.userId;
  const { projectId, taskId } = ctx.params;
  const payload = ctx.request.body as Partial<TaskPayload>;

  if (payload.title !== undefined) {
    if (typeof payload.title !== "string") {
      ctx.status = 400;
      ctx.body = { error: "Title must be a string" };
      return;
    }

    const cleanTitle = payload.title.trim();
    if (!cleanTitle) {
      ctx.status = 400;
      ctx.body = { error: "Title cannot be empty" };
      return;
    }

    payload.title = cleanTitle;
  }

  if (payload.description !== undefined && typeof payload.description === "string") {
    payload.description = payload.description.trim();
  }

  if (payload.deadline !== undefined) {
    const parsed = new Date(payload.deadline);
    if (isNaN(parsed.getTime())) {
      ctx.status = 400;
      ctx.body = { error: "Invalid deadline date" };
      return;
    }
    payload.deadline = parsed;
  }

  try {
    const task = await updateTaskForUser(taskId, projectId, userId, payload);
    ctx.status = 200;
    ctx.body = task;
  } catch (err) {
    if (err instanceof Error) {
      ctx.status = 400;
      ctx.body = { error: err.message };
      return;
    }

    ctx.status = 500;
    ctx.body = { error: "internal-error" };
  }
}

export async function deleteTaskHandler(ctx: Context) {
  const userId = ctx.state.userId;
  const { projectId, taskId } = ctx.params;

  try {
    await deleteTaskForUser(taskId, projectId, userId);
    ctx.status = 200;
    ctx.body = { success: true };
  } catch (err) {
    if (err instanceof Error) {
      ctx.status = 400;
      ctx.body = { error: err.message };
      return;
    }

    ctx.status = 500;
    ctx.body = { error: "internal-error" };
  }
}

export async function updateTaskDoneHandler(ctx: Context) {
  const userId = ctx.state.userId;
  const { projectId, taskId } = ctx.params;
  const { done } = ctx.request.body as { done?: unknown };

  if (done === undefined || typeof done !== "boolean") {
    ctx.status = 400;
    ctx.body = { error: "done must be a boolean" };
    return;
  }

  try {
    const task = await updateTaskDoneForUser(taskId, projectId, userId, done);
    ctx.status = 200;
    ctx.body = task;
  } catch (err) {
    if (err instanceof Error) {
      ctx.status = 400;
      ctx.body = { error: err.message };
      return;
    }

    ctx.status = 500;
    ctx.body = { error: "internal-error" };
  }
}
