import React from "react";
import { Sparkles } from "lucide-react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3 bg-[#0C0C26] border border-white/[0.08] rounded-2xl select-none ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/50 mb-1">
        {icon || <Sparkles className="w-5 h-5 text-[#FF1752]" />}
      </div>
      <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
      {description && (
        <p className="text-xs sm:text-sm text-white/50 max-w-md leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
