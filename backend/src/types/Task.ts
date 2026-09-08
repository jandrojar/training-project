export interface TaskPayload {
  title: string;
  description?: string;
  deadline?: string | Date;
}

export interface TaskDTO {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}
