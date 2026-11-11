"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useQuality, useIsReducedMotion } from "./useQualityMode";

export interface GlassNumberCounterProps {
  value: number;
  label?: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  numberClassName?: string;
  labelClassName?: string;
}

export function GlassNumberCounter({
  value,
  label,
  prefix = "",
  suffix = "",
  duration = 1200,
  className,
  numberClassName,
  labelClassName,
}: GlassNumberCounterProps) {
  const quality = useQuality();
  const isReducedMotion = useIsReducedMotion();
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Jika reduced motion atau mode eco: langsung tampilkan nilai penuh tanpa kalkulasi RAF
    if (isReducedMotion || quality === "eco") {
      setCount(value);
      setHasAnimated(true);
      return;
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setCount(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Cubic ease out: 1 - (1 - progress)^3
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOut * value));

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(value);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.15 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [value, duration, hasAnimated, isReducedMotion, quality]);

  return (
    <div
      ref={elementRef}
      className={cn("flex flex-col items-center select-none", className)}
    >
      <span
        className={cn(
          "text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white tracking-tight tabular-nums",
          numberClassName
        )}
      >
        {prefix}
        {count.toLocaleString("id-ID")}
        {suffix}
      </span>
      {label && (
        <span
          className={cn(
            "text-xs sm:text-sm font-heading font-bold uppercase tracking-wider text-slate-400 mt-1",
            labelClassName
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}
