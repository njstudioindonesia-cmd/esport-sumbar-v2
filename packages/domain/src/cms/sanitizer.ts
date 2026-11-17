/**
 * Sanitizer Konten CMS & Teks Bebas XSS
 * Membersihkan input markdown/HTML dari tag berbahaya, event handler, dan protokol berisiko.
 */

const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  /on\w+\s*=\s*["'][^"']*["']/gi,
  /javascript\s*:/gi,
  /data\s*:\s*text\/html/gi,
  /vbscript\s*:/gi,
];

export function sanitizeContent(content: string): string {
  if (!content) return "";
  let clean = content;
  for (const pattern of DANGEROUS_PATTERNS) {
    clean = clean.replace(pattern, "");
  }
  return clean.trim();
}

export function sanitizeUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("data:")
  ) {
    return null;
  }
  // Hanya izinkan http://, https://, atau relative path /
  if (
    lower.startsWith("http://") ||
    lower.startsWith("https://") ||
    lower.startsWith("/")
  ) {
    return trimmed;
  }
  return null;
}
