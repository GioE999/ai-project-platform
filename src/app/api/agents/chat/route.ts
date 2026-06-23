import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { agentClient } from "@/lib/agents/agent-client";
import { agentLogger } from "@/lib/agents/logger";
import { withErrorHandler } from "@/lib/api/error-handler";

export const POST = withErrorHandler(async (request: Request) => {
  const user = await requireAuth(request);
  const body = await request.json();

  const agentRequest = {
    id: crypto.randomUUID(),
    userId: user.id,
    input: body.input,
    context: body.context || {},
    targetAgent: body.targetAgent,
  };

  const response = await agentClient.chat(agentRequest);

  // Log the agent operation
  await agentLogger.log({
    requestId: agentRequest.id,
    agent: response.agent,
    action: "chat",
    input: { input: body.input, context: body.context },
    output: { content: response.content, actions: response.actions },
    status: "success",
    tokensUsed: response.metadata.tokensUsed,
    latencyMs: response.metadata.latencyMs,
    costEstimate: response.metadata.cost,
    userId: user.id,
  });

  return NextResponse.json(response);
});
