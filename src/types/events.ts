import type { AgentRequest, AgentResponse } from "./agents";

export type DomainEvent =
  | { type: "task.created"; payload: { id: string; userId: string; name: string } }
  | { type: "task.updated"; payload: { id: string; changes: Record<string, unknown> } }
  | { type: "task.deleted"; payload: { id: string } }
  | { type: "project.created"; payload: { id: string; userId: string; name: string } }
  | { type: "meeting.completed"; payload: { id: string; meetingId: string } }
  | { type: "note.created"; payload: { id: string; userId: string; title: string; content: string } }
  | { type: "note.updated"; payload: { id: string; content: string } }
  | { type: "agent.request"; payload: AgentRequest }
  | { type: "agent.response"; payload: AgentResponse };

export type EventType = DomainEvent["type"];

export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void>;
