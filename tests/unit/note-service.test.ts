import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock Prisma before importing the service
vi.mock("@/lib/db/prisma", () => ({
  default: {
    note: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    noteLink: {
      create: vi.fn(),
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    noteEntityLink: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/events/event-bus", () => ({
  eventBus: {
    publish: vi.fn().mockResolvedValue(undefined),
  },
}));

import { NoteService } from "@/lib/services/note.service";
import prisma from "@/lib/db/prisma";
import { eventBus } from "@/lib/events/event-bus";
import { NotFoundError } from "@/lib/errors";

describe("NoteService", () => {
  let service: NoteService;

  beforeEach(() => {
    service = new NoteService();
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("should store note and create NoteLink records", async () => {
      const mockNote = {
        id: "note-1",
        title: "My Note",
        content: "This links to [[concept A]] and [[concept B]]",
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.note.create).mockResolvedValue(mockNote as never);
      vi.mocked(prisma.noteLink.deleteMany).mockResolvedValue({ count: 0 } as never);
      vi.mocked(prisma.note.findFirst).mockResolvedValue(null as never);
      vi.mocked(prisma.noteLink.create).mockResolvedValue({} as never);

      const result = await service.create("user-1", {
        title: "My Note",
        content: "This links to [[concept A]] and [[concept B]]",
      });

      expect(result.id).toBe("note-1");
      expect(prisma.note.create).toHaveBeenCalledWith({
        data: {
          title: "My Note",
          content: "This links to [[concept A]] and [[concept B]]",
          userId: "user-1",
        },
      });

      // Should have deleted old links and created new ones
      expect(prisma.noteLink.deleteMany).toHaveBeenCalledWith({
        where: { sourceNoteId: "note-1" },
      });

      // Two wikilinks -> two NoteLink records
      expect(prisma.noteLink.create).toHaveBeenCalledTimes(2);
      expect(prisma.noteLink.create).toHaveBeenCalledWith({
        data: {
          sourceNoteId: "note-1",
          targetNoteId: null,
          targetTitle: "concept A",
        },
      });
      expect(prisma.noteLink.create).toHaveBeenCalledWith({
        data: {
          sourceNoteId: "note-1",
          targetNoteId: null,
          targetTitle: "concept B",
        },
      });

      // Should emit event
      expect(eventBus.publish).toHaveBeenCalledWith({
        type: "note.created",
        payload: { id: "note-1", userId: "user-1", title: "My Note", content: "This links to [[concept A]] and [[concept B]]" },
      });
    });

    it("should resolve targetNoteId when target note exists", async () => {
      const mockNote = {
        id: "note-2",
        title: "Linking Note",
        content: "See [[Existing Note]]",
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.note.create).mockResolvedValue(mockNote as never);
      vi.mocked(prisma.noteLink.deleteMany).mockResolvedValue({ count: 0 } as never);
      vi.mocked(prisma.note.findFirst).mockResolvedValue({
        id: "existing-note-id",
        title: "Existing Note",
        userId: "user-1",
      } as never);
      vi.mocked(prisma.noteLink.create).mockResolvedValue({} as never);

      await service.create("user-1", {
        title: "Linking Note",
        content: "See [[Existing Note]]",
      });

      expect(prisma.noteLink.create).toHaveBeenCalledWith({
        data: {
          sourceNoteId: "note-2",
          targetNoteId: "existing-note-id",
          targetTitle: "Existing Note",
        },
      });
    });
  });

  describe("update", () => {
    it("should recalculate wikilinks when content changes", async () => {
      const existing = {
        id: "note-1",
        title: "Note",
        content: "Old [[link]]",
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.note.findUnique).mockResolvedValue(existing as never);
      vi.mocked(prisma.note.update).mockResolvedValue({
        ...existing,
        content: "New [[different link]]",
      } as never);
      vi.mocked(prisma.noteLink.deleteMany).mockResolvedValue({ count: 1 } as never);
      vi.mocked(prisma.note.findFirst).mockResolvedValue(null as never);
      vi.mocked(prisma.noteLink.create).mockResolvedValue({} as never);

      await service.update("note-1", "user-1", {
        content: "New [[different link]]",
      });

      // Old links should be deleted
      expect(prisma.noteLink.deleteMany).toHaveBeenCalledWith({
        where: { sourceNoteId: "note-1" },
      });

      // New link should be created
      expect(prisma.noteLink.create).toHaveBeenCalledWith({
        data: {
          sourceNoteId: "note-1",
          targetNoteId: null,
          targetTitle: "different link",
        },
      });

      expect(eventBus.publish).toHaveBeenCalledWith({
        type: "note.updated",
        payload: { id: "note-1", content: "New [[different link]]" },
      });
    });

    it("should throw NotFoundError if note does not exist", async () => {
      vi.mocked(prisma.note.findUnique).mockResolvedValue(null);

      await expect(
        service.update("note-1", "user-1", { title: "Updated" })
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError if user does not own note", async () => {
      vi.mocked(prisma.note.findUnique).mockResolvedValue({
        id: "note-1",
        userId: "other-user",
      } as never);

      await expect(
        service.update("note-1", "user-1", { title: "Updated" })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("getBacklinks", () => {
    it("should return linking notes with context", async () => {
      vi.mocked(prisma.note.findUnique).mockResolvedValue({
        id: "note-target",
        userId: "user-1",
      } as never);

      vi.mocked(prisma.noteLink.findMany).mockResolvedValue([
        {
          id: "link-1",
          sourceNoteId: "note-source",
          targetNoteId: "note-target",
          targetTitle: "Target Note",
          sourceNote: {
            id: "note-source",
            title: "Source Note",
            content: "This references [[Target Note]] for context.",
          },
        },
      ] as never);

      const backlinks = await service.getBacklinks("note-target", "user-1");

      expect(backlinks).toHaveLength(1);
      expect(backlinks[0].noteId).toBe("note-source");
      expect(backlinks[0].noteTitle).toBe("Source Note");
      expect(backlinks[0].context).toContain("[[Target Note]]");
    });

    it("should throw NotFoundError if note does not exist", async () => {
      vi.mocked(prisma.note.findUnique).mockResolvedValue(null);

      await expect(
        service.getBacklinks("note-1", "user-1")
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("getGraph", () => {
    it("should return correct nodes and edges", async () => {
      vi.mocked(prisma.note.findMany).mockResolvedValue([
        {
          id: "note-1",
          title: "Note A",
          userId: "user-1",
          outgoingLinks: [
            { id: "link-1", sourceNoteId: "note-1", targetNoteId: "note-2", targetTitle: "Note B" },
          ],
        },
        {
          id: "note-2",
          title: "Note B",
          userId: "user-1",
          outgoingLinks: [
            { id: "link-2", sourceNoteId: "note-2", targetNoteId: "note-1", targetTitle: "Note A" },
          ],
        },
        {
          id: "note-3",
          title: "Note C",
          userId: "user-1",
          outgoingLinks: [
            { id: "link-3", sourceNoteId: "note-3", targetNoteId: null, targetTitle: "Nonexistent" },
          ],
        },
      ] as never);

      const graph = await service.getGraph("user-1");

      // All notes are nodes
      expect(graph.nodes).toHaveLength(3);
      expect(graph.nodes).toEqual([
        { id: "note-1", label: "Note A", type: "note" },
        { id: "note-2", label: "Note B", type: "note" },
        { id: "note-3", label: "Note C", type: "note" },
      ]);

      // Only links with resolved targetNoteId become edges
      expect(graph.edges).toHaveLength(2);
      expect(graph.edges).toContainEqual({
        source: "note-1",
        target: "note-2",
        type: "wikilink",
      });
      expect(graph.edges).toContainEqual({
        source: "note-2",
        target: "note-1",
        type: "wikilink",
      });
    });
  });

  describe("associateWith", () => {
    it("should create NoteEntityLink record", async () => {
      vi.mocked(prisma.note.findUnique).mockResolvedValue({
        id: "note-1",
        userId: "user-1",
      } as never);
      vi.mocked(prisma.noteEntityLink.create).mockResolvedValue({} as never);

      await service.associateWith("note-1", "user-1", {
        entityType: "task",
        entityId: "task-1",
      });

      expect(prisma.noteEntityLink.create).toHaveBeenCalledWith({
        data: {
          noteId: "note-1",
          entityType: "task",
          entityId: "task-1",
        },
      });
    });

    it("should throw NotFoundError if note does not exist", async () => {
      vi.mocked(prisma.note.findUnique).mockResolvedValue(null);

      await expect(
        service.associateWith("note-1", "user-1", {
          entityType: "project",
          entityId: "project-1",
        })
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError if user does not own note", async () => {
      vi.mocked(prisma.note.findUnique).mockResolvedValue({
        id: "note-1",
        userId: "other-user",
      } as never);

      await expect(
        service.associateWith("note-1", "user-1", {
          entityType: "meeting",
          entityId: "meeting-1",
        })
      ).rejects.toThrow(NotFoundError);
    });
  });
});
