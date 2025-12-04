import ProjectRepository from "../repositories/ProjectRepository";
import { ProjectPayload, ProjectDTO } from "../types/Project";

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