import prisma from "@/lib/db/prisma";
import { markdownParser } from "./markdown-parser";
import type {
  CreateKnowledgeNoteInput,
  KnowledgeNoteType,
  KnowledgeNoteStatus,
  EdgeRelationType,
  TopicEcosystem,
  TopicWithCounts,
} from "@/types/knowledge";

export class KnowledgeService {
  async createNote(userId: string, data: CreateKnowledgeNoteInput) {
    const note = await (prisma as any).knowledgeNote.create({
      data: {
        title: data.title,
        content: data.content,
        type: data.type,
        status: data.status || "DRAFT",
        topicId: data.topicId || null,
        tags: data.tags || [],
        metadata: data.metadata || {},
        userId,
      },
      include: { topic: true },
    });

    await this.syncEdgesFromContent(note.id, data.content, userId);
    return note;
  }

  async updateNote(id: string, userId: string, data: Partial<CreateKnowledgeNoteInput>) {
    const note = await (prisma as any).knowledgeNote.update({
      where: { id, userId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        ...(data.type && { type: data.type }),
        ...(data.status && { status: data.status }),
        ...(data.topicId !== undefined && { topicId: data.topicId || null }),
        ...(data.tags && { tags: data.tags }),
        ...(data.metadata && { metadata: data.metadata }),
      },
      include: { topic: true },
    });

    if (data.content) {
      await this.syncEdgesFromContent(id, data.content, userId);
    }
    return note;
  }

  async deleteNote(id: string, userId: string) {
    await (prisma as any).knowledgeNote.delete({ where: { id, userId } });
  }

  async getNoteById(id: string, userId: string) {
    return (prisma as any).knowledgeNote.findUnique({
      where: { id, userId },
      include: {
        topic: true,
        edgesFrom: { include: { to: true } },
        edgesTo: { include: { from: true } },
      },
    });
  }

  async listByUser(userId: string, filters?: { type?: KnowledgeNoteType; topicId?: string; status?: KnowledgeNoteStatus; search?: string }) {
    const where: any = { userId };
    if (filters?.type) where.type = filters.type;
    if (filters?.topicId) where.topicId = filters.topicId;
    if (filters?.status) where.status = filters.status;
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { content: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return (prisma as any).knowledgeNote.findMany({
      where,
      include: { topic: true },
      orderBy: { updatedAt: "desc" },
    });
  }

  async createEdge(fromId: string, toId: string, relationType: EdgeRelationType) {
    return (prisma as any).knowledgeEdge.upsert({
      where: { fromId_toId_relationType: { fromId, toId, relationType } },
      update: {},
      create: { fromId, toId, relationType },
    });
  }

  async getBacklinks(noteId: string) {
    return (prisma as any).knowledgeEdge.findMany({
      where: { toId: noteId },
      include: { from: true },
    });
  }

  /** Save a research as a KnowledgeNote and create DERIVED_FROM edge */
  async saveResearchAsNote(userId: string, opts: {
    researchTitle: string;
    content: string;
    overview: string;
    topicId?: string;
    tags?: string[];
    learnings?: string[];
    saveOption: "note" | "draft" | "publish";
    sourceResearchNoteId?: string;
  }) {
    const typeMap: Record<string, KnowledgeNoteType> = {
      note: "RESEARCH",
      draft: "RESEARCH_DRAFT",
      publish: "RESEARCH",
    };
    const statusMap: Record<string, KnowledgeNoteStatus> = {
      note: "COMPLETED",
      draft: "DRAFT",
      publish: "PUBLISHED",
    };

    const note = await this.createNote(userId, {
      title: opts.researchTitle,
      content: opts.content,
      type: typeMap[opts.saveOption],
      status: statusMap[opts.saveOption],
      topicId: opts.topicId,
      tags: opts.tags || [],
      metadata: { overview: opts.overview, learnings: opts.learnings || [] },
    });

    if (opts.sourceResearchNoteId) {
      await this.createEdge(note.id, opts.sourceResearchNoteId, "DERIVED_FROM");
    }

    return note;
  }

  /** Get full topic ecosystem with all related entities */
  async getTopicEcosystem(topicId: string, userId: string): Promise<TopicEcosystem> {
    const [topic, knowledgeNotes, tasks, meetings, routines] = await Promise.all([
      (prisma as any).topic.findUnique({ where: { id: topicId } }),
      (prisma as any).knowledgeNote.findMany({
        where: { topicId, userId },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.task.findMany({
        where: { userId, topics: { some: { topicId } } },
        select: { id: true, name: true, status: true, priority: true },
      }),
      prisma.meeting.findMany({
        where: { organizerId: userId, topics: { some: { topicId } } },
        select: { id: true, title: true, scheduledAt: true, status: true },
        orderBy: { scheduledAt: "desc" },
      }),
      (prisma as any).routine.findMany({
        where: { userId, topics: { some: { topicId } } },
        select: { id: true, name: true, category: true, isActive: true },
      }),
    ]);

    // Get projects linked via tasks with this topic
    const taskWithProjects = await prisma.task.findMany({
      where: { userId, topics: { some: { topicId } }, projectId: { not: null } },
      select: { projectId: true },
      distinct: ["projectId"],
    });
    const projectIds = taskWithProjects.map((p: any) => p.projectId).filter(Boolean);
    const projects = projectIds.length > 0
      ? await prisma.project.findMany({
          where: { id: { in: projectIds } },
          select: { id: true, name: true, description: true },
        })
      : [];

    const researches = (knowledgeNotes || []).filter((n: any) => n.type === "RESEARCH" || n.type === "RESEARCH_DRAFT");
    const notes = (knowledgeNotes || []).filter((n: any) => n.type === "NOTE" || n.type === "IDEA");
    const learnings = (knowledgeNotes || []).filter((n: any) => n.type === "LEARNING");
    const checklists = (knowledgeNotes || []).filter((n: any) => n.type === "CHECKLIST");
    const guides = (knowledgeNotes || []).filter((n: any) => n.type === "GUIDE");
    const journals = (knowledgeNotes || []).filter((n: any) => n.type === "JOURNAL" || n.type === "GARDEN_LOG");
    const recipes = (knowledgeNotes || []).filter((n: any) => n.type === "RECIPE");
    const resources = (knowledgeNotes || []).filter((n: any) => n.type === "RESOURCE" || n.type === "TRAVEL_TEMPLATE");

    const topicWithCounts: TopicWithCounts = {
      id: topic.id,
      name: topic.name,
      slug: topic.slug,
      color: topic.color,
      icon: topic.icon,
      lifeArea: topic.lifeArea,
      summary: topic.summary,
      createdAt: topic.createdAt.toISOString(),
      researchCount: researches.length,
      projectCount: projects.length,
      routineCount: (routines || []).length,
      taskCount: tasks.length,
      meetingCount: meetings.length,
      noteCount: notes.length,
      learningCount: learnings.length,
      checklistCount: checklists.length,
      guideCount: guides.length,
      journalCount: journals.length,
      resourceCount: resources.length,
    };

    return {
      topic: topicWithCounts,
      researches,
      notes,
      checklists,
      guides,
      journals,
      recipes,
      resources,
      tasks,
      projects: projects.map((p: any) => ({ id: p.id, name: p.name, description: p.description || undefined })),
      routines: routines || [],
      meetings: meetings.map((m: any) => ({ ...m, scheduledAt: m.scheduledAt.toISOString() })),
      learnings,
    };
  }

  /** Get all topics with counts for the grid */
  async getTopicsWithCounts(userId: string): Promise<TopicWithCounts[]> {
    const topics = await (prisma as any).topic.findMany({
      include: {
        _count: {
          select: {
            notes: true,
            tasks: true,
            meetings: true,
            knowledgeNotes: true,
            routines: true,
          },
        },
        knowledgeNotes: {
          where: { userId },
          select: { type: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return (topics || []).map((t: any) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      color: t.color,
      icon: t.icon,
      lifeArea: t.lifeArea,
      createdAt: t.createdAt.toISOString(),
      researchCount: (t.knowledgeNotes || []).filter((n: any) => n.type === "RESEARCH" || n.type === "RESEARCH_DRAFT").length,
      projectCount: 0,
      routineCount: t._count?.routines || 0,
      taskCount: t._count?.tasks || 0,
      meetingCount: t._count?.meetings || 0,
      noteCount: (t.knowledgeNotes || []).filter((n: any) => n.type === "NOTE" || n.type === "IDEA").length,
      learningCount: (t.knowledgeNotes || []).filter((n: any) => n.type === "LEARNING").length,
      checklistCount: (t.knowledgeNotes || []).filter((n: any) => n.type === "CHECKLIST").length,
      guideCount: (t.knowledgeNotes || []).filter((n: any) => n.type === "GUIDE").length,
      journalCount: (t.knowledgeNotes || []).filter((n: any) => n.type === "JOURNAL" || n.type === "GARDEN_LOG").length,
      resourceCount: (t.knowledgeNotes || []).filter((n: any) => n.type === "RESOURCE" || n.type === "TRAVEL_TEMPLATE").length,
    }));
  }

  /** Build knowledge graph from edges */
  async getKnowledgeGraph(userId: string, topicId?: string) {
    const where: any = { userId };
    if (topicId) where.topicId = topicId;

    const notes = await (prisma as any).knowledgeNote.findMany({
      where,
      include: { edgesFrom: true, edgesTo: true },
    });

    const nodeColors: Record<string, string> = {
      BRAIN_NOTE: "#6366f1",
      RESEARCH: "#10b981",
      RESEARCH_DRAFT: "#86efac",
      MEETING_NOTE: "#ef4444",
      IDEA: "#f59e0b",
      ROUTINE_NOTE: "#8b5cf6",
      ACTION_ITEM: "#06b6d4",
      LEARNING: "#ec4899",
    };

    const nodes = (notes || []).map((n: any) => ({
      id: n.id,
      label: n.title,
      type: n.type,
      color: nodeColors[n.type] || "#6366f1",
    }));

    const edgeSet = new Set<string>();
    const edges: { source: string; target: string; type: string }[] = [];
    for (const note of notes || []) {
      for (const edge of note.edgesFrom || []) {
        const key = `${edge.fromId}-${edge.toId}`;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push({ source: edge.fromId, target: edge.toId, type: edge.relationType });
        }
      }
    }

    return { nodes, edges };
  }

  /** Parse wikilinks from content and create REFERENCES edges */
  private async syncEdgesFromContent(noteId: string, content: string, userId: string) {
    const targets = markdownParser.extractWikilinks(content);
    await (prisma as any).knowledgeEdge.deleteMany({
      where: { fromId: noteId, relationType: "REFERENCES" },
    });

    for (const target of targets) {
      const targetNote = await (prisma as any).knowledgeNote.findFirst({
        where: { title: { equals: target, mode: "insensitive" }, userId },
      });
      if (targetNote) {
        await this.createEdge(noteId, targetNote.id, "REFERENCES");
      }
    }
  }
}

export const knowledgeService = new KnowledgeService();
