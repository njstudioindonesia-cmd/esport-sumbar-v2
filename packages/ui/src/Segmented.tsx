import React from "react";

export interface SegmentedItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedProps {
  items: SegmentedItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
  size?: "sm" | "md";
}

export function Segmented({
  items,
  value,
  onChange,
  className = "",
  size = "md",
}: SegmentedProps) {
  const sizeClasses = {
    sm: "p-0.5 text-xs",
    md: "p-1 text-sm",
  }[size];

  const itemSizeClasses = {
    sm: "py-1 px-2.5 gap-1",
    md: "py-1.5 px-3.5 gap-1.5",
  }[size];

  return (
    <div
      role="tablist"
      className={`inline-flex items-center bg-[#0C0C26] border border-white/[0.08] rounded-lg select-none ${sizeClasses} ${className}`}
    >
      {items.map((item) => {
        const isActive = item.id === value;
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={isActive}
            disabled={item.disabled}
            onClick={() => onChange(item.id)}
            className={`inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 outline-none focus-visible:ring-1 focus-visible:ring-white/40 disabled:opacity-40 disabled:cursor-not-allowed ${itemSizeClasses} ${
              isActive
                ? "bg-[#14143A] text-white shadow-sm border border-white/10 font-bold"
                : "text-white/60 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
