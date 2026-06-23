import prisma from "@/lib/db/prisma";
import { eventBus } from "@/lib/events/event-bus";
import { NotFoundError } from "@/lib/errors";
import { markdownParser } from "./markdown-parser";
import type {
  CreateNoteInput,
  UpdateNoteInput,
  NoteFilters,
  WikilinkReference,
  KnowledgeGraph,
  GraphNode,
  GraphEdge,
  Backlink,
  EntityReference,
} from "@/types/notes";

/**
 * NoteService provides CRUD operations for notes, wikilink management,
 * backlink resolution, knowledge graph construction, and entity associations.
 */
export class NoteService {
  /**
   * Create a new note, parse wikilinks, and create NoteLink records.
   * Emits "note.created" event.
   */
  async create(userId: string, data: CreateNoteInput) {
    const note = await prisma.note.create({
      data: {
        title: data.title,
        content: data.content,
        userId,
      },
    });

    await this.updateLinks(note.id, data.content, userId);

    await eventBus.publish({
      type: "note.created",
      payload: { id: note.id, userId, title: note.title, content: note.content },
    });

    return note;
  }

  /**
   * Update note fields. If content changed, recalculate wikilinks.
   * Emits "note.updated" event.
   */
  async update(id: string, userId: string, data: UpdateNoteInput) {
    const existing = await prisma.note.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Note with id "${id}" not found`);
    }
    if (existing.userId !== userId) {
      throw new NotFoundError(`Note with id "${id}" not found`);
    }

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;

    const note = await prisma.note.update({
      where: { id },
      data: updateData,
    });

    // Recalculate wikilinks if content changed
    if (data.content !== undefined) {
      await this.updateLinks(id, data.content, userId);
    }

    await eventBus.publish({
      type: "note.updated",
      payload: { id: note.id, content: note.content },
    });

    return note;
  }

  /**
   * Delete a note by ID. Validates ownership.
   */
  async delete(id: string, userId: string) {
    const existing = await prisma.note.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Note with id "${id}" not found`);
    }
    if (existing.userId !== userId) {
      throw new NotFoundError(`Note with id "${id}" not found`);
    }

    await prisma.note.delete({ where: { id } });
  }

  /**
   * Get a note by ID with outgoing and incoming links.
   * Validates ownership.
   */
  async getById(id: string, userId: string) {
    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        outgoingLinks: true,
        incomingLinks: {
          include: {
            sourceNote: true,
          },
        },
      },
    });

    if (!note) {
      throw new NotFoundError(`Note with id "${id}" not found`);
    }
    if (note.userId !== userId) {
      throw new NotFoundError(`Note with id "${id}" not found`);
    }

    return note;
  }

  /**
   * List notes for a user with optional search and sorting.
   */
  async listByUser(userId: string, filters?: NoteFilters) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { userId };

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { content: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const sortBy = filters?.sortBy ?? "updatedAt";
    const sortOrder = filters?.sortOrder ?? "desc";

    const notes = await prisma.note.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });

    return notes;
  }

  /**
   * Get all notes that link TO this note (backlinks).
   * Returns noteId, noteTitle, and a context snippet.
   */
  async getBacklinks(noteId: string, userId: string): Promise<Backlink[]> {
    const note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note) {
      throw new NotFoundError(`Note with id "${noteId}" not found`);
    }
    if (note.userId !== userId) {
      throw new NotFoundError(`Note with id "${noteId}" not found`);
    }

    const incomingLinks = await prisma.noteLink.findMany({
      where: { targetNoteId: noteId },
      include: { sourceNote: true },
    });

    return incomingLinks.map((link: { sourceNote: { id: string; title: string; content: string }; targetTitle: string }) => {
      // Extract a context snippet around the wikilink in source note's content
      const content = link.sourceNote.content;
      const wikilinkPattern = `[[${link.targetTitle}]]`;
      const index = content.indexOf(wikilinkPattern);
      let context = "";
      if (index >= 0) {
        const start = Math.max(0, index - 40);
        const end = Math.min(content.length, index + wikilinkPattern.length + 40);
        context = content.slice(start, end);
      }

      return {
        noteId: link.sourceNote.id,
        noteTitle: link.sourceNote.title,
        context,
      };
    });
  }

  /**
   * Build a KnowledgeGraph with all user's notes as nodes and NoteLinks as edges.
   */
  async getGraph(userId: string): Promise<KnowledgeGraph> {
    const notes = await prisma.note.findMany({
      where: { userId },
      include: { outgoingLinks: true },
    });

    const nodes: GraphNode[] = notes.map((note: { id: string; title: string }) => ({
      id: note.id,
      label: note.title,
      type: "note" as const,
    }));

    const edges: GraphEdge[] = [];
    for (const note of notes) {
      for (const link of note.outgoingLinks) {
        if (link.targetNoteId) {
          edges.push({
            source: note.id,
            target: link.targetNoteId,
            type: "wikilink",
          });
        }
      }
    }

    return { nodes, edges };
  }

  /**
   * Associate a note with a task, project, or meeting.
   * Creates a NoteEntityLink record.
   */
  async associateWith(noteId: string, userId: string, entity: EntityReference) {
    const note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note) {
      throw new NotFoundError(`Note with id "${noteId}" not found`);
    }
    if (note.userId !== userId) {
      throw new NotFoundError(`Note with id "${noteId}" not found`);
    }

    await prisma.noteEntityLink.create({
      data: {
        noteId,
        entityType: entity.entityType,
        entityId: entity.entityId,
      },
    });
  }

  /**
   * Parse wikilinks from content and sync NoteLink records for a given note.
   * For each wikilink target:
   *   - Check if a note with that title exists for the user
   *   - If yes, set targetNoteId to that note's id, exists=true
   *   - If no, set targetNoteId=null, exists=false
   */
  async updateLinks(noteId: string, content: string, userId?: string): Promise<void> {
    const targets = markdownParser.extractWikilinks(content);

    // Delete existing outgoing links for this note
    await prisma.noteLink.deleteMany({
      where: { sourceNoteId: noteId },
    });

    // For each target, resolve and create new NoteLink records
    for (const target of targets) {
      let targetNoteId: string | null = null;

      if (userId) {
        const existingNote = await prisma.note.findFirst({
          where: { title: target, userId },
        });
        if (existingNote) {
          targetNoteId = existingNote.id;
        }
      }

      await prisma.noteLink.create({
        data: {
          sourceNoteId: noteId,
          targetNoteId,
          targetTitle: target,
        },
      });
    }
  }

  /**
   * Parse wikilinks from content and return references with resolution status.
   */
  parseWikilinks(content: string): WikilinkReference[] {
    const targets = markdownParser.extractWikilinks(content);
    return targets.map((target) => ({
      target,
      exists: false, // Will be resolved when updateLinks is called
    }));
  }
}

/** Singleton instance for use across the application */
export const noteService = new NoteService();
