import { NextRequest, NextResponse } from "next/server";
import { knowledgeService } from "@/lib/services/knowledge.service";

const TEMP_USER_ID = "user_demo";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ecosystem = await knowledgeService.getTopicEcosystem(id, TEMP_USER_ID);
  return NextResponse.json(ecosystem);
}
