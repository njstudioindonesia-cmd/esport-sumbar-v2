"use client";

import React from "react";
import Link from "next/link";
import { Shield, ExternalLink } from "lucide-react";

interface PartnerStripProps {
  className?: string;
  variant?: "horizontal" | "compact" | "cards";
}

const INSTITUTIONAL_PARTNERS = [
  {
    name: "Pengprov ESI Sumbar",
    role: "Verifikasi Tingkat Provinsi",
    scope: "Sumatera Barat",
  },
  {
    name: "ESI Kota Padang",
    role: "Verifikasi Wilayah",
    scope: "Kota Padang",
  },
  {
    name: "ESI Kota Bukittinggi",
    role: "Verifikasi Wilayah",
    scope: "Kota Bukittinggi",
  },
  {
    name: "ESI Kota Payakumbuh",
    role: "Verifikasi Wilayah",
    scope: "Kota Payakumbuh",
  },
  {
    name: "16 ESI Kota & Kab Lainnya",
    role: "Verifikasi Wilayah",
    scope: "Sumatera Barat",
  },
];

export function PartnerStrip({
  className = "",
  variant = "horizontal",
}: PartnerStripProps) {
  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 text-xs text-white/50 ${className}`}>
        <span className="text-[10px] font-mono tracking-wider uppercase text-white/40">
          Mitra Kelembagaan:
        </span>
        <span className="text-white/70 font-medium">Pengprov ESI Sumbar</span>
        <span className="text-white/20">•</span>
        <span className="text-white/60">ESI 19 Kota/Kabupaten</span>
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-white/50 uppercase tracking-wider font-mono">
            <Shield className="w-3.5 h-3.5 text-white/40" />
            <span>Mitra Kelembagaan Verifikasi Data</span>
          </div>
          <Link
            href="/partners"
            className="text-[11px] text-[#FF4D77] hover:underline"
          >
            Daftar Lengkap &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {INSTITUTIONAL_PARTNERS.map((partner, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-[#0A0A2E]/50 border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-between"
            >
              <span className="text-[11px] font-semibold text-white/80 line-clamp-1">
                {partner.name}
              </span>
              <span className="text-[9px] text-white/40 mt-1 block">
                {partner.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // variant === "horizontal"
  return (
    <div
      className={`py-3 px-4 rounded-xl bg-[#0A0A2E]/40 border border-white/5 backdrop-blur-sm ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 font-medium">
            Mitra Kelembagaan Verifikasi:
          </span>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-0.5 text-xs text-white/60">
          {INSTITUTIONAL_PARTNERS.map((partner, idx) => (
            <span
              key={idx}
              className="shrink-0 text-[11px] text-white/60 hover:text-white/90 transition-colors cursor-default"
              title={`${partner.name} (${partner.role})`}
            >
              {partner.name}
            </span>
          ))}
        </div>

        <Link
          href="/partners"
          className="shrink-0 text-[10px] text-[#FF4D77] hover:underline flex items-center gap-1 font-medium"
        >
          <span>Detail</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </Link>
      </div>
    </div>
  );
}
