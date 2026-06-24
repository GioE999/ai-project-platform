import { NextRequest, NextResponse } from "next/server";
import { knowledgeService } from "@/lib/services/knowledge.service";

const TEMP_USER_ID = "user_demo";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const note = await knowledgeService.getNoteById(id, TEMP_USER_ID);
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(note);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const note = await knowledgeService.updateNote(id, TEMP_USER_ID, body);
  return NextResponse.json(note);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await knowledgeService.deleteNote(id, TEMP_USER_ID);
  return NextResponse.json({ ok: true });
}
