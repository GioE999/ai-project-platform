import type { AgentRequest, AgentResponse } from "@/types/agents";
import { AgentError } from "@/lib/errors";

const AGENT_SERVICE_URL =
  process.env.AGENT_SERVICE_URL || "http://localhost:8000";

/**
 * HTTP client for communicating with the Python agent service.
 */
export class AgentClient {
  private baseUrl: string;

  constructor(baseUrl: string = AGENT_SERVICE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Send a chat request to the agent service.
   */
  async chat(request: AgentRequest): Promise<AgentResponse> {
    const response = await fetch(`${this.baseUrl}/agents/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: request.id,
        user_id: request.userId,
        input: request.input,
        context: {
          thread_id: request.context.threadId,
          project_id: request.context.projectId,
          task_id: request.context.taskId,
          note_id: request.context.noteId,
          meeting_id: request.context.meetingId,
        },
        target_agent: request.targetAgent,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new AgentError(`Agent service error: ${error}`, "root");
    }

    const data = await response.json();

    return {
      id: data.id,
      requestId: data.request_id,
      agent: data.agent,
      content: data.content,
      actions: data.actions.map(
        (a: { type: string; payload: Record<string, unknown>; result?: unknown }) => ({
          type: a.type,
          payload: a.payload,
          result: a.result,
        })
      ),
      metadata: {
        tokensUsed: data.metadata.tokens_used,
        latencyMs: data.metadata.latency_ms,
        cost: data.metadata.cost,
      },
    };
  }

  /**
   * Get a streaming response from the agent service via SSE.
   * Returns an async iterator of partial responses.
   */
  async *chatStream(requestId: string): AsyncGenerator<string> {
    const response = await fetch(
      `${this.baseUrl}/agents/chat/${requestId}/stream`
    );

    if (!response.ok || !response.body) {
      throw new AgentError("Failed to establish SSE stream", "root");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            yield line.slice(6);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Health check for the agent service.
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

/** Singleton instance */
export const agentClient = new AgentClient();
