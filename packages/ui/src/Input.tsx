import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-white/80">
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3.5 pointer-events-none text-white/40">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`w-full h-11 px-3.5 bg-[#14143A] text-white text-sm placeholder:text-white/30 rounded-lg border transition-all duration-150 outline-none ${
              leftIcon ? "pl-10" : ""
            } ${rightIcon ? "pr-10" : ""} ${
              error
                ? "border-[#F04438] focus:border-[#F04438] focus:ring-1 focus:ring-[#F04438]"
                : "border-white/[0.08] hover:border-white/20 focus:border-white/40 focus:ring-1 focus:ring-white/40"
            } ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 pointer-events-none text-white/40">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <span className="text-xs text-[#F04438] mt-0.5">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-white/40 mt-0.5">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
