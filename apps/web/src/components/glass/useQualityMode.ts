"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";

export type QualityMode = "full" | "standard" | "eco";

const STORAGE_KEY = "esport-sumbar-quality-mode";

/**
 * Deteksi kapabilitas perangkat dan preferensi sistem secara otomatis.
 * Pada perangkat mobile atau spesifikasi menengah, default ke "standard"
 * agar performa rendering 60 FPS tetap mulus tanpa stutter.
 */
function detectOptimalQuality(): QualityMode {
  if (typeof window === "undefined") return "full";

  // 1. Preferensi Aksesibilitas
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reducedTransparency = window.matchMedia("(prefers-reduced-transparency: reduce)").matches;
  if (reducedMotion || reducedTransparency) {
    return "eco";
  }

  // 2. Penghemat Data
  const connection = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) {
    return "eco";
  }

  // 3. Kapabilitas CPU, Memori & Mobile Screen
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Pada mobile atau perangkat spesifikasi menengah, gunakan "standard" agar scrolling 60 FPS mentok
  if (isMobile || cores < 4 || memory < 4) {
    return "standard";
  }

  return "full";
}

// ============================================================================
// SINGLETON STORE (Mencegah 13+ RAF loops dan re-render idle setiap 1 detik)
// ============================================================================

let globalQuality: QualityMode = "full";
let globalIsAutoDetected = true;
let globalFps = 60;
let isStoreInitialized = false;

const qualityListeners = new Set<() => void>();
const fpsListeners = new Set<() => void>();

let fpsRafId: number | null = null;
let lastFpsTime = 0;
let frameCount = 0;
let lowFpsStreak = 0;

function notifyQualityChange() {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.quality = globalQuality;
  }
  qualityListeners.forEach((fn) => fn());
}

function notifyFpsChange() {
  fpsListeners.forEach((fn) => fn());
}

function initQualityStore() {
  if (isStoreInitialized || typeof window === "undefined") return;
  isStoreInitialized = true;

  try {
    const saved = localStorage.getItem(STORAGE_KEY) as QualityMode | null;
    if (saved && (saved === "full" || saved === "standard" || saved === "eco")) {
      globalQuality = saved;
      globalIsAutoDetected = false;
    } else {
      globalQuality = detectOptimalQuality();
      globalIsAutoDetected = true;
    }
  } catch {
    globalQuality = detectOptimalQuality();
    globalIsAutoDetected = true;
  }

  if (typeof document !== "undefined") {
    document.documentElement.dataset.quality = globalQuality;
  }
}

function startFpsMonitorIfNeeded() {
  if (typeof window === "undefined" || fpsRafId !== null || fpsListeners.size === 0) return;

  lastFpsTime = performance.now();
  frameCount = 0;

  const tick = (now: number) => {
    if (typeof document !== "undefined" && document.hidden) {
      fpsRafId = requestAnimationFrame(tick);
      return;
    }

    frameCount++;
    const delta = now - lastFpsTime;

    // Evaluasi FPS setiap 1.5 detik agar sangat hemat CPU
    if (delta >= 1500) {
      const calculatedFps = Math.min(120, Math.round((frameCount * 1000) / delta));
      globalFps = calculatedFps;
      notifyFpsChange();

      // Degradasi bertingkat otomatis jika terjadi low FPS berulang
      if (globalIsAutoDetected) {
        if (globalQuality === "full" && calculatedFps < 40) {
          lowFpsStreak++;
          if (lowFpsStreak >= 2) {
            globalQuality = "standard";
            notifyQualityChange();
            lowFpsStreak = 0;
          }
        } else if (globalQuality === "standard" && calculatedFps < 30) {
          lowFpsStreak++;
          if (lowFpsStreak >= 2) {
            globalQuality = "eco";
            notifyQualityChange();
            lowFpsStreak = 0;
          }
        } else {
          lowFpsStreak = 0;
        }
      }

      frameCount = 0;
      lastFpsTime = now;
    }

    if (fpsListeners.size > 0) {
      fpsRafId = requestAnimationFrame(tick);
    } else {
      fpsRafId = null;
    }
  };

  fpsRafId = requestAnimationFrame(tick);
}

function stopFpsMonitorIfNoListeners() {
  if (fpsListeners.size === 0 && fpsRafId !== null) {
    cancelAnimationFrame(fpsRafId);
    fpsRafId = null;
  }
}

/**
 * Hook khusus untuk komponen yang HANYA membutuhkan `quality`
 * (ScrollReveal, GlassNumberCounter, SceneBackground, dll).
 * Komponen ini TIDAK AKAN re-render setiap detik saat FPS berubah!
 */
export function useQuality(): QualityMode {
  useEffect(() => {
    initQualityStore();
  }, []);

  return useSyncExternalStore<QualityMode>(
    (onStoreChange) => {
      qualityListeners.add(onStoreChange);
      return () => {
        qualityListeners.delete(onStoreChange);
      };
    },
    () => globalQuality,
    () => "full" as QualityMode
  );
}

/**
 * Hook utama Liquid Glass Quality Mode.
 * Digunakan oleh UI kontrol pengaturan (Footer, Laboratory, Settings).
 */
export function useQualityMode() {
  useEffect(() => {
    initQualityStore();
  }, []);

  const quality = useSyncExternalStore<QualityMode>(
    (onStoreChange) => {
      qualityListeners.add(onStoreChange);
      return () => {
        qualityListeners.delete(onStoreChange);
      };
    },
    () => globalQuality,
    () => "full" as QualityMode
  );

  const fps = useSyncExternalStore(
    (onStoreChange) => {
      fpsListeners.add(onStoreChange);
      startFpsMonitorIfNeeded();
      return () => {
        fpsListeners.delete(onStoreChange);
        stopFpsMonitorIfNoListeners();
      };
    },
    () => globalFps,
    () => 60
  );

  const setQualityMode = useCallback((newMode: QualityMode, isUserAction: boolean = true) => {
    globalQuality = newMode;
    if (isUserAction) {
      globalIsAutoDetected = false;
      try {
        localStorage.setItem(STORAGE_KEY, newMode);
      } catch {
        // Ignored
      }
    }
    notifyQualityChange();
  }, []);

  return {
    quality,
    setQualityMode,
    isAutoDetected: globalIsAutoDetected,
    fps,
  };
}

/**
 * Hook bantuan untuk memeriksa preferensi reduced-motion
 */
export function useIsReducedMotion(): boolean {
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReduced(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsReduced(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return isReduced;
}
