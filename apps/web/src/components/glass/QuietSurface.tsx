"use client";

import React, { ElementType, forwardRef } from "react";
import { calcConcentricRadius } from "./concentricRadius";

export interface QuietSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: "flat" | "raised" | "floating";
  interactive?: boolean;
  parentRadius?: number;
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
      padding = 16,
      as: Component = "div",
      className = "",
      children,
      style,
      ...props
    },
    ref
  ) => {
    const elevationClass =
      elevation === "floating"
        ? "shadow-[0_16px_40px_rgba(0,0,20,0.5)] -translate-y-0.5"
        : elevation === "raised"
        ? "shadow-[0_4px_20px_rgba(0,0,20,0.3)]"
        : "shadow-none";

    const interactiveClass = interactive
      ? "cursor-pointer transition-all duration-200 hover:border-white/20 hover:bg-[#0E0E38] active:scale-[0.99]"
      : "";

    const calculatedRadius =
      parentRadius !== undefined ? calcConcentricRadius(parentRadius, padding) : undefined;

    const dynamicStyle: React.CSSProperties = {
      ...(calculatedRadius !== undefined ? { borderRadius: `${calculatedRadius}px` } : {}),
      ...style,
    };

    return (
      <Component
        ref={ref}
        style={dynamicStyle}
        className={`quiet-surface rounded-2xl p-6 ${elevationClass} ${interactiveClass} ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

QuietSurface.displayName = "QuietSurface";
