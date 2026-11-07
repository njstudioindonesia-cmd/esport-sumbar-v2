"use client";

import React, { ElementType, forwardRef } from "react";
import { SpecularLayer } from "./SpecularLayer";
import { calcConcentricRadius } from "./concentricRadius";

export interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "regular" | "thin" | "thick" | "tinted";
  elevation?: "flat" | "raised" | "floating";
  interactive?: boolean;
  specular?: boolean;
  scrim?: boolean;
  parentRadius?: number;
  padding?: number;
  as?: ElementType;
  children?: React.ReactNode;
}

export const GlassSurface = forwardRef<HTMLDivElement, GlassSurfaceProps>(
  (
    {
      variant = "regular",
      elevation = "raised",
      interactive = false,
      specular = true,
      scrim = false,
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
    // 1. Variant class
    const variantClass =
      variant === "thin"
        ? "glass-thin"
        : variant === "thick"
        ? "glass-thick"
        : variant === "tinted"
        ? "glass-tinted"
        : "glass-surface";

    // 2. Elevation shadow
    const elevationClass =
      elevation === "floating"
        ? "shadow-[0_20px_50px_rgba(0,0,20,0.55)] -translate-y-0.5"
        : elevation === "raised"
        ? "shadow-[0_8px_32px_rgba(0,0,20,0.35)]"
        : "shadow-none";

    // 3. Interactive state (press & hover micro-interactions)
    const interactiveClass = interactive
      ? "cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(255,23,82,0.15)] active:scale-[0.98] active:translate-y-0"
      : "";

    // 4. Concentric radius calculation
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
        className={`relative overflow-hidden ${variantClass} ${elevationClass} ${interactiveClass} ${className}`}
        {...props}
      >
        {/* Contrast Scrim backing if requested */}
        {scrim && (
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[#03031A]/45 backdrop-contrast-125 pointer-events-none rounded-[inherit]"
          />
        )}

        {/* Dynamic Specular Sheen Layer */}
        {specular && <SpecularLayer pointerInteractive={interactive} />}

        {/* Content Container */}
        <div className="relative z-10 w-full h-full rounded-[inherit]">{children}</div>
      </Component>
    );
  }
);

GlassSurface.displayName = "GlassSurface";
