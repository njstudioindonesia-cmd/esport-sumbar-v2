"use client";

import React, { ElementType, forwardRef } from "react";
import { SpecularLayer } from "./SpecularLayer";
import { calcConcentricRadius } from "./concentricRadius";

export type GlassVariant =
  | "regular"
  | "thin"
  | "thick"
  | "tinted"
  | "standard"
  | "elevated"
  | "subtle"
  | "prominent";

export type GlassElevation = "flat" | "raised" | "floating" | "glass" | "overlay";

export interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlassVariant;
  elevation?: GlassElevation;
  interactive?: boolean;
  specular?: boolean;
  scrim?: boolean;
  parentRadius?: number;
  radius?: number | string;
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
    // 1. Normalize variant class
    const normalizedVariant =
      variant === "standard"
        ? "regular"
        : variant === "subtle"
        ? "thin"
        : variant === "elevated"
        ? "thick"
        : variant === "prominent"
        ? "tinted"
        : variant;

    const variantClass =
      normalizedVariant === "thin"
        ? "glass-thin"
        : normalizedVariant === "thick"
        ? "glass-thick"
        : normalizedVariant === "tinted"
        ? "glass-tinted"
        : "glass-surface";

    // 2. Normalize elevation class
    const normalizedElevation =
      elevation === "glass" ? "raised" : elevation === "overlay" ? "floating" : elevation;

    const elevationClass =
      normalizedElevation === "floating"
        ? "shadow-[0_20px_50px_rgba(0,0,20,0.55)] -translate-y-0.5"
        : normalizedElevation === "raised"
        ? "shadow-[0_8px_32px_rgba(0,0,20,0.37)]"
        : "shadow-none";

    // 3. Interactive state classes
    const interactiveClass = interactive
      ? "cursor-pointer transition-all duration-300 hover:border-white/30 hover:shadow-[0_12px_40px_rgba(255,23,82,0.12)] active:scale-[0.99]"
      : "";

    // 4. Calculate radius
    const effectiveNumRadius = typeof radius === "number" ? radius : parentRadius;
    const calculatedRadius =
      effectiveNumRadius !== undefined
        ? calcConcentricRadius(effectiveNumRadius, padding)
        : undefined;

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
        className={`relative overflow-hidden ${variantClass} ${elevationClass} ${interactiveClass} ${radiusClass} ${className}`}
        {...props}
      >
        {specular && <SpecularLayer />}
        {scrim && <div className="absolute inset-0 bg-black/25 pointer-events-none" />}
        <div className="relative z-10 w-full h-full">{children}</div>
      </Component>
    );
  }
);

GlassSurface.displayName = "GlassSurface";
