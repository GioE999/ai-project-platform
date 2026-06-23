import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { conversationService } from "@/lib/services/conversation.service";
import { withErrorHandler } from "@/lib/api/error-handler";

export const GET = withErrorHandler(async (request: Request, context) => {
  await requireAuth(request);
  const { id } = await context!.params;
  const thread = await conversationService.getThread(id);
  return NextResponse.json(thread);
});
