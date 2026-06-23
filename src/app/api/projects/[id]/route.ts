import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { projectService } from "@/lib/services/project.service";
import { withErrorHandler } from "@/lib/api/error-handler";

export const GET = withErrorHandler(async (request: Request, context) => {
  const user = await requireAuth(request);
  const { id } = await context!.params;
  const project = await projectService.getById(id, user.id);
  return NextResponse.json(project);
});

export const PATCH = withErrorHandler(async (request: Request, context) => {
  const user = await requireAuth(request);
  const { id } = await context!.params;
  const body = await request.json();
  const project = await projectService.update(id, user.id, body);
  return NextResponse.json(project);
});

export const DELETE = withErrorHandler(async (request: Request, context) => {
  const user = await requireAuth(request);
  const { id } = await context!.params;
  const url = new URL(request.url);
  const deleteTasks = url.searchParams.get("deleteTasks") === "true";
  await projectService.delete(id, user.id, { deleteTasks });
  return new NextResponse(null, { status: 204 });
});
