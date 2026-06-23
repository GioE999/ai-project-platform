import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock Prisma before importing the service
vi.mock("@/lib/db/prisma", () => ({
  default: {
    meeting: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    meetingSummaryRecord: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/events/event-bus", () => ({
  eventBus: {
    publish: vi.fn().mockResolvedValue(undefined),
  },
}));

import { MeetingService } from "@/lib/services/meeting.service";
import prisma from "@/lib/db/prisma";
import { eventBus } from "@/lib/events/event-bus";
import { NotFoundError, ExternalServiceError } from "@/lib/errors";

describe("MeetingService", () => {
  let service: MeetingService;

  beforeEach(() => {
    service = new MeetingService();
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("should create a meeting with SCHEDULED status", async () => {
      const scheduledAt = new Date("2025-02-01T10:00:00Z");
      const mockMeeting = {
        id: "meeting-1",
        title: "Sprint Planning",
        description: "Plan the next sprint",
        scheduledAt,
        duration: 60,
        meetUrl: null,
        googleEventId: null,
        status: "SCHEDULED",
        organizerId: "user-1",
        projectId: "project-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.meeting.create).mockResolvedValue(mockMeeting as never);

      const result = await service.create("user-1", {
        title: "Sprint Planning",
        description: "Plan the next sprint",
        scheduledAt,
        duration: 60,
        projectId: "project-1",
        attendees: ["user-2", "user-3"],
      });

      expect(result.id).toBe("meeting-1");
      expect(result.status).toBe("SCHEDULED");
      expect(result.title).toBe("Sprint Planning");
      expect(result.organizerId).toBe("user-1");
      expect(prisma.meeting.create).toHaveBeenCalledWith({
        data: {
          title: "Sprint Planning",
          description: "Plan the next sprint",
          scheduledAt,
          duration: 60,
          status: "SCHEDULED",
          organizerId: "user-1",
          projectId: "project-1",
        },
      });
    });
  });

  describe("getById", () => {
    it("should return meeting with summary included", async () => {
      const mockMeeting = {
        id: "meeting-1",
        title: "Sprint Planning",
        description: null,
        scheduledAt: new Date(),
        duration: 60,
        meetUrl: "https://meet.google.com/mock-abc-def",
        googleEventId: "event-123",
        status: "COMPLETED",
        organizerId: "user-1",
        projectId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        summary: {
          id: "summary-1",
          meetingId: "meeting-1",
          overview: "Discussed sprint goals",
          decisions: ["Use React", "Deploy Friday"],
          actionItems: [{ description: "Write tests", assigneeId: "user-2" }],
          createdAt: new Date(),
        },
      };
      vi.mocked(prisma.meeting.findUnique).mockResolvedValue(mockMeeting as never);

      const result = await service.getById("meeting-1", "user-1");

      expect(result.id).toBe("meeting-1");
      expect(result.summary).toBeDefined();
      expect(result.summary!.overview).toBe("Discussed sprint goals");
      expect(prisma.meeting.findUnique).toHaveBeenCalledWith({
        where: { id: "meeting-1" },
        include: { summary: true },
      });
    });

    it("should throw NotFoundError if meeting does not exist", async () => {
      vi.mocked(prisma.meeting.findUnique).mockResolvedValue(null);

      await expect(
        service.getById("nonexistent", "user-1")
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError if user is not the organizer", async () => {
      vi.mocked(prisma.meeting.findUnique).mockResolvedValue({
        id: "meeting-1",
        organizerId: "other-user",
      } as never);

      await expect(
        service.getById("meeting-1", "user-1")
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("listUpcoming", () => {
    it("should only return future meetings ordered ascending", async () => {
      const now = new Date();
      const futureMeetings = [
        {
          id: "meeting-1",
          title: "Soon Meeting",
          scheduledAt: new Date(now.getTime() + 3600000),
          duration: 30,
          status: "SCHEDULED",
          organizerId: "user-1",
        },
        {
          id: "meeting-2",
          title: "Later Meeting",
          scheduledAt: new Date(now.getTime() + 7200000),
          duration: 60,
          status: "SCHEDULED",
          organizerId: "user-1",
        },
      ];
      vi.mocked(prisma.meeting.findMany).mockResolvedValue(futureMeetings as never);

      const result = await service.listUpcoming("user-1");

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe("Soon Meeting");
      expect(result[1].title).toBe("Later Meeting");
      expect(prisma.meeting.findMany).toHaveBeenCalledWith({
        where: {
          organizerId: "user-1",
          scheduledAt: { gt: expect.any(Date) },
        },
        orderBy: { scheduledAt: "asc" },
      });
    });
  });

  describe("storeSummary", () => {
    it("should create summary record and emit meeting.completed event", async () => {
      const mockMeeting = {
        id: "meeting-1",
        organizerId: "user-1",
        status: "SCHEDULED",
      };
      vi.mocked(prisma.meeting.findUnique).mockResolvedValue(mockMeeting as never);
      vi.mocked(prisma.meetingSummaryRecord.create).mockResolvedValue({
        id: "summary-1",
        meetingId: "meeting-1",
        overview: "Sprint review went well",
        decisions: ["Ship v2.0"],
        actionItems: [{ description: "Fix bug #42" }],
        createdAt: new Date(),
      } as never);
      vi.mocked(prisma.meeting.update).mockResolvedValue({
        ...mockMeeting,
        status: "COMPLETED",
      } as never);

      await service.storeSummary("meeting-1", "user-1", {
        overview: "Sprint review went well",
        decisions: ["Ship v2.0"],
        actionItems: [{ description: "Fix bug #42" }],
      });

      expect(prisma.meetingSummaryRecord.create).toHaveBeenCalledWith({
        data: {
          meetingId: "meeting-1",
          overview: "Sprint review went well",
          decisions: ["Ship v2.0"],
          actionItems: [{ description: "Fix bug #42" }],
        },
      });
      expect(prisma.meeting.update).toHaveBeenCalledWith({
        where: { id: "meeting-1" },
        data: { status: "COMPLETED" },
      });
      expect(eventBus.publish).toHaveBeenCalledWith({
        type: "meeting.completed",
        payload: { id: "meeting-1", meetingId: "meeting-1" },
      });
    });

    it("should throw NotFoundError if meeting does not exist", async () => {
      vi.mocked(prisma.meeting.findUnique).mockResolvedValue(null);

      await expect(
        service.storeSummary("nonexistent", "user-1", {
          overview: "test",
          decisions: [],
          actionItems: [],
        })
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError if user is not the organizer", async () => {
      vi.mocked(prisma.meeting.findUnique).mockResolvedValue({
        id: "meeting-1",
        organizerId: "other-user",
      } as never);

      await expect(
        service.storeSummary("meeting-1", "user-1", {
          overview: "test",
          decisions: [],
          actionItems: [],
        })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("createGoogleEvent", () => {
    it("should update meeting with meetUrl and googleEventId", async () => {
      const mockMeeting = {
        id: "meeting-1",
        organizerId: "user-1",
        status: "SCHEDULED",
      };
      vi.mocked(prisma.meeting.findUnique).mockResolvedValue(mockMeeting as never);
      vi.mocked(prisma.meeting.update).mockResolvedValue({
        ...mockMeeting,
        meetUrl: "https://meet.google.com/mock-abc-def",
        googleEventId: "some-event-id",
      } as never);

      const result = await service.createGoogleEvent("meeting-1", "user-1");

      expect(result.meetUrl).toMatch(/^https:\/\/meet\.google\.com\/mock-/);
      expect(prisma.meeting.update).toHaveBeenCalledWith({
        where: { id: "meeting-1" },
        data: {
          googleEventId: expect.any(String),
          meetUrl: expect.stringMatching(/^https:\/\/meet\.google\.com\/mock-/),
        },
      });
    });

    it("should throw NotFoundError if meeting does not exist", async () => {
      vi.mocked(prisma.meeting.findUnique).mockResolvedValue(null);

      await expect(
        service.createGoogleEvent("nonexistent", "user-1")
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError if user is not the organizer", async () => {
      vi.mocked(prisma.meeting.findUnique).mockResolvedValue({
        id: "meeting-1",
        organizerId: "other-user",
      } as never);

      await expect(
        service.createGoogleEvent("meeting-1", "user-1")
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw ExternalServiceError when all retries fail", async () => {
      const mockMeeting = {
        id: "meeting-1",
        organizerId: "user-1",
        status: "SCHEDULED",
      };
      vi.mocked(prisma.meeting.findUnique).mockResolvedValue(mockMeeting as never);
      vi.mocked(prisma.meeting.update).mockRejectedValue(
        new Error("Connection timeout")
      );

      await expect(
        service.createGoogleEvent("meeting-1", "user-1")
      ).rejects.toThrow(ExternalServiceError);
    }, 30000); // Increase timeout for retry delays
  });
});
