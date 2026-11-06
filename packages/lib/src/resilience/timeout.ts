export class TimeoutError extends Error {
  public readonly timeoutMs: number;
  public readonly operationName: string;

  constructor(timeoutMs: number, operationName = "Operation") {
    super(`${operationName} timed out after ${timeoutMs}ms`);
    this.name = "TimeoutError";
    this.timeoutMs = timeoutMs;
    this.operationName = operationName;
  }
}

/**
 * Membungkus promise dengan batas waktu maksimal (timeout).
 * Melempar TimeoutError jika operasi melebihi durasi timeoutMs.
 */
export async function withTimeout<T>(
  promiseOrFn: Promise<T> | (() => Promise<T>),
  timeoutMs: number,
  operationName = "Operation"
): Promise<T> {
  if (timeoutMs <= 0 || !Number.isFinite(timeoutMs)) {
    return typeof promiseOrFn === "function" ? promiseOrFn() : promiseOrFn;
  }

  let timer: NodeJS.Timeout | null = null;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new TimeoutError(timeoutMs, operationName));
    }, timeoutMs);
  });

  const executionPromise = typeof promiseOrFn === "function" ? promiseOrFn() : promiseOrFn;

  try {
    return await Promise.race([executionPromise, timeoutPromise]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}
