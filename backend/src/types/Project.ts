// Single source for the project enums on the TS side (mirrors the Prisma enums
// in schema.prisma). Derive the union types and the runtime lists from these.
export const PROJECT_STATUSES = ["PLANNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;
export type ProjectPriority = (typeof PROJECT_PRIORITIES)[number];

export interface ProjectPayload {
  title: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  tags?: string[];
  deadline?: string | Date;
}

export interface ProjectDTO {
  id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  tags: string[];
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}
