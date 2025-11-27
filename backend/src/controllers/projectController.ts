import { Context } from "koa";
import {
  createProject,
  getProjectsForUser,
  getProjectForUser,
} from "../services/projectService";

export async function createProjectHandler(ctx: Context) {
  const userId = ctx.state.userId; // authMiddleware lo pone
  const { title } = ctx.request.body as { title: string };

  if (!title) {
    ctx.status = 400;
    ctx.body = { error: "Title is required" };
    return;
  }

  const cleanTitle = title.trim();

  if (!cleanTitle) {
    ctx.status = 400;
    ctx.body = { error: "Title cannot be empty" };
    return;
  }

  try {
    const project = await createProject(userId, cleanTitle);
    ctx.status = 201;
    ctx.body = project;
    return;
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

export async function getProjectsHandler(ctx: Context) {
  const userId = ctx.state.userId;

  const projects = await getProjectsForUser(userId);
  ctx.status = 200;
  ctx.body = projects;
}

export async function getProjectHandler(ctx: Context) {
  const userId = ctx.state.userId;
  const { id } = ctx.params;

  try {
    const project = await getProjectForUser(id, userId);

    if (!project) {
      ctx.status = 404;
      ctx.body = { error: "Project not found" };
      return;
    }

    ctx.status = 200;
    ctx.body = project;
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
