import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { taskService } from "@/lib/services/task.service";
import { withErrorHandler } from "@/lib/api/error-handler";

export const PATCH = withErrorHandler(async (request: Request, context) => {
  const user = await requireAuth(request);
  const { id } = await context!.params;
  const { status } = await request.json();
  const task = await taskService.updateStatus(id, user.id, status);
  return NextResponse.json(task);
});
