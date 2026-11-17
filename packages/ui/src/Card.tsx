import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  hoverable?: boolean;
}

export function Card({
  as: Component = "div",
  hoverable = false,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <Component
      className={`bg-[#0C0C26] rounded-2xl border border-white/[0.08] transition-all duration-200 ${
        hoverable ? "hover:border-white/20 hover:bg-[#101032]" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 border-b border-white/[0.06] flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 border-t border-white/[0.06] flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
}
