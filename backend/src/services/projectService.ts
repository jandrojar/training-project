import ProjectRepository from "../repositories/ProjectRepository";

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