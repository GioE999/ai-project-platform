import { NextRequest, NextResponse } from "next/server";
import { knowledgeService } from "@/lib/services/knowledge.service";

const TEMP_USER_ID = "user_demo";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") as any;
  const topicId = searchParams.get("topicId") || undefined;
  const status = searchParams.get("status") as any;
  const search = searchParams.get("search") || undefined;

  const notes = await knowledgeService.listByUser(TEMP_USER_ID, { type, topicId, status, search });
  return NextResponse.json(notes);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const note = await knowledgeService.createNote(TEMP_USER_ID, body);
  return NextResponse.json(note, { status: 201 });
}
