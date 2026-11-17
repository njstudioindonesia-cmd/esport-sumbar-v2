import React from "react";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({
  src,
  alt = "Avatar Pengguna",
  size = "md",
  className = "",
}: AvatarProps) {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-11 h-11",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }[size];

  const iconSizeMap = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  }[size];

  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 border border-white/10 bg-[#14143A] flex items-center justify-center select-none ${sizeMap} ${className}`}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        // Designed placeholder: Official Mark V-S silhouette (No initial letter in neon circle)
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#14143A] to-[#0A0A26]">
          <svg
            className={`${iconSizeMap} text-white/40`}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 14L20 28L28 14H24L20 22L16 14H12Z"
              fill="currentColor"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
