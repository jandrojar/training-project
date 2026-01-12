import { Context } from "koa";
import {
  createProject,
  getProjectsForUser,
  getProjectForUser,
  updateProjectForUser,
  deleteProjectForUser,
  getFilteredProjects,
} from "../services/projectService";

import {
  ProjectPayload,
  ProjectStatus,
  ProjectPriority,
} from "../types/Project";


export async function createProjectHandler(ctx: Context) {
  const userId = ctx.state.userId;
  const body = ctx.request.body as Partial<ProjectPayload>;

  if (!body.title) {
    ctx.status = 400;
    ctx.body = { message: "Title is required" };
    return;
  }

  if (typeof body.title !== "string") {
    ctx.status = 400;
    ctx.body = { message: "Title must be a string" };
    return;
  }

  const cleanTitle = body.title.trim();
  if (!cleanTitle) {
    ctx.status = 400;
    ctx.body = { message: "Title cannot be empty" };
    return;
  }

  if (body.tags !== undefined && !Array.isArray(body.tags)) {
    ctx.status = 400;
    ctx.body = { message: "Tags must be an array" };
    return;
  }

  const cleanDescription =
    typeof body.description === "string"
      ? body.description.trim()
      : body.description;

  try {
    const project = await createProject(userId, {
      ...body,
      title: cleanTitle,
      description: cleanDescription,
    });

    ctx.status = 201;
    ctx.body = project;
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: (err as Error).message };
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
      ctx.body = { message: "Project not found" };
      return;
    }

    ctx.status = 200;
    ctx.body = project;
  } catch (err) {
    ctx.status = 404;
    ctx.body = { message: (err as Error).message };
  }
}


export async function updateProjectHandler(ctx: Context) {
  const userId = ctx.state.userId;
  const { id } = ctx.params;

  const payload = ctx.request.body as Partial<ProjectPayload>;

  if (payload.title !== undefined) {
    if (typeof payload.title !== "string") {
      ctx.status = 400;
      ctx.body = { message: "Title must be a string" };
      return;
    }

    const cleanTitle = payload.title.trim();
    if (!cleanTitle) {
      ctx.status = 400;
      ctx.body = { message: "Title cannot be empty" };
      return;
    }

    payload.title = cleanTitle;
  }

  if (payload.description !== undefined && typeof payload.description === "string") {
    payload.description = payload.description.trim();
  }

  if (payload.tags !== undefined && !Array.isArray(payload.tags)) {
    ctx.status = 400;
    ctx.body = { message: "Tags must be an array" };
    return;
  }

  try {
    const updated = await updateProjectForUser(id, userId, payload);

    ctx.status = 200;
    ctx.body = updated;
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: (err as Error).message };
  }
}

export async function deleteProjectHandler(ctx: Context) {
  const userId = ctx.state.userId;
  const { id } = ctx.params;

  try {
    await deleteProjectForUser(id, userId);
    ctx.status = 200;
    ctx.body = { success: true };
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: (err as Error).message };
  }
}



export async function getFilteredProjectsHandler(ctx: Context) {
  const userId = ctx.state.userId;
  const { search, status, priority } = ctx.query;

  try {
    const projects = await getFilteredProjects(userId, {
      search: search as string,
      status: status as ProjectStatus,
      priority: priority as ProjectPriority,
    });

    ctx.status = 200;
    ctx.body = projects;
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: (err as Error).message };
  }
}
