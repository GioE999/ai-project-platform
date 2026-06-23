import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { agentLogger } from "@/lib/agents/logger";
import { withErrorHandler } from "@/lib/api/error-handler";

export const GET = withErrorHandler(async (request: Request) => {
  const user = await requireAuth(request);
  const url = new URL(request.url);
  const agent = url.searchParams.get("agent") || undefined;
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const logs = await agentLogger.getLogs(user.id, { agent, limit });
  return NextResponse.json(logs);
});
