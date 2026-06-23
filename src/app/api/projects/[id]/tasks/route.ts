import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { projectService } from "@/lib/services/project.service";
import { withErrorHandler } from "@/lib/api/error-handler";

export const POST = withErrorHandler(async (request: Request, context) => {
  const user = await requireAuth(request);
  const { id } = await context!.params;
  const { taskId } = await request.json();
  await projectService.addTask(id, taskId, user.id);
  return NextResponse.json({ success: true }, { status: 201 });
});
