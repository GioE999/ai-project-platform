import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { noteService } from "@/lib/services/note.service";
import { withErrorHandler } from "@/lib/api/error-handler";

export const GET = withErrorHandler(async (request: Request) => {
  const user = await requireAuth(request);
  const url = new URL(request.url);
  const filters: Record<string, string | undefined> = {
    search: url.searchParams.get("search") || undefined,
    sortBy: url.searchParams.get("sortBy") || undefined,
    sortOrder: url.searchParams.get("sortOrder") || undefined,
  };
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined)
  );
  const notes = await noteService.listByUser(
    user.id,
    Object.keys(cleanFilters).length ? cleanFilters as never : undefined
  );
  return NextResponse.json(notes);
});

export const POST = withErrorHandler(async (request: Request) => {
  const user = await requireAuth(request);
  const body = await request.json();
  const note = await noteService.create(user.id, body);
  return NextResponse.json(note, { status: 201 });
});
