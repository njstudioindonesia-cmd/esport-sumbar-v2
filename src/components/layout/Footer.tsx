import React from "react";
import Link from "next/link";
import { ShieldCheck, Award, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#07080C] border-t border-white/[0.08] pt-12 pb-8 text-[#8E95A5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        {/* TOP ROW: BRAND & 3 COLUMNS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col (2 cols on large screen) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="flex h-3 w-7 rounded-sm overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                <span className="w-1/3 bg-[#C8102E]" title="Merah Marawa" />
                <span className="w-1/3 bg-[#D4AF37]" title="Kuning Emas" />
                <span className="w-1/3 bg-black" title="Hitam" />
              </div>
              <span className="font-heading font-black tracking-wider text-xl text-white group-hover:text-[#D4AF37] transition-colors">
                ESPORT<span className="text-[#D4AF37]">SUMBAR</span>
              </span>
            </Link>

            <span className="text-xs text-gray-400">
              Pusat data dan identitas digital resmi atlet PBESI Sumatera Barat.
            </span>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F1118] border border-[#22C55E]/40 text-[#22C55E] text-[10px] font-heading font-bold uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                Mitra Resmi PBESI Sumbar
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F1118] border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-heading font-bold uppercase">
                <Award className="w-3.5 h-3.5" />
                Privasi UU PDP
              </span>
            </div>
          </div>

          {/* Col 1: Direktori */}
          <div className="flex flex-col gap-2 text-xs">
            <span className="font-heading font-bold text-white uppercase tracking-wider text-xs mb-1">
              Direktori
            </span>
            <Link href="/explore" className="hover:text-white transition-colors">
              Pemain
            </Link>
            <Link href="/explore?tab=teams" className="hover:text-white transition-colors">
              Klub & Tim
            </Link>
            <Link href="/explore?tab=coaches" className="hover:text-white transition-colors">
              Pelatih
            </Link>
            <Link href="/regions" className="hover:text-white transition-colors">
              19 Daerah
            </Link>
          </div>

          {/* Col 2: Ekosistem */}
          <div className="flex flex-col gap-2 text-xs">
            <span className="font-heading font-bold text-white uppercase tracking-wider text-xs mb-1">
              Ekosistem
            </span>
            <Link href="/news" className="hover:text-white transition-colors">
              Warta Berita
            </Link>
            <Link href="/how-it-works" className="hover:text-white transition-colors">
              Cara Kerja
            </Link>
            <Link href="/gallery" className="hover:text-white transition-colors">
              Galeri Kartu
            </Link>
            <Link href="/me/profile/new" className="hover:text-[#D4AF37] transition-colors font-bold">
              Buat Kartu
            </Link>
          </div>

          {/* Col 3: Regulasi & Akses */}
          <div className="flex flex-col gap-2 text-xs">
            <span className="font-heading font-bold text-white uppercase tracking-wider text-xs mb-1">
              Regulasi
            </span>
            <Link href="/how-it-works" className="hover:text-white transition-colors">
              Verifikasi ESI
            </Link>
            <Link href="/me/privacy" className="hover:text-white transition-colors">
              Pengaturan Privasi
            </Link>
            <Link href="/admin/region" className="hover:text-gray-300 transition-colors">
              Portal Pengcab
            </Link>
            <Link href="/admin/province" className="hover:text-gray-300 transition-colors">
              Portal Pengprov
            </Link>
          </div>
        </div>

        {/* BOTTOM ROW: COPYRIGHT */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#8E95A5]">
          <p>© 2026 Pengprov ESI Sumatera Barat. Hak cipta dilindungi.</p>
          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <MapPin className="w-3 h-3 text-[#D4AF37]" />
            <span>Padang, Sumatera Barat</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
