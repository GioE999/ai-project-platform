import { NextResponse } from "next/server";
import { metricsCollector } from "@/lib/agents/logger";

/**
 * GET /api/metrics
 * Exposes metrics in Prometheus text format for integration with Grafana.
 */
export async function GET() {
  const body = metricsCollector.toPrometheusFormat();

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
