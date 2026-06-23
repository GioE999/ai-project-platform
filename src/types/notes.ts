export interface CreateNoteInput {
  title: string;
  content: string;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
}

export interface NoteFilters {
  search?: string;
  sortBy?: "title" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface WikilinkReference {
  target: string;
  targetNoteId?: string;
  exists: boolean;
}

export interface NoteAST {
  content: string;
  wikilinks: WikilinkNode[];
  metadata: NoteMetadata;
}

export interface WikilinkNode {
  raw: string;
  target: string;
  position: { start: number; end: number };
}

export interface NoteMetadata {
  title: string;
  wordCount: number;
}

export interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: "note" | "task" | "project" | "meeting";
}

export interface GraphEdge {
  source: string;
  target: string;
  type: "wikilink" | "association";
}

export interface Backlink {
  noteId: string;
  noteTitle: string;
  context: string;
}

export interface EntityReference {
  entityType: "task" | "project" | "meeting";
  entityId: string;
}
