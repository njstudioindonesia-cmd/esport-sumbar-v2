import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        {label && (
          <label htmlFor={textareaId} className="text-xs font-semibold text-white/80">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={`w-full min-h-[96px] p-3.5 bg-[#14143A] text-white text-sm placeholder:text-white/30 rounded-lg border transition-all duration-150 outline-none resize-y ${
            error
              ? "border-[#F04438] focus:border-[#F04438] focus:ring-1 focus:ring-[#F04438]"
              : "border-white/[0.08] hover:border-white/20 focus:border-white/40 focus:ring-1 focus:ring-white/40"
          } ${className}`}
          {...props}
        />

        {error && <span className="text-xs text-[#F04438] mt-0.5">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-white/40 mt-0.5">{helperText}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
