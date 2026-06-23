export type AgentType =
  | "root"
  | "task_manager"
  | "project_planner"
  | "conversation"
  | "meeting"
  | "second_brain"
  | "evaluator";

export interface AgentRequest {
  id: string;
  userId: string;
  input: string;
  context: AgentContext;
  targetAgent?: AgentType;
}

export interface AgentContext {
  threadId?: string;
  projectId?: string;
  taskId?: string;
  noteId?: string;
  meetingId?: string;
}

export interface AgentResponse {
  id: string;
  requestId: string;
  agent: AgentType;
  content: string;
  actions: AgentAction[];
  metadata: AgentMetadata;
}

export interface AgentAction {
  type: string;
  payload: Record<string, unknown>;
  result?: unknown;
}

export interface AgentMetadata {
  tokensUsed: number;
  latencyMs: number;
  cost: number;
}

export interface EvaluationCriteria {
  minScore: number;
  checkFactuality: boolean;
  checkRelevance: boolean;
}

export interface EvaluationResult {
  score: number;
  passed: boolean;
  feedback?: string;
}

export type QueuePriority = "high" | "normal" | "low";

export interface QueueStatus {
  requestId: string;
  status: "queued" | "processing" | "completed" | "failed";
  position?: number;
}
