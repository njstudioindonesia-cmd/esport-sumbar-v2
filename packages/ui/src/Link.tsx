import React from "react";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "default" | "muted" | "pink";
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ variant = "default", className = "", children, ...props }, ref) => {
    const variantClasses = {
      default: "text-white/80 hover:text-white underline-offset-4 hover:underline",
      muted: "text-white/50 hover:text-white/90 underline-offset-4 hover:underline",
      pink: "text-[#FF1752] hover:text-[#FF4D77] underline-offset-4 hover:underline font-semibold",
    }[variant];

    return (
      <a
        ref={ref}
        className={`inline-flex items-center gap-1 transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded ${variantClasses} ${className}`}
        {...props}
      >
        {children}
      </a>
    );
  }
);

Link.displayName = "Link";
