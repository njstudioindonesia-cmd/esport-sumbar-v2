"use client";

import { useState, useEffect, useCallback } from "react";

export type QualityMode = "full" | "standard" | "eco";

const STORAGE_KEY = "esport-sumbar-quality-mode";

/**
 * Deteksi kapabilitas perangkat dan preferensi sistem secara otomatis
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
  const connection = (navigator as any).connection;
  if (connection?.saveData) {
    return "eco";
  }

  // 3. Kapabilitas CPU & Memori
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as any).deviceMemory || 4;
  if (cores < 4 || memory < 4) {
    return "standard";
  }

  return "full";
}

export function useQualityMode() {
  const [quality, setQualityState] = useState<QualityMode>("full");
  const [isAutoDetected, setIsAutoDetected] = useState(true);
  const [fps, setFps] = useState<number>(60);

  // Inisialisasi preferensi saat mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as QualityMode | null;
      if (saved && (saved === "full" || saved === "standard" || saved === "eco")) {
        setQualityState(saved);
        setIsAutoDetected(false);
        document.documentElement.dataset.quality = saved;
      } else {
        const detected = detectOptimalQuality();
        setQualityState(detected);
        setIsAutoDetected(true);
        document.documentElement.dataset.quality = detected;
      }
    } catch {
      // localStorage mungkin dibatasi oleh sandbox
      const detected = detectOptimalQuality();
      setQualityState(detected);
      document.documentElement.dataset.quality = detected;
    }
  }, []);

  const setQualityMode = useCallback((newMode: QualityMode, isUserAction: boolean = true) => {
    setQualityState(newMode);
    if (typeof document !== "undefined") {
      document.documentElement.dataset.quality = newMode;
    }
    if (isUserAction) {
      try {
        localStorage.setItem(STORAGE_KEY, newMode);
        setIsAutoDetected(false);
      } catch {
        // Ignored
      }
    }
  }, []);

  // Pemantau FPS ringan (Jank detector)
  useEffect(() => {
    if (typeof window === "undefined" || quality === "eco") return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;
    let lowFpsCount = 0;

    const measureFps = (now: number) => {
      frameCount++;
      const delta = now - lastTime;

      if (delta >= 1000) {
        const currentFps = Math.round((frameCount * 1000) / delta);
        setFps(currentFps);

        // Jika FPS turun di bawah 35 selama 3 detik berturut-turut pada mode otomatis
        if (currentFps < 35 && isAutoDetected) {
          lowFpsCount++;
          if (lowFpsCount >= 3) {
            console.info("FPS rendah terdeteksi; menurunkan mode liquid glass ke 'eco' secara otomatis.");
            setQualityMode("eco", false);
          }
        } else {
          lowFpsCount = 0;
        }

        frameCount = 0;
        lastTime = now;
      }

      animationFrameId = requestAnimationFrame(measureFps);
    };

    animationFrameId = requestAnimationFrame(measureFps);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [quality, isAutoDetected, setQualityMode]);

  return {
    quality,
    setQualityMode,
    isAutoDetected,
    fps,
  };
}
