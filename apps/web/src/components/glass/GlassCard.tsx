"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { GlassSurface, type GlassSurfaceProps, type GlassVariant } from "./GlassSurface";

export interface GlassCardProps extends Omit<GlassSurfaceProps, "variant"> {
  variant?: GlassVariant;
  material?: GlassVariant;
  interactive?: boolean;
  paddingLevel?: "none" | "sm" | "md" | "lg";
  radius?: number | string;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      variant,
      material,
      interactive = false,
      radius = 28,
      paddingLevel = "md",
      scrim = true,
      children,
      ...props
    },
    ref
  ) => {
    const paddingClasses = {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const effectiveVariant = material || variant || "regular";

    return (
      <GlassSurface
        ref={ref}
        variant={effectiveVariant}
        radius={radius}
        interactive={interactive}
        scrim={scrim}
        className={cn(
          "transition-all duration-300",
          interactive &&
            "hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-500/10 cursor-pointer",
          paddingLevel ? paddingClasses[paddingLevel] : "",
          className
        )}
        {...props}
      >
        {children}
      </GlassSurface>
    );
  }
);
GlassCard.displayName = "GlassCard";

export function GlassCardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 pb-4 border-b border-white/[0.08]", className)}
      {...props}
    />
  );
}

export function GlassCardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-lg font-heading font-black tracking-tight text-slate-100",
        className
      )}
      {...props}
    />
  );
}

export function GlassCardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-slate-400 font-sans leading-relaxed", className)}
      {...props}
    />
  );
}

export function GlassCardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pt-4 text-slate-200", className)} {...props} />;
}

export function GlassCardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center pt-4 border-t border-white/[0.08]", className)}
      {...props}
    />
  );
}
