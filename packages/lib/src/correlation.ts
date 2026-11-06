import { randomUUID } from "crypto";

export const CORRELATION_HEADER = "x-request-id";

/**
 * Mengambil correlation ID (x-request-id) dari header permintaan masuk,
 * atau menghasilkan ID korelasi baru berformat unik berstandar W3C/RFC.
 */
export function getOrGenerateCorrelationId(headers?: Headers | Record<string, string | string[] | undefined>): string {
  if (!headers) {
    return `req-${randomUUID()}`;
  }

  let value: string | undefined;

  if (typeof (headers as Headers).get === "function") {
    value = (headers as Headers).get(CORRELATION_HEADER) || (headers as Headers).get("x-correlation-id") || undefined;
  } else {
    const raw = (headers as Record<string, any>)[CORRELATION_HEADER] || (headers as Record<string, any>)["x-correlation-id"];
    if (Array.isArray(raw)) {
      value = raw[0];
    } else if (typeof raw === "string") {
      value = raw;
    }
  }

  if (value && value.trim().length > 0) {
    return value.trim();
  }

  return `req-${randomUUID()}`;
}
