import React from "react";

export interface ListRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  onClick?: () => void;
}

export function ListRow({
  leftContent,
  rightContent,
  title,
  subtitle,
  onClick,
  className = "",
  ...props
}: ListRowProps) {
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={`min-h-[56px] px-4 py-3 flex items-center justify-between gap-4 border-b border-white/[0.06] transition-colors duration-150 ${
        isClickable ? "cursor-pointer hover:bg-white/[0.03] active:bg-white/[0.06]" : ""
      } ${className}`}
      {...props}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {leftContent}
        <div className="flex flex-col min-w-0">
          <div className="text-sm font-semibold text-white truncate">{title}</div>
          {subtitle && (
            <div className="text-xs text-white/50 truncate mt-0.5">{subtitle}</div>
          )}
        </div>
      </div>

      {rightContent && (
        <div className="flex items-center gap-2 shrink-0">{rightContent}</div>
      )}
    </div>
  );
}
