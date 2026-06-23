export interface CreateMeetingInput {
  title: string;
  description?: string;
  scheduledAt: Date;
  duration: number;
  taskId?: string;
  projectId?: string;
  attendees: string[];
}

export interface MeetingSummary {
  overview: string;
  decisions: string[];
  actionItems: ActionItem[];
}

export interface ActionItem {
  description: string;
  assigneeId?: string;
  dueDate?: Date;
}
