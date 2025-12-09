import ProjectRepository from "../repositories/ProjectRepository";
import {
  ProjectPayload,
  ProjectDTO,
  ProjectPriority,
  ProjectStatus,
} from "../types/Project";

const projectRepo = new ProjectRepository();

const VALID_STATUSES: ProjectStatus[] = [
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "ON_HOLD",
];

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


export async function createProject(
  userId: string,
  projectData: ProjectPayload
): Promise<ProjectDTO> {
  
  // ---- Basic validations ----
  if (!projectData.title || projectData.title.trim().length < 3) {
    throw new Error("Title must be at least three characters long");
  }

  if (projectData.status && !VALID_STATUSES.includes(projectData.status)) {
    throw new Error("Invalid status");
  }

  if (projectData.priority && !VALID_PRIORITIES.includes(projectData.priority)) {
    throw new Error("Invalid priority");
  }

  // ---- Create safe copy to avoid mutating function parameters ----
  let dataToSave: ProjectPayload = {
    ...projectData,
    title: projectData.title.trim(),
  };

  // ---- Deadline parse ----
  if (projectData.deadline !== undefined) {
    const date = new Date(projectData.deadline);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid deadline date");
    }
    dataToSave.deadline = date;
  }

  const project = await projectRepo.createProject({
    project: dataToSave,
    userId,
  });

  return toProjectDTO(project);
}


export async function getProjectsForUser(
  userId: string
): Promise<ProjectDTO[]> {
  const projectsByUser = await projectRepo.getProjectsByUser(userId);
  return projectsByUser.map(toProjectDTO);
}


export async function getProjectForUser(
  projectId: string,
  userId: string
): Promise<ProjectDTO | null> {
  if (!projectId) {
    throw new Error("Project not found");
  }

  const project = await projectRepo.getProjectByIdForUser(projectId, userId);

  if (!project) {
    return null;
  }

  return toProjectDTO(project);
}


export async function updateProjectForUser(
  projectId: string,
  userId: string,
  data: Partial<ProjectPayload>
): Promise<ProjectDTO> {
  
  if (!projectId) {
    throw new Error("Project not found");
  }

  if (data.title && data.title.trim().length < 3) {
    throw new Error("Title must be at least three characters long");
  }

  if (data.status && !VALID_STATUSES.includes(data.status)) {
    throw new Error("Invalid status");
  }

  if (data.priority && !VALID_PRIORITIES.includes(data.priority)) {
    throw new Error("Invalid priority");
  }

  if (data.deadline !== undefined) {
    const date = new Date(data.deadline);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid deadline date");
    }
    data.deadline = date;
  }

  const updatedProject = await projectRepo.updateProject(projectId, userId, data);

  if (!updatedProject) {
    throw new Error("Project not found or you do not have permission to update it");
  }

  return toProjectDTO(updatedProject);
}


export async function deleteProjectForUser(
  projectId: string,
  userId: string
): Promise<void> {
  if (!projectId) {
    throw new Error("Project not found");
  }

  const deleted = await projectRepo.deleteProject(projectId, userId);

  if (!deleted) {
    throw new Error("Project not found or you do not have permission to delete it");
  }

  return;
}


export async function getFilteredProjects(
  userId: string,
  query: {
    search?: string;
    status?: ProjectStatus;
    priority?: ProjectPriority;
  }
): Promise<ProjectDTO[]> {

  if (query.status && !VALID_STATUSES.includes(query.status)) {
    throw new Error("Invalid status");
  }

  if (query.priority && !VALID_PRIORITIES.includes(query.priority)) {
    throw new Error("Invalid priority");
  }

  const projects = await projectRepo.getFilteredProjects(userId, query);

  return projects.map(toProjectDTO);
}
