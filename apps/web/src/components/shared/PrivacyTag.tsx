import React from "react";
import { Eye, Lock, Shield } from "lucide-react";

interface PrivacyTagProps {
  isPublic: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function PrivacyTag({ isPublic, size = "md", className = "" }: PrivacyTagProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[9px] gap-1",
    md: "px-2.5 py-0.5 text-[10px] gap-1.5",
  };

  const iconSizes = {
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
  };

  if (isPublic) {
    return (
      <span
        className={`inline-flex items-center rounded-full font-mono font-bold bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] ${sizeClasses[size]} ${className}`}
      >
        <Eye className={`${iconSizes[size]} shrink-0`} />
        <span>Publik</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-mono font-bold bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#60A5FA] ${sizeClasses[size]} ${className}`}
    >
      <Lock className={`${iconSizes[size]} shrink-0`} />
      <span>Hanya Admin & Saya</span>
    </span>
  );
}
