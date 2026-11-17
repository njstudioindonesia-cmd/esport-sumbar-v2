import crypto from "crypto";

export interface RevalidationPayload {
  tags: string[];
  timestamp: number;
}

/**
 * Menghasilkan tanda tangan HMAC-SHA256 untuk memvalidasi permintaan webhook revalidasi cache
 * antara Admin Portal dan Web Utama.
 */
export function generateRevalidationSignature(
  payload: RevalidationPayload,
  secret: string
): string {
  const data = `${payload.tags.sort().join(",")}:${payload.timestamp}`;
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

/**
 * Memverifikasi tanda tangan HMAC-SHA256 dan memastikan timestamp masih berada dalam
 * jendela toleransi anti-replay (default 300 detik / 5 menit).
 */
export function verifyRevalidationSignature(
  payload: RevalidationPayload,
  signature: string,
  secret: string,
  maxAgeSeconds: number = 300
): { valid: boolean; reason?: string } {
  const now = Math.floor(Date.now() / 1000);
  const age = Math.abs(now - payload.timestamp);

  if (age > maxAgeSeconds) {
    return { valid: false, reason: "Timestamp kedaluwarsa atau terjadi replay attack" };
  }

  const expectedSignature = generateRevalidationSignature(payload, secret);
  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expectedSignature, "hex")
  );

  return { valid: isValid, reason: isValid ? undefined : "Tanda tangan HMAC tidak cocok" };
}
