"use client";

import React, { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface GlassInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id: customId,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    return (
      <div className="w-full space-y-1.5 font-sans">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-semibold text-slate-300 select-none tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            id={id}
            ref={ref}
            type={type}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              "w-full h-11 min-h-[44px] px-3.5 text-sm rounded-xl text-white transition-all duration-200",
              "bg-slate-900/60 backdrop-blur-md border border-white/15",
              "placeholder:text-slate-400",
              "focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40 focus:bg-slate-900/80",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-950/40",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error &&
                "border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/30 text-rose-100",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-xs text-rose-400 font-medium flex items-center gap-1.5 pt-0.5"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-slate-400 font-normal pt-0.5">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
GlassInput.displayName = "GlassInput";

export interface GlassTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const GlassTextarea = forwardRef<
  HTMLTextAreaElement,
  GlassTextareaProps
>(
  (
    { className, label, error, helperText, id: customId, disabled, ...props },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    return (
      <div className="w-full space-y-1.5 font-sans">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-semibold text-slate-300 select-none tracking-wide"
          >
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={cn(
            "w-full min-h-[96px] p-3 text-sm rounded-xl text-white transition-all duration-200",
            "bg-slate-900/60 backdrop-blur-md border border-white/15",
            "placeholder:text-slate-400",
            "focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40 focus:bg-slate-900/80",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-950/40",
            error &&
              "border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/30 text-rose-100",
            className
          )}
          {...props}
        />
        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-xs text-rose-400 font-medium flex items-center gap-1.5 pt-0.5"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-slate-400 font-normal pt-0.5">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
GlassTextarea.displayName = "GlassTextarea";

export interface GlassSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
}

export const GlassSelect = forwardRef<HTMLSelectElement, GlassSelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      children,
      id: customId,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    return (
      <div className="w-full space-y-1.5 font-sans">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-semibold text-slate-300 select-none tracking-wide"
          >
            {label}
          </label>
        )}
        <select
          id={id}
          ref={ref}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={cn(
            "w-full h-11 min-h-[44px] px-3.5 text-sm rounded-xl text-white transition-all duration-200",
            "bg-slate-900/70 backdrop-blur-md border border-white/15",
            "focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40 focus:bg-slate-900",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error &&
              "border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/30 text-rose-100",
            className
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  className="bg-slate-950 text-white py-1"
                >
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-xs text-rose-400 font-medium flex items-center gap-1.5 pt-0.5"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-slate-400 font-normal pt-0.5">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
GlassSelect.displayName = "GlassSelect";
