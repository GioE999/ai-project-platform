import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { taskService } from "@/lib/services/task.service";
import { withErrorHandler } from "@/lib/api/error-handler";

export const DELETE = withErrorHandler(async (request: Request, context) => {
  const user = await requireAuth(request);
  const { id, depId } = await context!.params;
  await taskService.removeDependency(id, depId, user.id);
  return new NextResponse(null, { status: 204 });
});
