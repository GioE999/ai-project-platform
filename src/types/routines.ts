export type RoutineCategory = "MORNING" | "EVENING" | "WORKOUT" | "SKINCARE" | "CUSTOM";
export type RoutineStatus = "COMPLETED" | "PARTIAL" | "SKIPPED";

export interface CreateRoutineInput {
  name: string;
  category: RoutineCategory;
  description?: string;
  daysOfWeek?: number[];
  timeWindow?: string;
}

export interface RoutineStep {
  id: string;
  order: number;
  title: string;
  description?: string;
  estimatedMinutes?: number;
  linkedTaskId?: string;
}

export interface RoutineExecution {
  id: string;
  routineId: string;
  date: string;
  status: RoutineStatus;
  notes?: string;
}

export interface Routine {
  id: string;
  name: string;
  category: RoutineCategory;
  description?: string;
  isActive: boolean;
  daysOfWeek?: number[];
  timeWindow?: string;
  steps: RoutineStep[];
  executions: RoutineExecution[];
  createdAt: string;
}
