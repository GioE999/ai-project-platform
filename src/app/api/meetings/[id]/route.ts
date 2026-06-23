import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { meetingService } from "@/lib/services/meeting.service";
import { withErrorHandler } from "@/lib/api/error-handler";

export const GET = withErrorHandler(async (request: Request, context) => {
  const user = await requireAuth(request);
  const { id } = await context!.params;
  const meeting = await meetingService.getById(id, user.id);
  return NextResponse.json(meeting);
});
