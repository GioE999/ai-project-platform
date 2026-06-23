import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock Prisma before importing the service
vi.mock("@/lib/db/prisma", () => ({
  default: {
    task: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    taskDependency: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/events/event-bus", () => ({
  eventBus: {
    publish: vi.fn().mockResolvedValue(undefined),
  },
}));

import { TaskService } from "@/lib/services/task.service";
import prisma from "@/lib/db/prisma";
import { eventBus } from "@/lib/events/event-bus";
import { ValidationError, NotFoundError, ConflictError } from "@/lib/errors";

describe("TaskService", () => {
  let service: TaskService;

  beforeEach(() => {
    service = new TaskService();
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("should create a task with default status and priority", async () => {
      const mockTask = {
        id: "task-1",
        name: "Test Task",
        description: null,
        status: "PENDING",
        priority: "MEDIUM",
        dueDate: null,
        userId: "user-1",
        projectId: null,
        meetingId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.task.create).mockResolvedValue(mockTask as never);

      const result = await service.create("user-1", { name: "Test Task" });

      expect(result.status).toBe("pending");
      expect(result.priority).toBe("medium");
      expect(result.name).toBe("Test Task");
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          name: "Test Task",
          description: undefined,
          status: "PENDING",
          priority: "MEDIUM",
          dueDate: undefined,
          userId: "user-1",
          projectId: undefined,
        },
      });
      expect(eventBus.publish).toHaveBeenCalledWith({
        type: "task.created",
        payload: { id: "task-1", userId: "user-1", name: "Test Task" },
      });
    });

    it("should throw ValidationError for invalid status", async () => {
      await expect(
        service.create("user-1", {
          name: "Task",
          status: "invalid" as never,
        })
      ).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError for invalid priority", async () => {
      await expect(
        service.create("user-1", {
          name: "Task",
          priority: "critical" as never,
        })
      ).rejects.toThrow(ValidationError);
    });

    it("should accept valid status values", async () => {
      const mockTask = {
        id: "task-1",
        name: "Task",
        description: null,
        status: "IN_PROGRESS",
        priority: "HIGH",
        dueDate: null,
        userId: "user-1",
        projectId: null,
        meetingId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.task.create).mockResolvedValue(mockTask as never);

      const result = await service.create("user-1", {
        name: "Task",
        status: "in_progress",
        priority: "high",
      });

      expect(result.status).toBe("in_progress");
      expect(result.priority).toBe("high");
    });
  });

  describe("update", () => {
    it("should throw NotFoundError if task does not exist", async () => {
      vi.mocked(prisma.task.findUnique).mockResolvedValue(null);

      await expect(
        service.update("task-1", "user-1", { name: "Updated" })
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError if user does not own task", async () => {
      vi.mocked(prisma.task.findUnique).mockResolvedValue({
        id: "task-1",
        userId: "other-user",
      } as never);

      await expect(
        service.update("task-1", "user-1", { name: "Updated" })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("updateStatus", () => {
    it("should validate status using Zod", async () => {
      await expect(
        service.updateStatus("task-1", "user-1", "invalid_status" as never)
      ).rejects.toThrow(ValidationError);
    });

    it("should accept all valid status values", async () => {
      const validStatuses = [
        "pending",
        "in_progress",
        "completed",
        "blocked",
        "review",
      ] as const;

      for (const status of validStatuses) {
        vi.mocked(prisma.task.findUnique).mockResolvedValue({
          id: "task-1",
          userId: "user-1",
          status: "PENDING",
          priority: "MEDIUM",
        } as never);
        vi.mocked(prisma.task.update).mockResolvedValue({
          id: "task-1",
          name: "Task",
          userId: "user-1",
          status: status.toUpperCase().replace(" ", "_"),
          priority: "MEDIUM",
          createdAt: new Date(),
          updatedAt: new Date(),
        } as never);

        // Should not throw
        await service.updateStatus("task-1", "user-1", status);
      }
    });
  });

  describe("validateNoCycles", () => {
    it("should return true when no cycle exists", async () => {
      // A → B (adding A depends on B), B has no dependencies
      vi.mocked(prisma.taskDependency.findMany).mockResolvedValue([]);

      const result = await service.validateNoCycles("task-a", "task-b");
      expect(result).toBe(true);
    });

    it("should return false when cycle would be created", async () => {
      // A depends on B, B depends on C, adding C depends on A would create cycle
      // We're checking: can we add edge C → A (C dependsOn A)?
      // DFS from A: A's deps → look up taskDependency where taskId=A
      // A → B → C → back to A? No, we start from dependsOnId (A) and check if we reach taskId (C)
      
      // Actually: validateNoCycles(taskId="C", dependsOnId="A")
      // DFS starts at "A", follows A's dependencies to find if it reaches "C"
      // A depends on B (taskId=A, dependsOnId=B)
      // B depends on C (taskId=B, dependsOnId=C)
      // So from A → B → C → C found! Return false (cycle)

      vi.mocked(prisma.taskDependency.findMany)
        .mockResolvedValueOnce([{ dependsOnId: "task-b" }] as never) // A's deps
        .mockResolvedValueOnce([{ dependsOnId: "task-c" }] as never); // B's deps

      const result = await service.validateNoCycles("task-c", "task-a");
      expect(result).toBe(false);
    });
  });

  describe("addDependency", () => {
    it("should throw ConflictError when task depends on itself", async () => {
      vi.mocked(prisma.task.findUnique).mockResolvedValue({
        id: "task-1",
        userId: "user-1",
      } as never);

      await expect(
        service.addDependency("task-1", "task-1", "user-1")
      ).rejects.toThrow(ConflictError);
    });
  });
});
