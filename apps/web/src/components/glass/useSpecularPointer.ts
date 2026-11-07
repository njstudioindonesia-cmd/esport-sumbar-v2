"use client";

import { useEffect, useRef, useCallback } from "react";

interface SpecularPointerOptions {
  enableTilt?: boolean;
}

export function useSpecularPointer<T extends HTMLElement = HTMLDivElement>(
  options: SpecularPointerOptions = {}
) {
  const ref = useRef<T>(null);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const py = Math.max(0, Math.min(100, (y / rect.height) * 100));

    el.style.setProperty("--mx", `${px.toFixed(1)}%`);
    el.style.setProperty("--my", `${py.toFixed(1)}%`);
  }, []);

  const handlePointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "0%");
  }, []);

  // Gyroscope / Device orientation fallback for mobile tilt
  useEffect(() => {
    if (!options.enableTilt || typeof window === "undefined") return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const el = ref.current;
      if (!el) return;

      const gamma = e.gamma || 0; // Left-to-Right (-90 to 90)
      const beta = e.beta || 0;   // Front-to-Back (-180 to 180)

      const px = Math.max(0, Math.min(100, 50 + (gamma / 45) * 50));
      const py = Math.max(0, Math.min(100, 50 + ((beta - 45) / 45) * 50));

      el.style.setProperty("--mx", `${px.toFixed(1)}%`);
      el.style.setProperty("--my", `${py.toFixed(1)}%`);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation, { passive: true });
    }

    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener("deviceorientation", handleOrientation);
      }
    };
  }, [options.enableTilt]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener("pointermove", handlePointerMove, { passive: true });
    el.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    return () => {
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [handlePointerMove, handlePointerLeave]);

  return ref;
}
