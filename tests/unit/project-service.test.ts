import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock Prisma before importing the service
vi.mock("@/lib/db/prisma", () => ({
  default: {
    project: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    task: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/events/event-bus", () => ({
  eventBus: {
    publish: vi.fn().mockResolvedValue(undefined),
  },
}));

import { ProjectService } from "@/lib/services/project.service";
import prisma from "@/lib/db/prisma";
import { eventBus } from "@/lib/events/event-bus";
import { NotFoundError } from "@/lib/errors";

describe("ProjectService", () => {
  let service: ProjectService;

  beforeEach(() => {
    service = new ProjectService();
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("should create a project and emit project.created event", async () => {
      const mockProject = {
        id: "project-1",
        name: "My Project",
        description: "A description",
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.project.create).mockResolvedValue(mockProject as never);

      const result = await service.create("user-1", {
        name: "My Project",
        description: "A description",
      });

      expect(result.name).toBe("My Project");
      expect(result.description).toBe("A description");
      expect(prisma.project.create).toHaveBeenCalledWith({
        data: {
          name: "My Project",
          description: "A description",
          userId: "user-1",
        },
      });
      expect(eventBus.publish).toHaveBeenCalledWith({
        type: "project.created",
        payload: { id: "project-1", userId: "user-1", name: "My Project" },
      });
    });

    it("should create a project without description", async () => {
      const mockProject = {
        id: "project-2",
        name: "Simple Project",
        description: null,
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.project.create).mockResolvedValue(mockProject as never);

      const result = await service.create("user-1", { name: "Simple Project" });

      expect(result.name).toBe("Simple Project");
      expect(eventBus.publish).toHaveBeenCalledTimes(1);
    });
  });

  describe("update", () => {
    it("should throw NotFoundError if project does not exist", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue(null);

      await expect(
        service.update("project-1", "user-1", { name: "Updated" })
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError if user does not own project", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        id: "project-1",
        userId: "other-user",
      } as never);

      await expect(
        service.update("project-1", "user-1", { name: "Updated" })
      ).rejects.toThrow(NotFoundError);
    });

    it("should update project fields", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        id: "project-1",
        userId: "user-1",
        name: "Old Name",
      } as never);
      vi.mocked(prisma.project.update).mockResolvedValue({
        id: "project-1",
        userId: "user-1",
        name: "New Name",
        description: "New desc",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      const result = await service.update("project-1", "user-1", {
        name: "New Name",
        description: "New desc",
      });

      expect(result.name).toBe("New Name");
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: "project-1" },
        data: { name: "New Name", description: "New desc" },
      });
    });
  });

  describe("delete", () => {
    it("should throw NotFoundError if project does not exist", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue(null);

      await expect(
        service.delete("project-1", "user-1", { deleteTasks: false })
      ).rejects.toThrow(NotFoundError);
    });

    it("should delete associated tasks when deleteTasks is true", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        id: "project-1",
        userId: "user-1",
      } as never);
      vi.mocked(prisma.task.deleteMany).mockResolvedValue({ count: 3 } as never);
      vi.mocked(prisma.project.delete).mockResolvedValue({} as never);

      await service.delete("project-1", "user-1", { deleteTasks: true });

      expect(prisma.task.deleteMany).toHaveBeenCalledWith({
        where: { projectId: "project-1" },
      });
      expect(prisma.task.updateMany).not.toHaveBeenCalled();
      expect(prisma.project.delete).toHaveBeenCalledWith({
        where: { id: "project-1" },
      });
    });

    it("should disassociate tasks when deleteTasks is false", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        id: "project-1",
        userId: "user-1",
      } as never);
      vi.mocked(prisma.task.updateMany).mockResolvedValue({ count: 3 } as never);
      vi.mocked(prisma.project.delete).mockResolvedValue({} as never);

      await service.delete("project-1", "user-1", { deleteTasks: false });

      expect(prisma.task.updateMany).toHaveBeenCalledWith({
        where: { projectId: "project-1" },
        data: { projectId: null },
      });
      expect(prisma.task.deleteMany).not.toHaveBeenCalled();
      expect(prisma.project.delete).toHaveBeenCalledWith({
        where: { id: "project-1" },
      });
    });
  });

  describe("getById", () => {
    it("should return project with tasks included", async () => {
      const mockProject = {
        id: "project-1",
        name: "My Project",
        userId: "user-1",
        tasks: [
          { id: "task-1", name: "Task 1", status: "PENDING" },
          { id: "task-2", name: "Task 2", status: "COMPLETED" },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.project.findUnique).mockResolvedValue(mockProject as never);

      const result = await service.getById("project-1", "user-1");

      expect(result.tasks).toHaveLength(2);
      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: "project-1" },
        include: { tasks: true },
      });
    });

    it("should throw NotFoundError if project not found", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue(null);

      await expect(
        service.getById("project-1", "user-1")
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("listByUser", () => {
    it("should return all projects for a user", async () => {
      const mockProjects = [
        { id: "project-1", name: "Project 1", userId: "user-1" },
        { id: "project-2", name: "Project 2", userId: "user-1" },
      ];
      vi.mocked(prisma.project.findMany).mockResolvedValue(mockProjects as never);

      const result = await service.listByUser("user-1");

      expect(result).toHaveLength(2);
      expect(prisma.project.findMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("addTask", () => {
    it("should associate a task to a project", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        id: "project-1",
        userId: "user-1",
      } as never);
      vi.mocked(prisma.task.findUnique).mockResolvedValue({
        id: "task-1",
        userId: "user-1",
      } as never);
      vi.mocked(prisma.task.update).mockResolvedValue({} as never);

      await service.addTask("project-1", "task-1", "user-1");

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: "task-1" },
        data: { projectId: "project-1" },
      });
    });

    it("should throw NotFoundError if project not found", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue(null);

      await expect(
        service.addTask("project-1", "task-1", "user-1")
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError if task not found", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        id: "project-1",
        userId: "user-1",
      } as never);
      vi.mocked(prisma.task.findUnique).mockResolvedValue(null);

      await expect(
        service.addTask("project-1", "task-1", "user-1")
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("removeTask", () => {
    it("should disassociate a task from a project", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        id: "project-1",
        userId: "user-1",
      } as never);
      vi.mocked(prisma.task.findUnique).mockResolvedValue({
        id: "task-1",
        userId: "user-1",
        projectId: "project-1",
      } as never);
      vi.mocked(prisma.task.update).mockResolvedValue({} as never);

      await service.removeTask("project-1", "task-1", "user-1");

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: "task-1" },
        data: { projectId: null },
      });
    });

    it("should throw NotFoundError if task is not associated with project", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        id: "project-1",
        userId: "user-1",
      } as never);
      vi.mocked(prisma.task.findUnique).mockResolvedValue({
        id: "task-1",
        userId: "user-1",
        projectId: "project-2",
      } as never);

      await expect(
        service.removeTask("project-1", "task-1", "user-1")
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("getProgress", () => {
    it("should calculate progress percentages correctly", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        id: "project-1",
        userId: "user-1",
      } as never);
      vi.mocked(prisma.task.findMany).mockResolvedValue([
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "IN_PROGRESS" },
        { status: "BLOCKED" },
        { status: "PENDING" },
      ] as never);

      const progress = await service.getProgress("project-1", "user-1");

      expect(progress.total).toBe(5);
      expect(progress.completed).toBe(2);
      expect(progress.inProgress).toBe(1);
      expect(progress.blocked).toBe(1);
      expect(progress.percentage).toBe(40);
    });

    it("should return 0 percentage when no tasks exist", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        id: "project-1",
        userId: "user-1",
      } as never);
      vi.mocked(prisma.task.findMany).mockResolvedValue([] as never);

      const progress = await service.getProgress("project-1", "user-1");

      expect(progress.total).toBe(0);
      expect(progress.completed).toBe(0);
      expect(progress.inProgress).toBe(0);
      expect(progress.blocked).toBe(0);
      expect(progress.percentage).toBe(0);
    });

    it("should return 100 percentage when all tasks are completed", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        id: "project-1",
        userId: "user-1",
      } as never);
      vi.mocked(prisma.task.findMany).mockResolvedValue([
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "COMPLETED" },
      ] as never);

      const progress = await service.getProgress("project-1", "user-1");

      expect(progress.total).toBe(3);
      expect(progress.completed).toBe(3);
      expect(progress.percentage).toBe(100);
    });

    it("should throw NotFoundError if project not found", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue(null);

      await expect(
        service.getProgress("project-1", "user-1")
      ).rejects.toThrow(NotFoundError);
    });
  });
});
