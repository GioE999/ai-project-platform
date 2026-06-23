import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { noteService } from "@/lib/services/note.service";
import { withErrorHandler } from "@/lib/api/error-handler";

export const GET = withErrorHandler(async (request: Request) => {
  const user = await requireAuth(request);
  const graph = await noteService.getGraph(user.id);
  return NextResponse.json(graph);
});
