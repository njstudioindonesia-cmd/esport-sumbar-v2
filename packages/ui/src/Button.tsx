import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    // Ukuran: touch target minimum 44px pada 'md' dan 'lg' (WCAG 2.5.5 / 2.5.8)
    const sizeClasses = {
      sm: "h-9 px-3.5 text-xs gap-1.5",
      md: "h-11 px-5 text-sm gap-2 min-h-[44px]",
      lg: "h-13 px-6 text-base gap-2.5 min-h-[48px]",
    }[size];

    const variantClasses = {
      // Satu gaya utama pink brand (#FF1752)
      primary:
        "bg-[#FF1752] text-white hover:bg-[#E01246] active:bg-[#CC103E] shadow-sm font-bold border-transparent",
      // Permukaan matte tonal sekunder
      secondary:
        "bg-[#14143A] text-white/90 hover:bg-[#1D1D4A] hover:text-white border border-white/[0.08] active:border-white/20 font-medium",
      // Semantik aksi destruktif
      danger:
        "bg-[#F04438] text-white hover:bg-[#D92D20] active:bg-[#B42318] font-bold border-transparent",
      // Minimalis tanpa latar
      ghost:
        "bg-transparent text-white/70 hover:text-white hover:bg-white/[0.06] border-transparent font-medium",
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center rounded-lg transition-all duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-40 disabled:cursor-not-allowed ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
