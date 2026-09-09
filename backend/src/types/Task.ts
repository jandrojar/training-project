export interface TaskPayload {
  title: string;
  description?: string;
  // `null` / "" from the client means "clear the deadline"
  deadline?: string | Date | null;
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
