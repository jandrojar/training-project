import { api } from "./api";
import type { IProject, IProjectPayload, ProjectPriority, ProjectStatus } from "../types/types";

const normalizePayload = (payload: Partial<IProjectPayload>) => {
  const { deadline, ...rest } = payload;
  return {
    ...rest,
    ...(deadline !== undefined && {
      deadline:
        deadline instanceof Date
          ? deadline.toISOString()
          : deadline,
    }),
  };
};

export async function getProjects(filters?: {
  search?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
}): Promise<IProject[]>{
    try{
        const response = await api.get('/projects', { params: filters })
        return response.data as IProject[]

    }catch(err: any){
        throw err.response?.data?.error || 'An unknown error ocurred.';
    }
}

export async function getProject(projectId: string): Promise<IProject>{
    try{
        const response = await api.get(`/projects/${projectId}`)
        return response.data as IProject
    }catch(err: any){
        throw err.response?.data?.error || 'An unknown error ocurred.';
    }
}

export async function createProject(payload: IProjectPayload): Promise<IProject>{
    try{
        const response = await api.post('/projects', normalizePayload(payload))
        return response.data as IProject
    }catch(err: any){
        throw err.response?.data?.error || 'An unknown error ocurred.';
    }
}

export async function updateProject(
  projectId: string,
  payload: Partial<IProjectPayload>
): Promise<IProject> {
  try {
    const response = await api.put(
      `/projects/${projectId}`,
      normalizePayload(payload)
    );
    return response.data as IProject;
  } catch (err: any) {
    throw err.response?.data?.error || "An unknown error ocurred.";
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  try {
    await api.delete(`/projects/${projectId}`);
  } catch (err: any) {
    throw err.response?.data?.error || "An unknown error ocurred.";
  }
}
