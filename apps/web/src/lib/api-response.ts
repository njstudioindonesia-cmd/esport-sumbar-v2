import { NextResponse } from "next/server";
import { CORRELATION_HEADER } from "@esport-sumbar/lib";

export interface ApiMeta {
  correlationId?: string;
  page?: number;
  pageSize?: number;
  hasMore?: boolean;
}

export function apiSuccess<T>(data: T, meta?: ApiMeta, status = 200) {
  const headers: Record<string, string> = {};
  if (meta?.correlationId) {
    headers[CORRELATION_HEADER] = meta.correlationId;
  }
  return NextResponse.json(
    {
      success: true,
      data,
      error: null,
      meta,
    },
    { status, headers }
  );
}

export function apiError(code: string, message: string, details?: unknown, status = 400, correlationId?: string) {
  const headers: Record<string, string> = {};
  if (correlationId) {
    headers[CORRELATION_HEADER] = correlationId;
  }
  return NextResponse.json(
    {
      success: false,
      data: null,
      error: { code, message, details },
      meta: correlationId ? { correlationId } : undefined,
    },
    { status, headers }
  );
}
