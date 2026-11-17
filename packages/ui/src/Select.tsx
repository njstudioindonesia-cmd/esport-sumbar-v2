import React from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, children, className = "", id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-white/80">
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            id={selectId}
            className={`w-full h-11 pl-3.5 pr-10 bg-[#14143A] text-white text-sm rounded-lg border appearance-none transition-all duration-150 outline-none cursor-pointer ${
              error
                ? "border-[#F04438] focus:border-[#F04438]"
                : "border-white/[0.08] hover:border-white/20 focus:border-white/40 focus:ring-1 focus:ring-white/40"
            } ${className}`}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="bg-[#0C0C26] text-white py-1"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <ChevronDown className="absolute right-3.5 w-4 h-4 pointer-events-none text-white/40" />
        </div>

        {error && <span className="text-xs text-[#F04438] mt-0.5">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
