import { Context } from "koa";
import {
  createProject,
  getProjectsForUser,
  getProjectForUser,
  updateProjectForUser,
  deleteProjectForUser,
  getFilteredProjects
} from "../services/projectService";
import { ProjectPayload, ProjectStatus, ProjectPriority } from "../types/Project";

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

export async function updateProjectHandler(ctx: Context) {
  const userId = ctx.state.userId;
  const { id } = ctx.params;

  try {
    const payload = ctx.request.body as Partial<ProjectPayload>;

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

    const updatedProject = await updateProjectForUser(
      id,
      userId,
      payload
    );

    if (!updatedProject) {
      ctx.status = 404;
      ctx.body = { error: "Project not found" };
      return;
    }

    ctx.status = 200;
    ctx.body = updatedProject;
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

export async function deleteProjectHandler(ctx: Context) {
  const userId = ctx.state.userId;
  const { id } = ctx.params;

  try {
    await deleteProjectForUser(id, userId);
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
    if (err instanceof Error) {
      ctx.status = 400;
      ctx.body = { error: err.message };
      return;
    }

    ctx.status = 500;
    ctx.body = { error: "internal-error" };
  }
}
