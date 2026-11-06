/**
 * Structured JSON Logger with Correlation ID (x-request-id)
 * Safe logging: sanitizes passwords, tokens, API keys, and private data.
 */

export interface LogContext {
  requestId?: string;
  userId?: string;
  action?: string;
  module?: string;
  [key: string]: unknown;
}

const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "secret",
  "authorization",
  "service_role",
  "apikey",
  "api_key",
  "ktp",
  "nik",
]);

function sanitize(obj: unknown, depth = 0): unknown {
  if (depth > 5) return "[MaxDepthReached]";
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitize(item, depth + 1));
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      result[key] = "[REDACTED]";
    } else {
      result[key] = sanitize(value, depth + 1);
    }
  }
  return result;
}

export const logger = {
  info(message: string, context?: LogContext): void {
    console.log(
      JSON.stringify({
        level: "INFO",
        timestamp: new Date().toISOString(),
        message,
        ...(context ? (sanitize(context) as object) : {}),
      })
    );
  },

  warn(message: string, context?: LogContext): void {
    console.warn(
      JSON.stringify({
        level: "WARN",
        timestamp: new Date().toISOString(),
        message,
        ...(context ? (sanitize(context) as object) : {}),
      })
    );
  },

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorDetails =
      error instanceof Error
        ? {
            errorName: error.name,
            errorMessage: error.message,
            stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
          }
        : { rawError: String(error) };

    console.error(
      JSON.stringify({
        level: "ERROR",
        timestamp: new Date().toISOString(),
        message,
        ...errorDetails,
        ...(context ? (sanitize(context) as object) : {}),
      })
    );
  },
};
