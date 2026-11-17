import React, { useState, useRef, useEffect } from "react";

export interface MenuItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface MenuProps {
  trigger: React.ReactNode;
  items: MenuItem[];
  align?: "left" | "right";
  className?: string;
}

export function Menu({ trigger, items, align = "right", className = "" }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          role="menu"
          className={`absolute z-50 mt-2 w-56 bg-[#14143A] border border-white/[0.12] rounded-xl shadow-2xl py-1.5 focus:outline-none ${
            align === "right" ? "right-0" : "left-0"
          } ${className}`}
        >
          {items.map((item) => (
            <button
              key={item.id}
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                setIsOpen(false);
                item.onClick?.();
              }}
              className={`w-full px-3.5 py-2 text-xs flex items-center gap-2.5 transition-colors text-left ${
                item.danger
                  ? "text-[#F04438] hover:bg-[#F04438]/10"
                  : "text-white/80 hover:text-white hover:bg-white/[0.06]"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {item.icon && <span className="w-4 h-4 shrink-0">{item.icon}</span>}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
