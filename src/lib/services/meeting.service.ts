import prisma from "@/lib/db/prisma";
import { eventBus } from "@/lib/events/event-bus";
import { NotFoundError, ExternalServiceError } from "@/lib/errors";
import type { CreateMeetingInput, MeetingSummary } from "@/types/meetings";

/**
 * Retry helper with exponential backoff.
 * Retries the given async function up to maxRetries times with increasing delay.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

/**
 * Generate a simple mock UUID-like string.
 */
function generateMockId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const segments = [8, 4, 4, 4, 12];
  return segments
    .map((len) =>
      Array.from({ length: len }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join("")
    )
    .join("-");
}

/**
 * Generate a mock Google Meet URL.
 */
function generateMockMeetUrl(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const segment = (len: number) =>
    Array.from({ length: len }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  return `https://meet.google.com/mock-${segment(3)}-${segment(3)}`;
}

/**
 * MeetingService manages meetings, Google Calendar integration (mocked),
 * and post-meeting summary storage.
 */
export class MeetingService {
  /**
   * Create a new meeting record in the database.
   * Sets status to SCHEDULED. Does NOT create a Google event.
   */
  async create(organizerId: string, data: CreateMeetingInput) {
    const meeting = await prisma.meeting.create({
      data: {
        title: data.title,
        description: data.description,
        scheduledAt: data.scheduledAt,
        duration: data.duration,
        status: "SCHEDULED",
        organizerId,
        projectId: data.projectId,
      },
    });

    return meeting;
  }

  /**
   * Get a meeting by ID with its summary included.
   * Validates ownership (organizer).
   */
  async getById(id: string, organizerId: string) {
    const meeting = await prisma.meeting.findUnique({
      where: { id },
      include: { summary: true },
    });

    if (!meeting) {
      throw new NotFoundError(`Meeting with id "${id}" not found`);
    }
    if (meeting.organizerId !== organizerId) {
      throw new NotFoundError(`Meeting with id "${id}" not found`);
    }

    return meeting;
  }

  /**
   * List all meetings for a user, ordered by scheduledAt descending.
   */
  async listByUser(organizerId: string) {
    const meetings = await prisma.meeting.findMany({
      where: { organizerId },
      orderBy: { scheduledAt: "desc" },
    });

    return meetings;
  }

  /**
   * List upcoming meetings (scheduledAt > now) for a user,
   * ordered by scheduledAt ascending.
   */
  async listUpcoming(organizerId: string) {
    const meetings = await prisma.meeting.findMany({
      where: {
        organizerId,
        scheduledAt: { gt: new Date() },
      },
      orderBy: { scheduledAt: "asc" },
    });

    return meetings;
  }

  /**
   * Placeholder for creating a Google Calendar event with Meet link.
   * In production, this would call the Google Calendar API via Composio.
   * For now, generates mock meetUrl and googleEventId, updates the meeting record.
   * Implements retry with exponential backoff.
   * Throws ExternalServiceError if all retries fail.
   */
  async createGoogleEvent(meetingId: string, organizerId: string) {
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
    });

    if (!meeting) {
      throw new NotFoundError(`Meeting with id "${meetingId}" not found`);
    }
    if (meeting.organizerId !== organizerId) {
      throw new NotFoundError(`Meeting with id "${meetingId}" not found`);
    }

    try {
      const updatedMeeting = await withRetry(async () => {
        // In production, this would call the Google Calendar API
        const googleEventId = generateMockId();
        const meetUrl = generateMockMeetUrl();

        return prisma.meeting.update({
          where: { id: meetingId },
          data: {
            googleEventId,
            meetUrl,
          },
        });
      });

      return updatedMeeting;
    } catch (error) {
      throw new ExternalServiceError(
        `Failed to create Google Calendar event after retries: ${(error as Error).message}`,
        "GoogleCalendar"
      );
    }
  }

  /**
   * Store a meeting summary record in the database and emit "meeting.completed" event.
   */
  async storeSummary(meetingId: string, organizerId: string, summary: MeetingSummary) {
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
    });

    if (!meeting) {
      throw new NotFoundError(`Meeting with id "${meetingId}" not found`);
    }
    if (meeting.organizerId !== organizerId) {
      throw new NotFoundError(`Meeting with id "${meetingId}" not found`);
    }

    await prisma.meetingSummaryRecord.create({
      data: {
        meetingId,
        overview: summary.overview,
        decisions: summary.decisions as unknown as object,
        actionItems: summary.actionItems as unknown as object,
      },
    });

    await prisma.meeting.update({
      where: { id: meetingId },
      data: { status: "COMPLETED" },
    });

    await eventBus.publish({
      type: "meeting.completed",
      payload: { id: meetingId, meetingId },
    });
  }
}

/** Singleton instance for use across the application */
export const meetingService = new MeetingService();
