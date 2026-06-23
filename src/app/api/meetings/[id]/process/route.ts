import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { meetingService } from "@/lib/services/meeting.service";
import { withErrorHandler } from "@/lib/api/error-handler";

export const POST = withErrorHandler(async (request: Request, context) => {
  const user = await requireAuth(request);
  const { id } = await context!.params;
  const body = await request.json();
  await meetingService.storeSummary(id, user.id, body);
  return NextResponse.json({ success: true });
});
