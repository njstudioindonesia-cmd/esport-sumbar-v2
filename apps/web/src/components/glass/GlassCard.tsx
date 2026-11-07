"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { GlassSurface, type GlassSurfaceProps } from "./GlassSurface";

export interface GlassCardProps extends Omit<GlassSurfaceProps, "variant"> {
  variant?: "regular" | "thin" | "thick" | "tinted";
  material?: "regular" | "thin" | "thick" | "tinted";
  interactive?: boolean;
  paddingLevel?: "none" | "sm" | "md" | "lg";
  radius?: number;
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
        parentRadius={radius}
        interactive={interactive}
        scrim={scrim}
        className={cn(
          "transition-all duration-300",
          interactive &&
            "hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-500/10 cursor-pointer",
          paddingClasses[paddingLevel],
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

export const GlassCardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));
GlassCardHeader.displayName = "GlassCardHeader";

export const GlassCardTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-bold leading-tight tracking-tight text-white",
      className
    )}
    {...props}
  >
    {children}
  </h3>
));
GlassCardTitle.displayName = "GlassCardTitle";

export const GlassCardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs sm:text-sm text-slate-400 font-normal", className)}
    {...props}
  />
));
GlassCardDescription.displayName = "GlassCardDescription";

export const GlassCardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0 text-slate-200", className)} {...props} />
));
GlassCardContent.displayName = "GlassCardContent";

export const GlassCardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4 border-t border-white/10", className)}
    {...props}
  />
));
GlassCardFooter.displayName = "GlassCardFooter";
