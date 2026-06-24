export type KnowledgeNoteType =
  | "NOTE"
  | "RESEARCH"
  | "RESEARCH_DRAFT"
  | "CHECKLIST"
  | "GUIDE"
  | "JOURNAL"
  | "RESOURCE"
  | "RECIPE"
  | "TRAVEL_TEMPLATE"
  | "GARDEN_LOG"
  | "LEARNING"
  | "CULTURAL_NOTE"
  | "MEETING_NOTE"
  | "IDEA"
  | "ROUTINE_NOTE"
  | "ACTION_ITEM";

export type KnowledgeNoteStatus = "DRAFT" | "ACTIVE" | "COMPLETED" | "PUBLISHED" | "ARCHIVED";

export type EdgeRelationType =
  | "REFERENCES"
  | "DERIVED_FROM"
  | "RELATED_TO"
  | "SUPPORTS"
  | "CONTRADICTS"
  | "BELONGS_TO_TOPIC"
  | "GENERATED_FROM"
  | "APPLIES_TO"
  | "REQUIRES"
  | "INSPIRED_BY";

export type LifeArea =
  | "SCIENTIFIC"
  | "TECH"
  | "CULTURAL"
  | "PERSONAL"
  | "PHILOSOPHICAL"
  | "ECONOMIC";

export interface KnowledgeNote {
  id: string;
  title: string;
  content: string;
  excerpt?: string | null;
  type: KnowledgeNoteType;
  status: KnowledgeNoteStatus;
  topicId: string | null;
  tags: string[];
  metadata?: Record<string, unknown>;
  priority?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  topic?: TopicWithCounts | null;
  edgesFrom?: KnowledgeEdge[];
  edgesTo?: KnowledgeEdge[];
  sources?: ResearchSource[];
}

export interface ResearchSource {
  id: string;
  knowledgeNoteId: string;
  title: string;
  url: string;
  excerpt?: string | null;
}

export interface KnowledgeEdge {
  id: string;
  fromId: string;
  toId: string;
  relationType: EdgeRelationType;
  createdAt: string;
  from?: KnowledgeNote;
  to?: KnowledgeNote;
}

export interface TopicWithCounts {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
  icon?: string | null;
  lifeArea: LifeArea;
  summary?: string | null;
  parentId?: string | null;
  createdAt: string;
  // Computed counts
  researchCount: number;
  projectCount: number;
  routineCount: number;
  taskCount: number;
  meetingCount: number;
  noteCount: number;
  learningCount: number;
  checklistCount: number;
  guideCount: number;
  journalCount: number;
  resourceCount: number;
}

export interface TopicEcosystem {
  topic: TopicWithCounts;
  researches: KnowledgeNote[];
  notes: KnowledgeNote[];
  checklists: KnowledgeNote[];
  guides: KnowledgeNote[];
  journals: KnowledgeNote[];
  recipes: KnowledgeNote[];
  resources: KnowledgeNote[];
  tasks: { id: string; name: string; status: string; priority: string }[];
  projects: { id: string; name: string; description?: string }[];
  routines: { id: string; name: string; category: string; isActive: boolean }[];
  meetings: { id: string; title: string; scheduledAt: string; status: string }[];
  learnings: KnowledgeNote[];
}

export interface CreateKnowledgeNoteInput {
  title: string;
  content: string;
  type: KnowledgeNoteType;
  status?: KnowledgeNoteStatus;
  topicId?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  excerpt?: string;
  priority?: string;
}

// Labels for UI display
export const knowledgeTypeLabels: Record<KnowledgeNoteType, string> = {
  NOTE: "Nota",
  RESEARCH: "Investigación",
  RESEARCH_DRAFT: "Borrador investigación",
  CHECKLIST: "Checklist",
  GUIDE: "Guía",
  JOURNAL: "Bitácora",
  RESOURCE: "Recurso",
  RECIPE: "Receta",
  TRAVEL_TEMPLATE: "Plantilla viaje",
  GARDEN_LOG: "Registro jardín",
  LEARNING: "Aprendizaje",
  CULTURAL_NOTE: "Nota cultural",
  MEETING_NOTE: "Nota reunión",
  IDEA: "Idea",
  ROUTINE_NOTE: "Nota rutina",
  ACTION_ITEM: "Acción",
};

export const knowledgeTypeIcons: Record<KnowledgeNoteType, string> = {
  NOTE: "📝",
  RESEARCH: "🔬",
  RESEARCH_DRAFT: "📋",
  CHECKLIST: "✅",
  GUIDE: "📖",
  JOURNAL: "📓",
  RESOURCE: "🔗",
  RECIPE: "🍳",
  TRAVEL_TEMPLATE: "✈️",
  GARDEN_LOG: "🌱",
  LEARNING: "💡",
  CULTURAL_NOTE: "🎭",
  MEETING_NOTE: "📋",
  IDEA: "💭",
  ROUTINE_NOTE: "🔄",
  ACTION_ITEM: "⚡",
};

export const lifeAreaLabels: Record<LifeArea, string> = {
  SCIENTIFIC: "Científico",
  TECH: "Tecnología",
  CULTURAL: "Cultural",
  PERSONAL: "Personal",
  PHILOSOPHICAL: "Filosófico",
  ECONOMIC: "Económico",
};
