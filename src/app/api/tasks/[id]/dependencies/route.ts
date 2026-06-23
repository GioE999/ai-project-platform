import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { taskService } from "@/lib/services/task.service";
import { withErrorHandler } from "@/lib/api/error-handler";

export const POST = withErrorHandler(async (request: Request, context) => {
  const user = await requireAuth(request);
  const { id } = await context!.params;
  const { dependsOnId } = await request.json();
  await taskService.addDependency(id, dependsOnId, user.id);
  return NextResponse.json({ success: true }, { status: 201 });
});
