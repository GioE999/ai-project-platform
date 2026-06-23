import prisma from "@/lib/db/prisma";
import { eventBus } from "@/lib/events/event-bus";
import { NotFoundError } from "@/lib/errors";
import type {
  CreateProjectInput,
  UpdateProjectInput,
  ProjectProgress,
} from "@/types/projects";

/**
 * ProjectService provides CRUD operations for projects,
 * task association/disassociation, and progress tracking.
 */
export class ProjectService {
  /**
   * Create a new project and emit "project.created" event.
   */
  async create(userId: string, data: CreateProjectInput) {
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        userId,
      },
    });

    await eventBus.publish({
      type: "project.created",
      payload: { id: project.id, userId, name: project.name },
    });

    return project;
  }

  /**
   * Update project fields. Validates ownership.
   */
  async update(id: string, userId: string, data: UpdateProjectInput) {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Project with id "${id}" not found`);
    }
    if (existing.userId !== userId) {
      throw new NotFoundError(`Project with id "${id}" not found`);
    }

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return project;
  }

  /**
   * Delete a project. If deleteTasks is true, deletes associated tasks.
   * If false, disassociates tasks by setting their projectId to null.
   */
  async delete(id: string, userId: string, options: { deleteTasks: boolean }) {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Project with id "${id}" not found`);
    }
    if (existing.userId !== userId) {
      throw new NotFoundError(`Project with id "${id}" not found`);
    }

    if (options.deleteTasks) {
      // Delete all tasks associated with this project
      await prisma.task.deleteMany({ where: { projectId: id } });
    } else {
      // Disassociate tasks by setting projectId to null
      await prisma.task.updateMany({
        where: { projectId: id },
        data: { projectId: null },
      });
    }

    await prisma.project.delete({ where: { id } });
  }

  /**
   * Get project by ID with its tasks included. Validates ownership.
   */
  async getById(id: string, userId: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { tasks: true },
    });
    if (!project) {
      throw new NotFoundError(`Project with id "${id}" not found`);
    }
    if (project.userId !== userId) {
      throw new NotFoundError(`Project with id "${id}" not found`);
    }

    return project;
  }

  /**
   * List all projects belonging to a user.
   */
  async listByUser(userId: string) {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return projects;
  }

  /**
   * Associate an existing task to a project. Validates ownership of both.
   */
  async addTask(projectId: string, taskId: string, userId: string) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundError(`Project with id "${projectId}" not found`);
    }
    if (project.userId !== userId) {
      throw new NotFoundError(`Project with id "${projectId}" not found`);
    }

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundError(`Task with id "${taskId}" not found`);
    }
    if (task.userId !== userId) {
      throw new NotFoundError(`Task with id "${taskId}" not found`);
    }

    await prisma.task.update({
      where: { id: taskId },
      data: { projectId },
    });
  }

  /**
   * Disassociate a task from a project by setting its projectId to null.
   * Validates ownership of both.
   */
  async removeTask(projectId: string, taskId: string, userId: string) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundError(`Project with id "${projectId}" not found`);
    }
    if (project.userId !== userId) {
      throw new NotFoundError(`Project with id "${projectId}" not found`);
    }

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundError(`Task with id "${taskId}" not found`);
    }
    if (task.userId !== userId) {
      throw new NotFoundError(`Task with id "${taskId}" not found`);
    }
    if (task.projectId !== projectId) {
      throw new NotFoundError(`Task with id "${taskId}" is not associated with this project`);
    }

    await prisma.task.update({
      where: { id: taskId },
      data: { projectId: null },
    });
  }

  /**
   * Get progress statistics for a project. Validates ownership.
   */
  async getProgress(projectId: string, userId: string): Promise<ProjectProgress> {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundError(`Project with id "${projectId}" not found`);
    }
    if (project.userId !== userId) {
      throw new NotFoundError(`Project with id "${projectId}" not found`);
    }

    const tasks = await prisma.task.findMany({
      where: { projectId },
      select: { status: true },
    });

    const total = tasks.length;
    const completed = tasks.filter((t: { status: string }) => t.status === "COMPLETED").length;
    const inProgress = tasks.filter((t: { status: string }) => t.status === "IN_PROGRESS").length;
    const blocked = tasks.filter((t: { status: string }) => t.status === "BLOCKED").length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      total,
      completed,
      inProgress,
      blocked,
      percentage,
    };
  }
}

/** Singleton instance for use across the application */
export const projectService = new ProjectService();
