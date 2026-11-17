import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
}

export function Skeleton({
  variant = "rectangular",
  className = "",
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: "h-4 rounded",
    rectangular: "rounded-xl",
    circular: "rounded-full",
  }[variant];

  return (
    <div
      className={`animate-pulse bg-white/[0.06] ${variantClasses} ${className}`}
      {...props}
    />
  );
}
