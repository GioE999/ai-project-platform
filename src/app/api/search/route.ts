import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { embeddingService } from "@/lib/embeddings/embedding.service";
import { withErrorHandler } from "@/lib/api/error-handler";

export const POST = withErrorHandler(async (request: Request) => {
  await requireAuth(request);
  const { query, entityTypes, limit, threshold } = await request.json();
  const results = await embeddingService.search(query, { entityTypes, limit, threshold });
  return NextResponse.json(results);
});
