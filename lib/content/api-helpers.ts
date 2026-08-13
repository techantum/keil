import { NextResponse } from "next/server";
import { isDbConnectionError } from "@/lib/db/db-error";

export function contentErrorResponse(
  error: unknown,
  emptyPayload: Record<string, unknown>,
) {
  if (isDbConnectionError(error)) {
    return NextResponse.json(emptyPayload);
  }
  console.error(error);
  return NextResponse.json(
    { error: "Failed to fetch content" },
    { status: 500 },
  );
}
