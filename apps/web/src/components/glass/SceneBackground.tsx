"use client";

import React, { useEffect, useState } from "react";
import { useQualityMode } from "./useQualityMode";

interface SceneBackgroundProps {
  className?: string;
  intensity?: "subtle" | "normal" | "vibrant";
  interactive?: boolean;
}

export function SceneBackground({
  className = "",
  intensity = "normal",
  interactive = true,
}: SceneBackgroundProps) {
  const { quality } = useQualityMode();
  const [isTabVisible, setIsTabVisible] = useState(true);

  // Pantau apakah tab aktif agar animasi hemat baterai
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

  const shouldAnimate = quality === "full" && isTabVisible;

  const pinkOpacity =
    intensity === "subtle" ? "opacity-25" : intensity === "vibrant" ? "opacity-55" : "opacity-40";

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none -z-50 overflow-hidden bg-[#03031A] ${className}`}
    >
      {/* Deep Navy Radial Base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,2,81,0.5),rgba(3,3,26,1))]" />

      {/* Mode Hemat: Tampilkan bentuk statis tanpa animasi */}
      {quality === "eco" ? (
        <>
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-pink-600/10 blur-[100px]" />
          <div className="absolute top-1/2 -right-32 w-[32rem] h-[32rem] rounded-full bg-indigo-950/20 blur-[120px]" />
        </>
      ) : (
        <>
          {/* Bentuk Cair 1: Brand Pink Primary Bulb */}
          <div
            className={`absolute -top-24 -left-24 w-[36rem] h-[36rem] rounded-full bg-gradient-to-tr from-[#FF1752] to-[#FF4D77] blur-[120px] ${pinkOpacity} ${
              shouldAnimate ? "animate-[pulse_10s_ease-in-out_infinite]" : ""
            }`}
          />

          {/* Bentuk Cair 2: Deep Navy/Indigo Secondary Glow */}
          <div
            className={`absolute top-1/3 -right-28 w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-[#00004F] via-[#1A1040] to-[#0A0A2E] blur-[140px] opacity-70 ${
              shouldAnimate ? "animate-[pulse_14s_ease-in-out_infinite_reverse]" : ""
            }`}
          />

          {/* Bentuk Cair 3: Soft Ambient Center Floating Light */}
          <div
            className={`absolute bottom-[-10%] left-1/3 w-[30rem] h-[30rem] rounded-full bg-gradient-to-t from-[#FF1752]/15 via-transparent to-transparent blur-[110px] ${
              shouldAnimate ? "animate-[pulse_12s_ease-in-out_infinite]" : ""
            }`}
          />

          {/* Micro Grid Specular Dot Matrix Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
        </>
      )}
    </div>
  );
}
