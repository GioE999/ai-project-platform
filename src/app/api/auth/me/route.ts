import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { withErrorHandler } from "@/lib/api/error-handler";

export const GET = withErrorHandler(async (request: Request) => {
  const user = await requireAuth(request);
  return NextResponse.json(user);
});
