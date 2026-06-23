import prisma from "@/lib/db/prisma";
import type { AgentType } from "@/types/agents";

export interface AgentLogEntry {
  requestId: string;
  agent: AgentType | string;
  action: string;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  status: "success" | "error" | "timeout";
  tokensUsed?: number;
  latencyMs?: number;
  costEstimate?: number;
  userId: string;
}

/**
 * AgentLogger records structured logs of agent decisions and operations.
 * Stores entries in the AgentLog table via Prisma.
 */
export class AgentLogger {
  /**
   * Log an agent operation. Also checks for latency alerts.
   */
  async log(entry: AgentLogEntry): Promise<void> {
    await prisma.agentLog.create({
      data: {
        requestId: entry.requestId,
        agent: entry.agent,
        action: entry.action,
        input: entry.input as object,
        output: entry.output ? (entry.output as object) : undefined,
        status: entry.status,
        tokensUsed: entry.tokensUsed ?? null,
        latencyMs: entry.latencyMs ?? null,
        costEstimate: entry.costEstimate ?? null,
        userId: entry.userId,
      },
    });

    // Alert if latency exceeds 10 seconds
    if (entry.latencyMs && entry.latencyMs > 10000) {
      this.alertHighLatency(entry);
    }
  }

  /**
   * Get recent logs for a user with optional filtering.
   */
  async getLogs(userId: string, options?: { agent?: string; limit?: number }) {
    return prisma.agentLog.findMany({
      where: {
        userId,
        ...(options?.agent ? { agent: options.agent } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: options?.limit ?? 50,
    });
  }

  /**
   * Alert when agent latency exceeds threshold (>10s).
   * In production, this would integrate with Prometheus/alertmanager.
   */
  private alertHighLatency(entry: AgentLogEntry): void {
    console.warn(
      `[ALERT] High latency detected: agent=${entry.agent}, action=${entry.action}, latency=${entry.latencyMs}ms, requestId=${entry.requestId}`
    );
    // In production: push to Prometheus metrics or alerting system
    metricsCollector.recordLatencyAlert(entry.agent, entry.latencyMs!);
  }
}

/** Singleton instance */
export const agentLogger = new AgentLogger();

// ─── Metrics (Task 16.2) ─────────────────────────────────────────

/**
 * Simple metrics collector that accumulates values for Prometheus export.
 */
class MetricsCollector {
  private metrics: {
    agentLatencies: Array<{ agent: string; latencyMs: number; timestamp: Date }>;
    tokensUsed: Array<{ agent: string; tokens: number; timestamp: Date }>;
    costs: Array<{ agent: string; cost: number; timestamp: Date }>;
    latencyAlerts: Array<{ agent: string; latencyMs: number; timestamp: Date }>;
  } = {
    agentLatencies: [],
    tokensUsed: [],
    costs: [],
    latencyAlerts: [],
  };

  recordLatency(agent: string, latencyMs: number): void {
    this.metrics.agentLatencies.push({ agent, latencyMs, timestamp: new Date() });
  }

  recordTokens(agent: string, tokens: number): void {
    this.metrics.tokensUsed.push({ agent, tokens, timestamp: new Date() });
  }

  recordCost(agent: string, cost: number): void {
    this.metrics.costs.push({ agent, cost, timestamp: new Date() });
  }

  recordLatencyAlert(agent: string, latencyMs: number): void {
    this.metrics.latencyAlerts.push({ agent, latencyMs, timestamp: new Date() });
  }

  /**
   * Export metrics in Prometheus text format.
   */
  toPrometheusFormat(): string {
    const lines: string[] = [];

    // Latency histogram (simplified as gauge for now)
    lines.push("# HELP agent_latency_ms Agent response latency in milliseconds");
    lines.push("# TYPE agent_latency_ms gauge");
    const recentLatencies = this.metrics.agentLatencies.slice(-100);
    for (const m of recentLatencies) {
      lines.push(`agent_latency_ms{agent="${m.agent}"} ${m.latencyMs}`);
    }

    // Tokens counter
    lines.push("# HELP agent_tokens_total Total tokens consumed by agent");
    lines.push("# TYPE agent_tokens_total counter");
    const tokensByAgent = new Map<string, number>();
    for (const m of this.metrics.tokensUsed) {
      tokensByAgent.set(m.agent, (tokensByAgent.get(m.agent) || 0) + m.tokens);
    }
    for (const [agent, total] of tokensByAgent) {
      lines.push(`agent_tokens_total{agent="${agent}"} ${total}`);
    }

    // Cost counter
    lines.push("# HELP agent_cost_total Estimated cost in USD");
    lines.push("# TYPE agent_cost_total counter");
    const costsByAgent = new Map<string, number>();
    for (const m of this.metrics.costs) {
      costsByAgent.set(m.agent, (costsByAgent.get(m.agent) || 0) + m.cost);
    }
    for (const [agent, total] of costsByAgent) {
      lines.push(`agent_cost_total{agent="${agent}"} ${total.toFixed(6)}`);
    }

    // Latency alerts counter
    lines.push("# HELP agent_latency_alerts_total Number of high latency alerts");
    lines.push("# TYPE agent_latency_alerts_total counter");
    lines.push(`agent_latency_alerts_total ${this.metrics.latencyAlerts.length}`);

    return lines.join("\n");
  }
}

export const metricsCollector = new MetricsCollector();
