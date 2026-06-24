import { NextRequest, NextResponse } from "next/server";
import { knowledgeService } from "@/lib/services/knowledge.service";
import type { KnowledgeNoteType } from "@/types/knowledge";

const TEMP_USER_ID = "user_demo";

/**
 * POST /api/knowledge/from-entity
 * Creates a KnowledgeNote from any platform entity (task, project, meeting, routine).
 *
 * Body:
 * - entityType: "task" | "project" | "meeting" | "routine"
 * - entityId: string
 * - title: string
 * - content: string
 * - topicId?: string
 * - noteType?: KnowledgeNoteType (defaults based on entityType)
 * - tags?: string[]
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { entityType, entityId, title, content, topicId, noteType, tags } = body;

  if (!entityType || !title || !content) {
    return NextResponse.json({ error: "entityType, title, and content are required" }, { status: 400 });
  }

  // Map entity types to default KnowledgeNote types
  const typeMap: Record<string, KnowledgeNoteType> = {
    task: "ACTION_ITEM",
    project: "NOTE",
    meeting: "MEETING_NOTE",
    routine: "ROUTINE_NOTE",
  };

  const note = await knowledgeService.createNote(TEMP_USER_ID, {
    title,
    content,
    type: noteType || typeMap[entityType] || "BRAIN_NOTE",
    status: "COMPLETED",
    topicId: topicId || undefined,
    tags: tags || [entityType, entityId],
    metadata: { sourceEntityType: entityType, sourceEntityId: entityId },
  });

  return NextResponse.json(note, { status: 201 });
}
