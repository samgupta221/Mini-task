import { NextResponse } from "next/server";
import type { ApiErrorBody } from "@/types/task";

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function errorResponse(error: unknown): NextResponse<ApiErrorBody> {
  if (error instanceof HttpError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  console.error("Unhandled API error:", error);
  return NextResponse.json(
    { error: "Something went wrong on the server. Please try again." },
    { status: 500 }
  );
}
