export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserRegister{
    name:string,
    lastname?:string,
    age?:number,
    email:string,
    password:string
}

export interface IAuthResponse {
    sessionId:string,
    expiresAt: string,
    userId: string
}

export interface IUserRegisterResponse{
    id: string,
    name:string,
    lastname?:string,
    age?:number,
    email:string
}

export type ProjectStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD'
export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface IProjectPayload {
  title: string
  description?: string
  status?: ProjectStatus
  priority?: ProjectPriority
  tags?: string[]
  deadline?: string | Date
}

export interface IProject {
  id: string
  title: string
  description?: string
  status: ProjectStatus
  priority: ProjectPriority
  tags: string[]
  deadline?: string | null
  createdAt: string
  updatedAt: string
}
