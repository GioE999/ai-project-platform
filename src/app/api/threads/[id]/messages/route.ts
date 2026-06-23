import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { conversationService } from "@/lib/services/conversation.service";
import { withErrorHandler } from "@/lib/api/error-handler";

export const GET = withErrorHandler(async (request: Request, context) => {
  await requireAuth(request);
  const { id } = await context!.params;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const messages = await conversationService.getMessages(id, { page, limit });
  return NextResponse.json(messages);
});

export const POST = withErrorHandler(async (request: Request, context) => {
  const user = await requireAuth(request);
  const { id } = await context!.params;
  const body = await request.json();
  const message = await conversationService.postMessage(id, {
    ...body,
    authorId: user.id,
    authorType: "user",
  });
  return NextResponse.json(message, { status: 201 });
});
