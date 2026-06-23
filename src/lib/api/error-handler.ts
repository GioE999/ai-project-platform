import { NextResponse } from "next/server";
import { DomainError } from "@/lib/errors";

/**
 * Wraps an API route handler with error handling.
 * Catches DomainError subclasses and returns appropriate HTTP responses.
 */
export function withErrorHandler(
  handler: (request: Request, context?: { params: Promise<Record<string, string>> }) => Promise<Response>
) {
  return async (request: Request, context?: { params: Promise<Record<string, string>> }) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof DomainError) {
        return NextResponse.json(error.toJSON(), { status: error.statusCode });
      }
      console.error("[API Error]", error);
      return NextResponse.json(
        { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  };
}
