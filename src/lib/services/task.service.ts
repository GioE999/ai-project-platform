import { z } from "zod/v4";
import prisma from "@/lib/db/prisma";
import { eventBus } from "@/lib/events/event-bus";
import { ValidationError, NotFoundError, ConflictError } from "@/lib/errors";
import type {
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
  TaskStatus,
  Priority,
} from "@/types";

// Zod schemas for runtime validation
const taskStatusSchema = z.enum([
  "pending",
  "in_progress",
  "completed",
  "blocked",
  "review",
]);
const prioritySchema = z.enum(["low", "medium", "high"]);

// Map lowercase domain types to Prisma enum values
const STATUS_MAP: Record<TaskStatus, string> = {
  pending: "PENDING",
  in_progress: "IN_PROGRESS",
  completed: "COMPLETED",
  blocked: "BLOCKED",
  review: "REVIEW",
};

const PRIORITY_MAP: Record<Priority, string> = {
  low: "LOW",
  medium: "MEDIUM",
  high: "HIGH",
};

// Reverse maps
const STATUS_REVERSE: Record<string, TaskStatus> = Object.fromEntries(
  Object.entries(STATUS_MAP).map(([k, v]) => [v, k as TaskStatus])
);
const PRIORITY_REVERSE: Record<string, Priority> = Object.fromEntries(
  Object.entries(PRIORITY_MAP).map(([k, v]) => [v, k as Priority])
);

/**
 * Sort field mapping from domain to Prisma field names.
 */
function getSortField(
  sortBy?: TaskFilters["sortBy"]
): string {
  switch (sortBy) {
    case "priority":
      return "priority";
    case "status":
      return "status";
    case "dueDate":
      return "dueDate";
    case "createdAt":
    default:
      return "createdAt";
  }
}


/**
 * TaskService provides CRUD operations for tasks, dependency management
 * with cycle detection, and status updates with validation.
 */
export class TaskService {
  // ─── CRUD (Task 7.1) ────────────────────────────────────────────

  /**
   * Create a new task with defaults (status: "pending", priority: "medium").
   * Emits "task.created" event.
   */
  async create(userId: string, data: CreateTaskInput) {
    // Validate enums if provided
    if (data.status) {
      const result = taskStatusSchema.safeParse(data.status);
      if (!result.success) {
        throw new ValidationError(
          `Invalid status "${data.status}". Must be one of: pending, in_progress, completed, blocked, review`
        );
      }
    }
    if (data.priority) {
      const result = prioritySchema.safeParse(data.priority);
      if (!result.success) {
        throw new ValidationError(
          `Invalid priority "${data.priority}". Must be one of: low, medium, high`
        );
      }
    }

    const status = data.status ?? "pending";
    const priority = data.priority ?? "medium";

    const task = await prisma.task.create({
      data: {
        name: data.name,
        description: data.description,
        status: STATUS_MAP[status] as never,
        priority: PRIORITY_MAP[priority] as never,
        dueDate: data.dueDate,
        userId,
        projectId: data.projectId,
      },
    });

    await eventBus.publish({
      type: "task.created",
      payload: { id: task.id, userId, name: task.name },
    });

    return {
      ...task,
      status: STATUS_REVERSE[task.status] as TaskStatus,
      priority: PRIORITY_REVERSE[task.priority] as Priority,
    };
  }

  /**
   * Update only provided fields. Validates ownership.
   * Emits "task.updated" event.
   */
  async update(id: string, userId: string, data: UpdateTaskInput) {
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Task with id "${id}" not found`);
    }
    if (existing.userId !== userId) {
      throw new NotFoundError(`Task with id "${id}" not found`);
    }

    // Validate enums if provided
    if (data.status) {
      const result = taskStatusSchema.safeParse(data.status);
      if (!result.success) {
        throw new ValidationError(
          `Invalid status "${data.status}". Must be one of: pending, in_progress, completed, blocked, review`
        );
      }
    }
    if (data.priority) {
      const result = prioritySchema.safeParse(data.priority);
      if (!result.success) {
        throw new ValidationError(
          `Invalid priority "${data.priority}". Must be one of: low, medium, high`
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.projectId !== undefined) updateData.projectId = data.projectId;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;
    if (data.status !== undefined) updateData.status = STATUS_MAP[data.status] as never;
    if (data.priority !== undefined) updateData.priority = PRIORITY_MAP[data.priority] as never;

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    await eventBus.publish({
      type: "task.updated",
      payload: { id: task.id, changes: data as Record<string, unknown> },
    });

    return {
      ...task,
      status: STATUS_REVERSE[task.status] as TaskStatus,
      priority: PRIORITY_REVERSE[task.priority] as Priority,
    };
  }

  /**
   * Delete task and cascading dependencies (handled by Prisma cascade).
   * Emits "task.deleted" event.
   */
  async delete(id: string, userId: string) {
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Task with id "${id}" not found`);
    }
    if (existing.userId !== userId) {
      throw new NotFoundError(`Task with id "${id}" not found`);
    }

    await prisma.task.delete({ where: { id } });

    await eventBus.publish({
      type: "task.deleted",
      payload: { id },
    });
  }

  /**
   * Get task by ID. Validates ownership.
   */
  async getById(id: string, userId: string) {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundError(`Task with id "${id}" not found`);
    }
    if (task.userId !== userId) {
      throw new NotFoundError(`Task with id "${id}" not found`);
    }

    return {
      ...task,
      status: STATUS_REVERSE[task.status] as TaskStatus,
      priority: PRIORITY_REVERSE[task.priority] as Priority,
    };
  }

  /**
   * List tasks for a project with optional filtering and sorting.
   */
  async listByProject(projectId: string, userId: string, filters?: TaskFilters) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { projectId, userId };
    if (filters?.status) {
      where.status = STATUS_MAP[filters.status];
    }
    if (filters?.priority) {
      where.priority = PRIORITY_MAP[filters.priority];
    }

    const sortField = getSortField(filters?.sortBy);
    const sortOrder = filters?.sortOrder ?? "asc";

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { [sortField]: sortOrder },
    });

    return tasks.map((task: { status: string; priority: string }) => ({
      ...task,
      status: STATUS_REVERSE[task.status] as TaskStatus,
      priority: PRIORITY_REVERSE[task.priority] as Priority,
    }));
  }

  /**
   * List all tasks belonging to a user with optional filtering and sorting.
   */
  async listByUser(userId: string, filters?: TaskFilters) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { userId };
    if (filters?.status) {
      where.status = STATUS_MAP[filters.status];
    }
    if (filters?.priority) {
      where.priority = PRIORITY_MAP[filters.priority];
    }
    if (filters?.projectId) {
      where.projectId = filters.projectId;
    }

    const sortField = getSortField(filters?.sortBy);
    const sortOrder = filters?.sortOrder ?? "asc";

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { [sortField]: sortOrder },
    });

    return tasks.map((task: { status: string; priority: string }) => ({
      ...task,
      status: STATUS_REVERSE[task.status] as TaskStatus,
      priority: PRIORITY_REVERSE[task.priority] as Priority,
    }));
  }

  // ─── Dependency Management (Task 7.2) ─────────────────────────────

  /**
   * Add a dependency after validating no cycles.
   * Throws ConflictError if adding would create a cycle.
   */
  async addDependency(taskId: string, dependsOnId: string, userId: string) {
    // Validate both tasks exist and belong to the user
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.userId !== userId) {
      throw new NotFoundError(`Task with id "${taskId}" not found`);
    }
    const dependency = await prisma.task.findUnique({ where: { id: dependsOnId } });
    if (!dependency || dependency.userId !== userId) {
      throw new NotFoundError(`Task with id "${dependsOnId}" not found`);
    }

    // A task cannot depend on itself
    if (taskId === dependsOnId) {
      throw new ConflictError("A task cannot depend on itself");
    }

    // Check for existing dependency
    const existing = await prisma.taskDependency.findUnique({
      where: { taskId_dependsOnId: { taskId, dependsOnId } },
    });
    if (existing) {
      throw new ConflictError(
        `Dependency from "${taskId}" to "${dependsOnId}" already exists`
      );
    }

    // Validate no cycles would be created
    const safe = await this.validateNoCycles(taskId, dependsOnId);
    if (!safe) {
      throw new ConflictError(
        "Adding this dependency would create a circular dependency"
      );
    }

    await prisma.taskDependency.create({
      data: { taskId, dependsOnId },
    });
  }

  /**
   * Remove a dependency between two tasks.
   */
  async removeDependency(taskId: string, dependsOnId: string, userId: string) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.userId !== userId) {
      throw new NotFoundError(`Task with id "${taskId}" not found`);
    }

    const existing = await prisma.taskDependency.findUnique({
      where: { taskId_dependsOnId: { taskId, dependsOnId } },
    });
    if (!existing) {
      throw new NotFoundError(`Dependency not found`);
    }

    await prisma.taskDependency.delete({
      where: { taskId_dependsOnId: { taskId, dependsOnId } },
    });
  }

  /**
   * DFS cycle detection: checks if adding edge (taskId → dependsOnId) would create a cycle.
   *
   * If following dependsOnId's own dependencies (transitively) can reach taskId,
   * then it would form a cycle. Returns true if safe (no cycle), false if cycle detected.
   */
  async validateNoCycles(taskId: string, dependsOnId: string): Promise<boolean> {
    const visited = new Set<string>();
    const stack: string[] = [dependsOnId];

    while (stack.length > 0) {
      const current = stack.pop()!;

      if (current === taskId) {
        // Reached the source task — cycle would be formed
        return false;
      }

      if (visited.has(current)) {
        continue;
      }
      visited.add(current);

      // Get all tasks that 'current' depends on
      const dependencies = await prisma.taskDependency.findMany({
        where: { taskId: current },
        select: { dependsOnId: true },
      });

      for (const dep of dependencies) {
        if (!visited.has(dep.dependsOnId)) {
          stack.push(dep.dependsOnId);
        }
      }
    }

    return true;
  }

  // ─── Status Update (Task 7.3) ─────────────────────────────────────

  /**
   * Update task status with validation.
   * Validates the status enum value before updating.
   */
  async updateStatus(id: string, userId: string, status: TaskStatus) {
    const result = taskStatusSchema.safeParse(status);
    if (!result.success) {
      throw new ValidationError(
        `Invalid status "${status}". Must be one of: pending, in_progress, completed, blocked, review`
      );
    }

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Task with id "${id}" not found`);
    }
    if (existing.userId !== userId) {
      throw new NotFoundError(`Task with id "${id}" not found`);
    }

    const task = await prisma.task.update({
      where: { id },
      data: { status: STATUS_MAP[status] as never },
    });

    await eventBus.publish({
      type: "task.updated",
      payload: { id: task.id, changes: { status } },
    });

    return {
      ...task,
      status: STATUS_REVERSE[task.status] as TaskStatus,
      priority: PRIORITY_REVERSE[task.priority] as Priority,
    };
  }
}

/** Singleton instance for use across the application */
export const taskService = new TaskService();
