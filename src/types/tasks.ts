export type TaskStatus = "pending" | "in_progress" | "completed" | "blocked" | "review";
export type Priority = "low" | "medium" | "high";

export interface CreateTaskInput {
  name: string;
  description?: string;
  projectId?: string;
  priority?: Priority;
  status?: TaskStatus;
  dueDate?: Date;
  assigneeId?: string;
}

export interface UpdateTaskInput {
  name?: string;
  description?: string;
  projectId?: string | null;
  priority?: Priority;
  status?: TaskStatus;
  dueDate?: Date | null;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: Priority;
  projectId?: string;
  sortBy?: "priority" | "status" | "createdAt" | "dueDate";
  sortOrder?: "asc" | "desc";
}
