import { api } from "./api";
import type { IProject } from "../types/types";

export async function getProjects(): Promise<IProject[]>{
    try{
        const response = await api.get('/projects')
        return response.data as IProject[]

    }catch(err: any){
        throw err.response?.data || 'An unknown error ocurred.';
    }
}

export async function getProject(projectId: string): Promise<IProject>{
    try{
        const response = await api.get(`/projects/${projectId}`)
        return response.data as IProject
    }catch(err: any){
        throw err.response?.data || 'An unknown error ocurred.';
    }
}

export async function createProject(title: string):Promise<IProject>{
    try{
        const response = await api.post('/projects', { title })
        return response.data as IProject
    }catch(err: any){
        throw err.response?.data || 'An unknown error ocurred.';
    }
}