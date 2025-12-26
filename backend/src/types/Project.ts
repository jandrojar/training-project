export type ProjectStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD'

export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface ProjectPayload {
  title: string
  description?: string
  status?: ProjectStatus
  priority?: ProjectPriority
  tags?: string[]
  deadline?: string | Date
}

export interface ProjectDTO {
  id: string
  title: string
  description?: string
  status: ProjectStatus
  priority: ProjectPriority
  tags: string[]
  deadline?: Date
  createdAt: Date
  updatedAt: Date
}
