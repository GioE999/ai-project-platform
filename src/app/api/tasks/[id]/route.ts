import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { taskService } from "@/lib/services/task.service";
import { withErrorHandler } from "@/lib/api/error-handler";

export const GET = withErrorHandler(async (request: Request, context) => {
  const user = await requireAuth(request);
  const { id } = await context!.params;
  const task = await taskService.getById(id, user.id);
  return NextResponse.json(task);
});

export const PATCH = withErrorHandler(async (request: Request, context) => {
  const user = await requireAuth(request);
  const { id } = await context!.params;
  const body = await request.json();
  const task = await taskService.update(id, user.id, body);
  return NextResponse.json(task);
});

export const DELETE = withErrorHandler(async (request: Request, context) => {
  const user = await requireAuth(request);
  const { id } = await context!.params;
  await taskService.delete(id, user.id);
  return new NextResponse(null, { status: 204 });
});
