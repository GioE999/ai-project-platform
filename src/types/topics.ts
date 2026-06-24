export interface Topic {
  id: string;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
  noteCount?: number;
  taskCount?: number;
  meetingCount?: number;
}

export interface CreateTopicInput {
  name: string;
  color?: string;
  icon?: string;
}
