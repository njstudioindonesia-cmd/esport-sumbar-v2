import crypto from "crypto";

export interface ServiceTokenPayload {
  sub: string;
  iss: "esportsumbar-bff" | "esportsumbar-service";
  aud: "esportsumbar-internal" | "esportsumbar-services";
  exp: number; // Unix timestamp in seconds
  iat: number; // Unix timestamp in seconds
  roles?: string[];
  scopes?: string[];
}

const DEFAULT_SECRET = process.env.SERVICE_TOKEN_SECRET || process.env.SUPABASE_JWT_SECRET || "esport-sumbar-v3-internal-service-secret-2026";
const TOKEN_TTL_SECONDS = 300; // 5 menit (short-lived)

/**
 * Base64URL encode buffer/string
 */
function base64UrlEncode(data: string | Buffer): string {
  const buf = typeof data === "string" ? Buffer.from(data, "utf8") : data;
  return buf.toString("base64url");
}

/**
 * Base64URL decode string
 */
function base64UrlDecode(data: string): string {
  return Buffer.from(data, "base64url").toString("utf8");
}

/**
 * Menghasilkan token layanan internal berumur pendek (5 menit)
 * untuk komunikasi antar-layanan terisolasi (BFF -> Services).
 */
export function issueServiceToken(
  subject: string,
  scopes: string[] = ["internal:read", "internal:write"],
  ttlSeconds: number = TOKEN_TTL_SECONDS,
  customSecret?: string
): string {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload: ServiceTokenPayload = {
    sub: subject,
    iss: "esportsumbar-bff",
    aud: "esportsumbar-internal",
    iat: now,
    exp: now + ttlSeconds,
    roles: ["internal_service"],
    scopes,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const secret = customSecret || DEFAULT_SECRET;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(signatureInput)
    .digest("base64url");

  return `${signatureInput}.${signature}`;
}

/**
 * Memverifikasi integritas, tanda tangan, dan masa berlaku token layanan.
 */
export function verifyServiceToken(
  token: string,
  customSecret?: string
): { valid: boolean; payload?: ServiceTokenPayload; error?: string } {
  if (!token || typeof token !== "string") {
    return { valid: false, error: "Token tidak disediakan." };
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return { valid: false, error: "Format token tidak valid (wajib format JWT 3 bagian)." };
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const secret = customSecret || DEFAULT_SECRET;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(signatureInput)
    .digest("base64url");

  // Constant-time compare untuk mencegah timing attacks
  const sigBuffer = Buffer.from(signature);
  const expBuffer = Buffer.from(expectedSignature);
  if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
    return { valid: false, error: "Tanda tangan token tidak valid (signature mismatch)." };
  }

  try {
    const payload: ServiceTokenPayload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    // Periksa masa berlaku (expired)
    if (payload.exp && payload.exp < now) {
      return { valid: false, error: "Token layanan telah kedaluwarsa." };
    }

    // Periksa issuer & audience
    if (payload.iss !== "esportsumbar-bff" && payload.iss !== "esportsumbar-service") {
      return { valid: false, error: "Penerbit token (issuer) tidak dikenali." };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, error: "Payload token rusak atau bukan JSON valid." };
  }
}
