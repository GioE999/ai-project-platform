import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { noteService } from "@/lib/services/note.service";
import { withErrorHandler } from "@/lib/api/error-handler";

export const GET = withErrorHandler(async (request: Request, context) => {
  const user = await requireAuth(request);
  const { id } = await context!.params;
  const note = await noteService.getById(id, user.id);
  return NextResponse.json(note);
});

export const PATCH = withErrorHandler(async (request: Request, context) => {
  const user = await requireAuth(request);
  const { id } = await context!.params;
  const body = await request.json();
  const note = await noteService.update(id, user.id, body);
  return NextResponse.json(note);
});

export const DELETE = withErrorHandler(async (request: Request, context) => {
  const user = await requireAuth(request);
  const { id } = await context!.params;
  await noteService.delete(id, user.id);
  return new NextResponse(null, { status: 204 });
});
