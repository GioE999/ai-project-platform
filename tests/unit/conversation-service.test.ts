import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock Prisma before importing the service
vi.mock("@/lib/db/prisma", () => ({
  default: {
    thread: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    message: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

import { ConversationService } from "@/lib/services/conversation.service";
import prisma from "@/lib/db/prisma";
import { NotFoundError } from "@/lib/errors";

describe("ConversationService", () => {
  let service: ConversationService;

  beforeEach(() => {
    service = new ConversationService();
    vi.clearAllMocks();
  });

  describe("createThread", () => {
    it("should create a thread linked to a task", async () => {
      const mockThread = {
        id: "thread-1",
        entityType: "task",
        entityId: "task-1",
        taskId: "task-1",
        projectId: null,
        createdAt: new Date(),
      };
      vi.mocked(prisma.thread.create).mockResolvedValue(mockThread as never);

      const result = await service.createThread("task", "task-1");

      expect(result.id).toBe("thread-1");
      expect(result.entityType).toBe("task");
      expect(result.taskId).toBe("task-1");
      expect(prisma.thread.create).toHaveBeenCalledWith({
        data: {
          entityType: "task",
          entityId: "task-1",
          taskId: "task-1",
        },
      });
    });

    it("should create a thread linked to a project", async () => {
      const mockThread = {
        id: "thread-2",
        entityType: "project",
        entityId: "project-1",
        taskId: null,
        projectId: "project-1",
        createdAt: new Date(),
      };
      vi.mocked(prisma.thread.create).mockResolvedValue(mockThread as never);

      const result = await service.createThread("project", "project-1");

      expect(result.id).toBe("thread-2");
      expect(result.entityType).toBe("project");
      expect(result.projectId).toBe("project-1");
      expect(prisma.thread.create).toHaveBeenCalledWith({
        data: {
          entityType: "project",
          entityId: "project-1",
          projectId: "project-1",
        },
      });
    });
  });

  describe("postMessage", () => {
    it("should store message correctly", async () => {
      const now = new Date();
      const mockMessage = {
        id: "msg-1",
        content: "Hello world",
        authorId: "user-1",
        authorType: "user",
        agentType: null,
        threadId: "thread-1",
        createdAt: now,
      };

      vi.mocked(prisma.thread.findUnique).mockResolvedValue({
        id: "thread-1",
        entityType: "task",
        entityId: "task-1",
        taskId: "task-1",
        projectId: null,
        createdAt: now,
      } as never);
      vi.mocked(prisma.message.create).mockResolvedValue(mockMessage as never);

      const result = await service.postMessage("thread-1", {
        content: "Hello world",
        authorId: "user-1",
        authorType: "user",
      });

      expect(result.id).toBe("msg-1");
      expect(result.content).toBe("Hello world");
      expect(result.authorId).toBe("user-1");
      expect(result.authorType).toBe("user");
      expect(result.threadId).toBe("thread-1");
      expect(prisma.message.create).toHaveBeenCalledWith({
        data: {
          content: "Hello world",
          authorId: "user-1",
          authorType: "user",
          agentType: undefined,
          threadId: "thread-1",
        },
      });
    });

    it("should throw NotFoundError if thread does not exist", async () => {
      vi.mocked(prisma.thread.findUnique).mockResolvedValue(null);

      await expect(
        service.postMessage("nonexistent", {
          content: "test",
          authorId: "user-1",
          authorType: "user",
        })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("getMessages", () => {
    it("should return messages in chronological order with pagination", async () => {
      const now = new Date();
      const messages = [
        {
          id: "msg-1",
          content: "First",
          authorId: "user-1",
          authorType: "user",
          agentType: null,
          threadId: "thread-1",
          createdAt: new Date(now.getTime() - 2000),
        },
        {
          id: "msg-2",
          content: "Second",
          authorId: "user-1",
          authorType: "user",
          agentType: null,
          threadId: "thread-1",
          createdAt: new Date(now.getTime() - 1000),
        },
        {
          id: "msg-3",
          content: "Third",
          authorId: "user-1",
          authorType: "user",
          agentType: null,
          threadId: "thread-1",
          createdAt: now,
        },
      ];

      vi.mocked(prisma.thread.findUnique).mockResolvedValue({
        id: "thread-1",
        entityType: "task",
        entityId: "task-1",
        taskId: "task-1",
        projectId: null,
        createdAt: now,
      } as never);
      vi.mocked(prisma.message.findMany).mockResolvedValue(messages as never);

      const result = await service.getMessages("thread-1", {
        page: 1,
        limit: 10,
      });

      expect(result).toHaveLength(3);
      expect(result[0].content).toBe("First");
      expect(result[1].content).toBe("Second");
      expect(result[2].content).toBe("Third");
      expect(prisma.message.findMany).toHaveBeenCalledWith({
        where: { threadId: "thread-1" },
        orderBy: { createdAt: "asc" },
        skip: 0,
        take: 10,
      });
    });

    it("should calculate skip correctly for page 2", async () => {
      vi.mocked(prisma.thread.findUnique).mockResolvedValue({
        id: "thread-1",
        entityType: "task",
        entityId: "task-1",
        taskId: "task-1",
        projectId: null,
        createdAt: new Date(),
      } as never);
      vi.mocked(prisma.message.findMany).mockResolvedValue([] as never);

      await service.getMessages("thread-1", { page: 2, limit: 5 });

      expect(prisma.message.findMany).toHaveBeenCalledWith({
        where: { threadId: "thread-1" },
        orderBy: { createdAt: "asc" },
        skip: 5,
        take: 5,
      });
    });

    it("should throw NotFoundError if thread does not exist", async () => {
      vi.mocked(prisma.thread.findUnique).mockResolvedValue(null);

      await expect(
        service.getMessages("nonexistent", { page: 1, limit: 10 })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("parseMentions", () => {
    it("should extract different mention types correctly", async () => {
      const content = "Check @task:abc-123 and @project:proj-1 for details";
      const mentions = service.parseMentions(content);

      expect(mentions).toHaveLength(2);
      expect(mentions[0]).toEqual({
        type: "task",
        id: "abc-123",
        displayText: "task:abc-123",
      });
      expect(mentions[1]).toEqual({
        type: "project",
        id: "proj-1",
        displayText: "project:proj-1",
      });
    });

    it("should handle display text in brackets", async () => {
      const content = "See @note:note-1[My Note] for reference";
      const mentions = service.parseMentions(content);

      expect(mentions).toHaveLength(1);
      expect(mentions[0]).toEqual({
        type: "note",
        id: "note-1",
        displayText: "My Note",
      });
    });

    it("should handle multiple mentions in one message", async () => {
      const content =
        "Hey @user:john[John], check @task:t1[Bug Fix] and @project:p1[Main Project]";
      const mentions = service.parseMentions(content);

      expect(mentions).toHaveLength(3);
      expect(mentions[0]).toEqual({
        type: "user",
        id: "john",
        displayText: "John",
      });
      expect(mentions[1]).toEqual({
        type: "task",
        id: "t1",
        displayText: "Bug Fix",
      });
      expect(mentions[2]).toEqual({
        type: "project",
        id: "p1",
        displayText: "Main Project",
      });
    });

    it("should return empty array for no mentions", async () => {
      const content = "This is a regular message with no mentions";
      const mentions = service.parseMentions(content);

      expect(mentions).toEqual([]);
    });

    it("should handle mentions without display text using default", async () => {
      const content = "Assign to @user:user-42";
      const mentions = service.parseMentions(content);

      expect(mentions).toHaveLength(1);
      expect(mentions[0]).toEqual({
        type: "user",
        id: "user-42",
        displayText: "user:user-42",
      });
    });
  });
});
