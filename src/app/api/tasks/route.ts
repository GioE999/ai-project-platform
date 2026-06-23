import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { taskService } from "@/lib/services/task.service";
import { withErrorHandler } from "@/lib/api/error-handler";

export const GET = withErrorHandler(async (request: Request) => {
  const user = await requireAuth(request);
  const url = new URL(request.url);
  const filters: Record<string, string | undefined> = {
    status: url.searchParams.get("status") || undefined,
    priority: url.searchParams.get("priority") || undefined,
    projectId: url.searchParams.get("projectId") || undefined,
    sortBy: url.searchParams.get("sortBy") || undefined,
    sortOrder: url.searchParams.get("sortOrder") || undefined,
  };
  // Remove undefined values
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined)
  );
  const tasks = await taskService.listByUser(
    user.id,
    Object.keys(cleanFilters).length ? cleanFilters as never : undefined
  );
  return NextResponse.json(tasks);
});

export const POST = withErrorHandler(async (request: Request) => {
  const user = await requireAuth(request);
  const body = await request.json();
  const task = await taskService.create(user.id, body);
  return NextResponse.json(task, { status: 201 });
});
