import React from "react";
import Link from "next/link";
import {
  Compass,
  Inbox,
  Users,
  Bell,
  Sparkles,
  ArrowRight,
  FolderOpen,
} from "lucide-react";

interface EmptyStateProps {
  variant?: "directory" | "queue" | "roster" | "notifications" | "general";
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
  className?: string;
}

export function EmptyState({
  variant = "general",
  title,
  description,
  actionText,
  actionHref,
  onActionClick,
  className = "",
}: EmptyStateProps) {
  const configs = {
    directory: {
      icon: Compass,
      defaultTitle: "Tidak Ada Profil Ditemukan",
      defaultDesc: "Coba sesuaikan kata kunci pencarian, filter wilayah 19 daerah, atau kategori game.",
      defaultAction: "Reset Filter Pencarian",
      iconColor: "text-[#D4AF37]",
      bgGlow: "bg-[#D4AF37]/5",
    },
    queue: {
      icon: Inbox,
      defaultTitle: "Antrean Pengajuan Bersih",
      defaultDesc: "Tidak ada berkas verifikasi yang menunggu pemeriksaan saat ini. Semua data telah selesai diproses.",
      defaultAction: "Segarkan Antrean",
      iconColor: "text-[#22C55E]",
      bgGlow: "bg-[#22C55E]/5",
    },
    roster: {
      icon: Users,
      defaultTitle: "Roster Tim Belum Terisi",
      defaultDesc: "Mulai bangun kekuatan tim Anda dengan mengundang atlet atau membuka formulir trial pemain.",
      defaultAction: "Undang Atlet Sekarang",
      iconColor: "text-[#3B82F6]",
      bgGlow: "bg-[#3B82F6]/5",
    },
    notifications: {
      icon: Bell,
      defaultTitle: "Tidak Ada Notifikasi Baru",
      defaultDesc: "Pemberitahuan mengenai undangan tim, perubahan status verifikasi, dan jadwal turnamen akan muncul di sini.",
      defaultAction: "Jelajahi Turnamen",
      iconColor: "text-purple-400",
      bgGlow: "bg-purple-500/5",
    },
    general: {
      icon: FolderOpen,
      defaultTitle: "Data Masih Kosong",
      defaultDesc: "Belum ada item atau data yang dapat ditampilkan pada bagian ini.",
      defaultAction: "Kembali ke Beranda",
      iconColor: "text-gray-400",
      bgGlow: "bg-gray-500/5",
    },
  };

  const config = configs[variant] || configs.general;
  const Icon = config.icon;

  const displayTitle = title || config.defaultTitle;
  const displayDesc = description || config.defaultDesc;
  const displayAction = actionText || config.defaultAction;

  return (
    <div
      className={`p-10 sm:p-14 rounded-2xl bg-[#12151C] border border-[#262B38] text-center flex flex-col items-center justify-center gap-3 relative overflow-hidden shadow-lg ${className}`}
    >
      <div className={`p-4 rounded-2xl ${config.bgGlow} border border-[#262B38] mb-1`}>
        <Icon className={`w-8 h-8 ${config.iconColor}`} />
      </div>

      <h3 className="font-heading font-bold text-base sm:text-lg uppercase text-white tracking-wide">
        {displayTitle}
      </h3>

      <p className="text-xs sm:text-sm text-[#9AA3B2] max-w-md leading-relaxed">
        {displayDesc}
      </p>

      {(actionHref || onActionClick) && (
        <div className="pt-2">
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A1E28] hover:bg-[#262B38] border border-[#262B38] text-xs font-heading font-bold text-white uppercase tracking-wider transition-colors shadow-sm"
            >
              <span>{displayAction}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={onActionClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A1E28] hover:bg-[#262B38] border border-[#262B38] text-xs font-heading font-bold text-white uppercase tracking-wider transition-colors shadow-sm"
            >
              <span>{displayAction}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
