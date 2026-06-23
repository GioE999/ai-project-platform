import prisma from "@/lib/db/prisma";
import { NotFoundError } from "@/lib/errors";
import type { PostMessageInput, Mention, Pagination } from "@/types";

/**
 * Regex pattern for parsing mentions in message content.
 * Supports: @task:id, @project:id, @note:id, @user:id
 * Optional display text in brackets: @task:id[display text]
 */
const MENTION_REGEX = /@(task|project|note|user):([a-zA-Z0-9_-]+)(?:\[([^\]]+)\])?/g;

/**
 * ConversationService manages conversation threads and messages
 * associated with tasks and projects.
 */
export class ConversationService {
  /**
   * Create a new conversation thread linked to a task or project.
   * Sets taskId or projectId based on the entityType.
   */
  async createThread(entityType: "task" | "project", entityId: string) {
    const data: {
      entityType: string;
      entityId: string;
      taskId?: string;
      projectId?: string;
    } = {
      entityType,
      entityId,
    };

    if (entityType === "task") {
      data.taskId = entityId;
    } else {
      data.projectId = entityId;
    }

    const thread = await prisma.thread.create({ data });

    return thread;
  }

  /**
   * Get a thread with its messages ordered by createdAt ascending.
   * Throws NotFoundError if thread does not exist.
   */
  async getThread(threadId: string) {
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!thread) {
      throw new NotFoundError(`Thread with id "${threadId}" not found`);
    }

    return thread;
  }

  /**
   * Post a message to a thread.
   * Throws NotFoundError if thread does not exist.
   */
  async postMessage(threadId: string, data: PostMessageInput) {
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
    });

    if (!thread) {
      throw new NotFoundError(`Thread with id "${threadId}" not found`);
    }

    const message = await prisma.message.create({
      data: {
        content: data.content,
        authorId: data.authorId,
        authorType: data.authorType,
        agentType: data.agentType,
        threadId,
      },
    });

    return message;
  }

  /**
   * Get paginated messages for a thread, ordered by createdAt ascending.
   * Uses skip and take from Prisma for pagination.
   */
  async getMessages(threadId: string, pagination: Pagination) {
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
    });

    if (!thread) {
      throw new NotFoundError(`Thread with id "${threadId}" not found`);
    }

    const skip = (pagination.page - 1) * pagination.limit;

    const messages = await prisma.message.findMany({
      where: { threadId },
      orderBy: { createdAt: "asc" },
      skip,
      take: pagination.limit,
    });

    return messages;
  }

  /**
   * Parse mention syntax from message content.
   * Supports: @task:id, @project:id, @note:id, @user:id
   * With optional display text: @task:id[display text]
   * Returns an array of Mention objects.
   */
  parseMentions(content: string): Mention[] {
    const mentions: Mention[] = [];
    let match: RegExpExecArray | null;

    // Reset regex state for each call
    const regex = new RegExp(MENTION_REGEX.source, MENTION_REGEX.flags);

    while ((match = regex.exec(content)) !== null) {
      const type = match[1] as Mention["type"];
      const id = match[2];
      const displayText = match[3] || `${type}:${id}`;

      mentions.push({ type, id, displayText });
    }

    return mentions;
  }
}

/** Singleton instance for use across the application */
export const conversationService = new ConversationService();
