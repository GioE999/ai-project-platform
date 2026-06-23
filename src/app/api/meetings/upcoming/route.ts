import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { meetingService } from "@/lib/services/meeting.service";
import { withErrorHandler } from "@/lib/api/error-handler";

export const GET = withErrorHandler(async (request: Request) => {
  const user = await requireAuth(request);
  const meetings = await meetingService.listUpcoming(user.id);
  return NextResponse.json(meetings);
});
