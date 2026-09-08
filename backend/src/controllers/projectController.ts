import { Context } from "koa";
import {
  createProject,
  getProjectForUser,
  updateProjectForUser,
  deleteProjectForUser,
  getFilteredProjects,
} from "../services/projectService";

import { ProjectPayload, ProjectStatus, ProjectPriority } from "../types/Project";
import { BadRequestError, NotFoundError } from "../errors/AppError";

export async function createProjectHandler(ctx: Context) {
  const userId = ctx.state.userId;
  const body = ctx.request.body as Partial<ProjectPayload>;

  if (typeof body.title !== "string" || !body.title.trim()) {
    throw new BadRequestError("Title is required", "invalid-title");
  }

  if (body.tags !== undefined && !Array.isArray(body.tags)) {
    throw new BadRequestError("Tags must be an array", "invalid-tags");
  }

  const cleanDescription =
    typeof body.description === "string" ? body.description.trim() : body.description;

  const project = await createProject(userId, {
    ...body,
    title: body.title.trim(),
    description: cleanDescription,
  });

  ctx.status = 201;
  ctx.body = project;
}

export async function getProjectHandler(ctx: Context) {
  const project = await getProjectForUser(ctx.params.id, ctx.state.userId);

  if (!project) {
    throw new NotFoundError("Project not found", "project-not-found");
  }

  ctx.body = project;
}

export async function updateProjectHandler(ctx: Context) {
  const { id } = ctx.params;
  const payload = ctx.request.body as Partial<ProjectPayload>;

  if (payload.title !== undefined) {
    if (typeof payload.title !== "string" || !payload.title.trim()) {
      throw new BadRequestError("Title must be a non-empty string", "invalid-title");
    }
    payload.title = payload.title.trim();
  }

  if (payload.description !== undefined && typeof payload.description === "string") {
    payload.description = payload.description.trim();
  }

  if (payload.tags !== undefined && !Array.isArray(payload.tags)) {
    throw new BadRequestError("Tags must be an array", "invalid-tags");
  }

  ctx.body = await updateProjectForUser(id, ctx.state.userId, payload);
}

export async function deleteProjectHandler(ctx: Context) {
  await deleteProjectForUser(ctx.params.id, ctx.state.userId);
  ctx.body = { success: true };
}

export async function getFilteredProjectsHandler(ctx: Context) {
  const { search, status, priority } = ctx.query;

  ctx.body = await getFilteredProjects(ctx.state.userId, {
    search: search as string,
    status: status as ProjectStatus,
    priority: priority as ProjectPriority,
  });
}
