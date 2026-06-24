import { NextRequest, NextResponse } from "next/server";
import { knowledgeService } from "@/lib/services/knowledge.service";

const TEMP_USER_ID = "user_demo";

export async function GET(req: NextRequest) {
  const topicId = new URL(req.url).searchParams.get("topicId") || undefined;
  const graph = await knowledgeService.getKnowledgeGraph(TEMP_USER_ID, topicId);
  return NextResponse.json(graph);
}
