"use client";

import React, { ElementType, forwardRef } from "react";
import { calcConcentricRadius } from "./concentricRadius";

export interface QuietSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: "flat" | "raised" | "floating" | "glass" | "overlay";
  interactive?: boolean;
  parentRadius?: number;
  radius?: number | string;
  padding?: number;
  as?: ElementType;
  children?: React.ReactNode;
}

/**
 * QuietSurface: Permukaan padat data translusen solid TANPA efek blur backdrop-filter.
 * Dikhususkan untuk tabel admin, formulir panjang, dan area baca dokumen guna menjamin
 * kontras maksimal (WCAG AAA) dan performa 60fps tanpa jank rendering GPU.
 */
export const QuietSurface = forwardRef<HTMLDivElement, QuietSurfaceProps>(
  (
    {
      elevation = "raised",
      interactive = false,
      parentRadius,
      radius,
      padding = 16,
      as: Component = "div",
      className = "",
      children,
      style,
      ...props
    },
    ref
  ) => {
    const normalizedElevation =
      elevation === "glass" ? "raised" : elevation === "overlay" ? "floating" : elevation;

    const elevationClass =
      normalizedElevation === "floating"
        ? "shadow-[0_16px_40px_rgba(0,0,20,0.5)] -translate-y-0.5"
        : normalizedElevation === "raised"
        ? "shadow-[0_4px_20px_rgba(0,0,20,0.3)]"
        : "shadow-none";

    const interactiveClass = interactive
      ? "cursor-pointer transition-all duration-200 hover:border-white/20 hover:bg-[#0E0E38] active:scale-[0.99]"
      : "";

    const effectiveNumRadius = typeof radius === "number" ? radius : parentRadius;
    const calculatedRadius =
      effectiveNumRadius !== undefined ? calcConcentricRadius(effectiveNumRadius, padding) : undefined;

    const radiusClass =
      typeof radius === "string"
        ? radius === "full"
          ? "rounded-full"
          : radius === "3xl"
          ? "rounded-3xl"
          : radius === "2xl"
          ? "rounded-2xl"
          : radius === "xl"
          ? "rounded-xl"
          : radius === "lg"
          ? "rounded-lg"
          : radius === "md"
          ? "rounded-md"
          : ""
        : "";

    const dynamicStyle: React.CSSProperties = {
      ...(calculatedRadius !== undefined ? { borderRadius: `${calculatedRadius}px` } : {}),
      ...style,
    };

    return (
      <Component
        ref={ref}
        style={dynamicStyle}
        className={`bg-[var(--glass-bg-base)] border border-white/[0.08] ${elevationClass} ${interactiveClass} ${radiusClass} ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

QuietSurface.displayName = "QuietSurface";
