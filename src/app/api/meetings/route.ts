import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { meetingService } from "@/lib/services/meeting.service";
import { withErrorHandler } from "@/lib/api/error-handler";

export const GET = withErrorHandler(async (request: Request) => {
  const user = await requireAuth(request);
  const meetings = await meetingService.listByUser(user.id);
  return NextResponse.json(meetings);
});

export const POST = withErrorHandler(async (request: Request) => {
  const user = await requireAuth(request);
  const body = await request.json();
  const meeting = await meetingService.create(user.id, body);
  return NextResponse.json(meeting, { status: 201 });
});
