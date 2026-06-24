import { NextRequest, NextResponse } from "next/server";
import { knowledgeService } from "@/lib/services/knowledge.service";
import prisma from "@/lib/db/prisma";

const TEMP_USER_ID = "user_demo";

export async function GET() {
  try {
    const topics = await knowledgeService.getTopicsWithCounts(TEMP_USER_ID);
    return NextResponse.json(topics);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const topic = await (prisma as any).topic.create({
    data: {
      name: body.name,
      slug,
      icon: body.icon || "📌",
      color: body.color || null,
      lifeArea: body.lifeArea || "PERSONAL",
    },
  });
  return NextResponse.json(topic, { status: 201 });
}
