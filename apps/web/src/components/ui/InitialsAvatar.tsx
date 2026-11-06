import React from "react";
import type { EntityType } from "@/lib/supabase/database.types";
import { User, Shield, Users, Landmark, MapPin, Building, GraduationCap } from "lucide-react";

interface InitialsAvatarProps {
  name: string;
  entityType?: EntityType | string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  isMinorProtected?: boolean;
}

export function InitialsAvatar({
  name,
  entityType = "player",
  size = "md",
  className = "",
  isMinorProtected = false,
}: InitialsAvatarProps) {
  // Ambil 1-2 inisial dari nama
  const getInitials = (str: string): string => {
    if (!str || !str.trim()) return "ES";
    const words = str.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  // Palet gradien sesuai estetika PBESI Sumbar & Rarity
  const getGradient = (type: string) => {
    switch (type) {
      case "player":
        return "from-[#1E293B] via-[#0F172A] to-[#1E1B4B] border-blue-500/30 text-blue-300";
      case "coach":
        return "from-[#31101E] via-[#1A0B16] to-[#0A0C13] border-purple-500/30 text-purple-300";
      case "team":
        return "from-[#2A1608] via-[#1A0D05] to-[#0A0C13] border-amber-500/30 text-amber-300";
      case "community":
        return "from-[#082A1C] via-[#04170E] to-[#0A0C13] border-emerald-500/30 text-emerald-300";
      case "venue":
        return "from-[#2A0828] via-[#170516] to-[#0A0C13] border-fuchsia-500/30 text-fuchsia-300";
      case "campus":
        return "from-[#081F2A] via-[#04121A] to-[#0A0C13] border-cyan-500/30 text-cyan-300";
      case "school":
        return "from-[#2A2308] via-[#1A1605] to-[#0A0C13] border-yellow-500/30 text-yellow-300";
      default:
        return "from-[#1F2430] via-[#131722] to-[#0A0C13] border-white/20 text-[#D4AF37]";
    }
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "player":
        return <User className="w-3.5 h-3.5 opacity-60" />;
      case "coach":
        return <Shield className="w-3.5 h-3.5 opacity-60" />;
      case "team":
        return <Users className="w-3.5 h-3.5 opacity-60" />;
      case "community":
        return <Users className="w-3.5 h-3.5 opacity-60" />;
      case "venue":
        return <MapPin className="w-3.5 h-3.5 opacity-60" />;
      case "campus":
        return <Landmark className="w-3.5 h-3.5 opacity-60" />;
      case "school":
        return <GraduationCap className="w-3.5 h-3.5 opacity-60" />;
      default:
        return <Building className="w-3.5 h-3.5 opacity-60" />;
    }
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-20 h-20 text-xl font-black",
    xl: "w-28 h-28 text-3xl font-black",
    full: "w-full h-full text-4xl font-black",
  };

  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-br border flex flex-col items-center justify-center select-none shadow-inner overflow-hidden ${
        getGradient(entityType)
      } ${sizeClasses[size]} ${className}`}
    >
      {/* Background motif marawa subtle */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:8px_8px]" />

      {/* Marawa accent bar */}
      <div className="absolute top-0 inset-x-0 h-1 flex">
        <div className="w-1/3 bg-[#C8102E]" />
        <div className="w-1/3 bg-[#D4AF37]" />
        <div className="w-1/3 bg-black" />
      </div>

      {/* Initials Text */}
      <span className="font-heading font-black tracking-widest relative z-10 drop-shadow-md">
        {initials}
      </span>

      {/* Bottom micro icon */}
      <div className="mt-1 relative z-10 flex items-center gap-1">
        {getEntityIcon(entityType)}
        {isMinorProtected && (
          <span className="text-[8px] font-mono font-bold tracking-tight text-white/50 bg-black/40 px-1 py-0.5 rounded">
            PDP
          </span>
        )}
      </div>
    </div>
  );
}
