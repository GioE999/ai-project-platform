export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
}

export interface ProjectProgress {
  total: number;
  completed: number;
  inProgress: number;
  blocked: number;
  percentage: number;
}
