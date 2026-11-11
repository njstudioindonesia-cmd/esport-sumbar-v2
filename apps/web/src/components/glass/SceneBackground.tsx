"use client";

import React, { useEffect, useState, useRef } from "react";
import { useQuality, useIsReducedMotion } from "./useQualityMode";

interface SceneBackgroundProps {
  className?: string;
  intensity?: "subtle" | "normal" | "vibrant";
  interactive?: boolean;
}

export function SceneBackground({
  className = "",
  intensity = "normal",
}: SceneBackgroundProps) {
  const quality = useQuality();
  const isReducedMotion = useIsReducedMotion();
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [isIntersecting, setIsIntersecting] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Pantau apakah tab aktif agar animasi hemat baterai
  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // 2. Pantau IntersectionObserver agar scene di-pause bila offscreen
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setIsIntersecting(entries[0]?.isIntersecting ?? true);
      },
      { threshold: 0.05 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const shouldAnimate = quality === "full" && isTabVisible && isIntersecting && !isReducedMotion;

  const pinkOpacity =
    intensity === "subtle" ? "opacity-25" : intensity === "vibrant" ? "opacity-55" : "opacity-40";

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none -z-50 overflow-hidden bg-[#03031A] ${className}`}
    >
      {/* Deep Navy Radial Base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,2,81,0.5),rgba(3,3,26,1))]" />

      {/* Mode Hemat / Reduced Motion: Tampilkan bentuk statis tanpa animasi */}
      {quality === "eco" || isReducedMotion ? (
        <>
          <div
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(255,23,82,0.12) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute top-1/2 -right-32 w-[32rem] h-[32rem] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(0,0,79,0.3) 0%, transparent 70%)",
            }}
          />
        </>
      ) : (
        <>
          {/* Bentuk Cair 1: Brand Pink Primary Bulb (Zero-blur GPU radial gradient) */}
          <div
            className={`absolute -top-24 -left-24 w-[36rem] h-[36rem] rounded-full pointer-events-none ${pinkOpacity} ${
              shouldAnimate ? "animate-[pulse_10s_ease-in-out_infinite]" : ""
            }`}
            style={{
              background: "radial-gradient(circle, rgba(255,23,82,0.35) 0%, rgba(255,77,119,0.15) 35%, transparent 70%)",
            }}
          />

          {/* Bentuk Cair 2: Deep Navy/Indigo Secondary Glow (Zero-blur GPU radial gradient) */}
          <div
            className={`absolute top-1/3 -right-28 w-[40rem] h-[40rem] rounded-full pointer-events-none opacity-70 ${
              shouldAnimate ? "animate-[pulse_14s_ease-in-out_infinite_reverse]" : ""
            }`}
            style={{
              background: "radial-gradient(circle, rgba(0,0,79,0.65) 0%, rgba(26,16,64,0.3) 40%, transparent 70%)",
            }}
          />

          {/* Bentuk Cair 3: Soft Ambient Center Floating Light (Zero-blur GPU radial gradient) */}
          <div
            className={`absolute bottom-[-10%] left-1/3 w-[30rem] h-[30rem] rounded-full pointer-events-none opacity-40 ${
              shouldAnimate ? "animate-[pulse_12s_ease-in-out_infinite]" : ""
            }`}
            style={{
              background: "radial-gradient(circle, rgba(255,23,82,0.15) 0%, transparent 65%)",
            }}
          />

          {/* Micro Grid Specular Dot Matrix Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
        </>
      )}
    </div>
  );
}
