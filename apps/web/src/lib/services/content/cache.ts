/**
 * Penyimpan Cache Berbasis Tag untuk Layanan Konten (Content Cache V3)
 * Menggunakan waktu monotonik performance.now() untuk kepatuhan penuh
 * terhadap static prerendering Next.js 16 (menghindari galat Date.now() unstable value).
 */

interface CacheEntry<T> {
  data: T;
  tags: string[];
  expiresAt: number; // Monotonic expiry time
}

const contentCacheStore = new Map<string, CacheEntry<unknown>>();
const DEFAULT_CONTENT_TTL_MS = 60 * 1000; // 60 detik default TTL

/**
 * Mengambil data dari cache konten jika belum kedaluwarsa
 */
export function getContentCache<T>(key: string): T | null {
  const entry = contentCacheStore.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;

  if (performance.now() > entry.expiresAt) {
    contentCacheStore.delete(key);
    return null;
  }

  return entry.data;
}

/**
 * Menyimpan data ke cache konten dengan tag terkait
 */
export function setContentCache<T>(
  key: string,
  data: T,
  tags: string[] = [],
  ttlMs: number = DEFAULT_CONTENT_TTL_MS
): void {
  contentCacheStore.set(key, {
    data,
    tags,
    expiresAt: performance.now() + ttlMs,
  });
}

/**
 * Membatalkan (invalidate) entri cache yang memiliki tag yang cocok
 */
export function invalidateContentTags(tags: string[]): number {
  if (tags.length === 0) return 0;
  let count = 0;

  for (const [key, entry] of contentCacheStore.entries()) {
    const hasMatchingTag = entry.tags.some((t) => tags.includes(t));
    if (hasMatchingTag) {
      contentCacheStore.delete(key);
      count++;
    }
  }

  return count;
}

/**
 * Membersihkan seluruh isi cache konten
 */
export function clearContentCache(): void {
  contentCacheStore.clear();
}
