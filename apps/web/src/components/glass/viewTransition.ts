/**
 * ESPORT SUMBAR V3: Utilitas View Transitions API dengan Fallback
 * Memungkinkan transisi halus antar-state visual jika didukung peramban.
 * Mengikuti preferensi prefers-reduced-motion dan menyediakan fallback langsung jika tidak didukung.
 */

export function executeViewTransition(callback: () => void | Promise<void>): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    callback();
    return;
  }

  // Hormati reduced motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    callback();
    return;
  }

  // Gunakan document.startViewTransition bila tersedia
  const docWithTransition = document as unknown as {
    startViewTransition?: (cb: () => void | Promise<void>) => {
      finished: Promise<void>;
      ready: Promise<void>;
      updateCallbackDone: Promise<void>;
    };
  };

  if (typeof docWithTransition.startViewTransition === "function") {
    try {
      docWithTransition.startViewTransition(callback);
    } catch {
      // Fallback jika pemanggilan gagal di tengah proses
      callback();
    }
  } else {
    // Fallback bagi peramban tanpa native view transitions API
    callback();
  }
}
