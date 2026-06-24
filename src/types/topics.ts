import type { LifeArea } from "./knowledge";

export interface Topic {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
  icon?: string | null;
  lifeArea?: LifeArea;
  summary?: string | null;
  parentId?: string | null;
  noteCount?: number;
  taskCount?: number;
  meetingCount?: number;
  researchCount?: number;
  projectCount?: number;
  routineCount?: number;
  learningCount?: number;
  checklistCount?: number;
  guideCount?: number;
  journalCount?: number;
  resourceCount?: number;
}

export interface CreateTopicInput {
  name: string;
  color?: string;
  icon?: string;
  lifeArea?: LifeArea;
  summary?: string;
  parentId?: string;
}
