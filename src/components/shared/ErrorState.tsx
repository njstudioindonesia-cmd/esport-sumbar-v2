import React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Lock,
  FileQuestion,
  RefreshCw,
  HelpCircle,
  Home,
} from "lucide-react";

interface ErrorStateProps {
  variant?: "network" | "forbidden" | "notFound";
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  variant = "network",
  title,
  description,
  onRetry,
  className = "",
}: ErrorStateProps) {
  const configs = {
    network: {
      icon: AlertTriangle,
      defaultTitle: "Gagal Memuat Data",
      defaultDesc: "Terjadi gangguan saat menghubungkan ke basis data. Mohon periksa koneksi internet Anda atau coba sesaat lagi.",
      iconColor: "text-amber-400",
      bgGlow: "bg-amber-950/20 border-amber-800/40",
    },
    forbidden: {
      icon: Lock,
      defaultTitle: "Akses Dibatasi (403)",
      defaultDesc: "Anda tidak memiliki kewenangan yurisdiksi atau hak akses multi-wilayah RLS untuk membuka halaman atau data ini.",
      iconColor: "text-red-400",
      bgGlow: "bg-red-950/20 border-red-800/40",
    },
    notFound: {
      icon: FileQuestion,
      defaultTitle: "Halaman Tidak Ditemukan (404)",
      defaultDesc: "Data profil, berkas pengajuan, atau tautan yang Anda cari tidak terdaftar atau telah dipindahkan.",
      iconColor: "text-[#D4AF37]",
      bgGlow: "bg-[#D4AF37]/10 border-[#D4AF37]/30",
    },
  };

  const config = configs[variant] || configs.network;
  const Icon = config.icon;

  const displayTitle = title || config.defaultTitle;
  const displayDesc = description || config.defaultDesc;

  return (
    <div
      className={`p-10 sm:p-14 rounded-2xl bg-[#12151C] border border-[#262B38] text-center flex flex-col items-center justify-center gap-3 shadow-lg ${className}`}
    >
      <div className={`p-4 rounded-2xl ${config.bgGlow} border mb-1`}>
        <Icon className={`w-8 h-8 ${config.iconColor}`} />
      </div>

      <h3 className="font-heading font-bold text-base sm:text-lg uppercase text-white tracking-wide">
        {displayTitle}
      </h3>

      <p className="text-xs sm:text-sm text-[#9AA3B2] max-w-md leading-relaxed">
        {displayDesc}
      </p>

      <div className="flex items-center gap-3 pt-3 flex-wrap justify-center">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:brightness-110 text-black text-xs font-heading font-bold uppercase transition-all shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </button>
        )}

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1A1E28] hover:bg-[#262B38] border border-[#262B38] text-xs font-heading font-bold text-white uppercase transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Ke Beranda</span>
        </Link>

        <Link
          href="/how-it-works"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-heading font-bold text-gray-400 hover:text-white uppercase transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Pusat Bantuan</span>
        </Link>
      </div>
    </div>
  );
}
