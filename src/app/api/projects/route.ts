import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { projectService } from "@/lib/services/project.service";
import { withErrorHandler } from "@/lib/api/error-handler";

export const GET = withErrorHandler(async (request: Request) => {
  const user = await requireAuth(request);
  const projects = await projectService.listByUser(user.id);
  return NextResponse.json(projects);
});

export const POST = withErrorHandler(async (request: Request) => {
  const user = await requireAuth(request);
  const body = await request.json();
  const project = await projectService.create(user.id, body);
  return NextResponse.json(project, { status: 201 });
});
