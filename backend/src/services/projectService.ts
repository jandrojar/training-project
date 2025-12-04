import ProjectRepository from "../repositories/ProjectRepository";
import { ProjectPayload, ProjectDTO, ProjectPriority, ProjectStatus } from "../types/Project";

const projectRepo = new ProjectRepository();

export async function createProject(userId: string, title: string) {
    if(title.length < 3){
        throw new Error('Title must be at least three characters long');
    }

    const project = await projectRepo.createProject({userId, title});
    return project;
}

export async function getProjectsForUser(userId: string) {
  const projectsByUser = await projectRepo.getProjectsByUser(userId);
  return projectsByUser;
}

export async function getProjectForUser(projectId: string, userId: string) {

  if (!projectId) {
    throw new Error("Project not found");
  }

  const project = await projectRepo.getProjectByIdForUser(projectId, userId);

  return project;
}

export async function updateProjectForUser(projectId: string, userId:string, data: Partial<ProjectPayload>): Promise<ProjectDTO> {
  if (!projectId) {
    throw new Error("Project not found");
  }

  if (data.title && data.title.length < 3) {
    throw new Error("Title must be at least three characters long");
  }

  if (data.deadline !== undefined) {
    const date = new Date(data.deadline);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid deadline date");
    }
  }

  const updatedProject = await projectRepo.updateProject(projectId, userId, data);
  
  if (!updatedProject) {
    throw new Error("Project not found or you do not have permission to update it");
  }

  return {
    id: updatedProject.id,
    title: updatedProject.title,
    description: updatedProject.description ?? undefined,
    status: updatedProject.status,
    priority: updatedProject.priority,
    tags: updatedProject.tags,
    deadline: updatedProject.deadline ?? undefined,
    createdAt: updatedProject.createdAt,
    updatedAt: updatedProject.updatedAt,
  }

}

export async function deleteProjectForUser(projectId: string, userId: string): Promise<void> {
  if (!projectId) {
    throw new Error("Project not found");
  }

  const deleted = await projectRepo.deleteProject(projectId, userId);

  if (!deleted) {
    throw new Error("Project not found or you do not have permission to delete it");
  }

  return;
}

export async function getFilteredProjects(userId: string, query: {
  search?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
}): Promise<ProjectDTO[]> {
  
  if (query.status && !["PLANNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD"].includes(query.status)) {
    throw new Error("Invalid status");
  }

  if (query.priority && !["LOW", "MEDIUM", "HIGH"].includes(query.priority)) {
    throw new Error("Invalid priority");
  }

  const projects = await projectRepo.getFilteredProjects(userId, query);

  return projects.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description ?? undefined,
    status: project.status,
    priority: project.priority,
    tags: project.tags,
    deadline: project.deadline ?? undefined,
    userId: project.userId,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  }));
}
