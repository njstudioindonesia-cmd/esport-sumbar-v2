"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

interface OwnershipNoteProps {
  variant?: "short" | "full" | "badge" | "footer";
  className?: string;
  withAboutLink?: boolean;
}

export function OwnershipNote({
  variant = "short",
  className = "",
  withAboutLink = true,
}: OwnershipNoteProps) {
  if (variant === "badge") {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A0A2E]/80 border border-white/10 text-[11px] text-white/70 backdrop-blur-md ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF1752] animate-pulse" />
        <span>
          Platform mandiri oleh <strong className="text-white font-semibold">ESPORT SUMBAR™</strong>
        </span>
        <span className="text-white/30">•</span>
        <span className="text-white/60">Pemverifikasi Tunggal</span>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={`text-xs text-white/50 leading-relaxed space-y-1 ${className}`}>
        <p>
          <strong className="text-white/80 font-medium">ESPORT SUMBAR™</strong> adalah merek dan platform independen yang mengelola sistem data atlet, ekosistem turnamen, dan kartu identitas digital.
        </p>
        <p className="text-[11px] text-white/40">
          ESPORT SUMBAR bertindak sebagai satu-satunya pemilik, operator, dan pemverifikasi data pangkalan esport Sumatera Barat.{" "}
          {withAboutLink && (
            <Link
              href="/about"
              className="text-[#FF4D77] hover:underline underline-offset-2 ml-1 inline-flex items-center gap-0.5"
            >
              Pelajari struktur tata kelola &rarr;
            </Link>
          )}
        </p>
      </div>
    );
  }

  if (variant === "short") {
    return (
      <p className={`text-[11px] text-white/50 leading-normal ${className}`}>
        ESPORT SUMBAR™ adalah platform data independen dan pemverifikasi tunggal ekosistem esport Sumatera Barat.
        {withAboutLink && (
          <Link
            href="/about"
            className="text-[#FF4D77] hover:underline underline-offset-2 ml-1.5 font-medium"
          >
            Tentang Kami
          </Link>
        )}
      </p>
    );
  }

  // variant === "full"
  return (
    <div
      className={`p-5 rounded-2xl bg-[#0A0A2E]/60 border border-white/10 backdrop-blur-md space-y-3 ${className}`}
    >
      <div className="flex items-center gap-2 text-[#FF1752]">
        <ShieldCheck className="w-5 h-5 shrink-0" />
        <h4 className="font-heading font-bold text-sm tracking-wide uppercase text-white">
          Kepemilikan Platform &amp; Tata Kelola Mandiri
        </h4>
      </div>

      <div className="text-xs text-white/70 space-y-2 leading-relaxed">
        <p>
          <strong className="text-white font-medium">ESPORT SUMBAR™</strong> adalah merek, produk, dan platform teknologi data esport yang dimiliki serta dikelola sepenuhnya oleh <strong className="text-white">ESPORT SUMBAR™</strong>. Seluruh basis data pengguna, pemrosesan paspor atlet (ESPORT ID), dan operasional sistem berjalan di bawah kendali teknis ESPORT SUMBAR™.
        </p>
        <p>
          ESPORT SUMBAR mengoperasikan standar verifikasi satu tahap tunggal berstandar industri dengan kode registrasi verifikasi <strong className="text-white font-medium">ESP-SB-VER-YYYY-XXXX</strong> bagi seluruh insan esport di 19 kota dan kabupaten se-Sumatera Barat.
        </p>
      </div>

      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
        <span>Tata kelola profesional berlandaskan integritas data olahraga daerah</span>
        {withAboutLink && (
          <Link
            href="/about"
            className="text-[#FF4D77] hover:text-white transition-colors font-medium flex items-center gap-1"
          >
            Pelajari Selengkapnya &rarr;
          </Link>
        )}
      </div>
    </div>
  );
}
