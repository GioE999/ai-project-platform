export interface PostMessageInput {
  content: string;
  authorId: string;
  authorType: "user" | "agent";
  agentType?: string;
}

export interface Mention {
  type: "task" | "project" | "note" | "user";
  id: string;
  displayText: string;
}

export interface Pagination {
  page: number;
  limit: number;
}
