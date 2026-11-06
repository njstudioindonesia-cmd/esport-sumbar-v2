import { DirectorySearchOptions } from "./types";

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  tags: Set<string>;
}

class DirectoryCacheStore {
  private store = new Map<string, CacheEntry<any>>();
  private tagIndex = new Map<string, Set<string>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (performance.now() > entry.expiresAt) {
      this.delete(key);
      return null;
    }

    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlSeconds = 60, tags: string[] = []): void {
    const expiresAt = performance.now() + ttlSeconds * 1000;
    const tagSet = new Set(tags);

    this.store.set(key, { value, expiresAt, tags: tagSet });

    for (const tag of tags) {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(key);
    }
  }

  delete(key: string): void {
    const entry = this.store.get(key);
    if (entry) {
      for (const tag of entry.tags) {
        this.tagIndex.get(tag)?.delete(key);
      }
      this.store.delete(key);
    }
  }

  invalidateTag(tag: string): number {
    const keys = this.tagIndex.get(tag);
    if (!keys) return 0;

    let count = 0;
    for (const key of Array.from(keys)) {
      this.delete(key);
      count++;
    }
    this.tagIndex.delete(tag);
    return count;
  }

  invalidateAll(): void {
    this.store.clear();
    this.tagIndex.clear();
  }

  size(): number {
    return this.store.size;
  }

  generateQueryKey(prefix: string, options: DirectorySearchOptions): string {
    const sorted = Object.entries(options)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join("|");
    return `${prefix}:${sorted}`;
  }
}

export const directoryCache = new DirectoryCacheStore();
