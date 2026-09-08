import ProjectRepository from "../repositories/ProjectRepository";
import { ProjectPayload, ProjectDTO, ProjectPriority, ProjectStatus } from "../types/Project";
import { BadRequestError, NotFoundError } from "../errors/AppError";

const projectRepo = new ProjectRepository();

const VALID_STATUSES: ProjectStatus[] = ["PLANNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD"];

const VALID_PRIORITIES: ProjectPriority[] = ["LOW", "MEDIUM", "HIGH"];

// Mapper → converts a Prisma project object to a ProjectDTO
const toProjectDTO = (project: {
  id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  tags: string[] | null;
  deadline: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): ProjectDTO => ({
  id: project.id,
  title: project.title,
  description: project.description ?? undefined,
  status: project.status,
  priority: project.priority,
  tags: project.tags ?? [],
  deadline: project.deadline ?? undefined,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
});

function assertValidStatus(status?: ProjectStatus) {
  if (status && !VALID_STATUSES.includes(status)) {
    throw new BadRequestError("Invalid status", "invalid-status");
  }
}

function assertValidPriority(priority?: ProjectPriority) {
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    throw new BadRequestError("Invalid priority", "invalid-priority");
  }
}

function parseDeadline(deadline: string | Date): Date {
  const date = new Date(deadline);
  if (isNaN(date.getTime())) {
    throw new BadRequestError("Invalid deadline date", "invalid-deadline");
  }
  return date;
}

export async function createProject(
  userId: string,
  projectData: ProjectPayload,
): Promise<ProjectDTO> {
  // ---- Basic validations ----
  if (!projectData.title || projectData.title.trim().length < 3) {
    throw new BadRequestError("Title must be at least three characters long", "invalid-title");
  }

  assertValidStatus(projectData.status);
  assertValidPriority(projectData.priority);

  // ---- Create safe copy to avoid mutating function parameters ----
  const dataToSave: ProjectPayload = {
    ...projectData,
    title: projectData.title.trim(),
  };

  if (projectData.deadline !== undefined) {
    dataToSave.deadline = parseDeadline(projectData.deadline);
  }

  const project = await projectRepo.createProject({
    project: dataToSave,
    userId,
  });

  return toProjectDTO(project);
}

export async function getProjectsForUser(userId: string): Promise<ProjectDTO[]> {
  const projectsByUser = await projectRepo.getProjectsByUser(userId);
  return projectsByUser.map(toProjectDTO);
}

export async function getProjectForUser(
  projectId: string,
  userId: string,
): Promise<ProjectDTO | null> {
  const project = await projectRepo.getProjectByIdForUser(projectId, userId);

  if (!project) {
    return null;
  }

  return toProjectDTO(project);
}

export async function updateProjectForUser(
  projectId: string,
  userId: string,
  data: Partial<ProjectPayload>,
): Promise<ProjectDTO> {
  if (data.title && data.title.trim().length < 3) {
    throw new BadRequestError("Title must be at least three characters long", "invalid-title");
  }

  assertValidStatus(data.status);
  assertValidPriority(data.priority);

  if (data.deadline !== undefined) {
    data.deadline = parseDeadline(data.deadline);
  }

  const updatedProject = await projectRepo.updateProject(projectId, userId, data);

  if (!updatedProject) {
    throw new NotFoundError(
      "Project not found or you do not have permission to update it",
      "project-not-found",
    );
  }

  return toProjectDTO(updatedProject);
}

export async function deleteProjectForUser(projectId: string, userId: string): Promise<void> {
  const deleted = await projectRepo.deleteProject(projectId, userId);

  if (!deleted) {
    throw new NotFoundError(
      "Project not found or you do not have permission to delete it",
      "project-not-found",
    );
  }
}

export async function getFilteredProjects(
  userId: string,
  query: {
    search?: string;
    status?: ProjectStatus;
    priority?: ProjectPriority;
  },
): Promise<ProjectDTO[]> {
  assertValidStatus(query.status);
  assertValidPriority(query.priority);

  const projects = await projectRepo.getFilteredProjects(userId, query);

  return projects.map(toProjectDTO);
}
