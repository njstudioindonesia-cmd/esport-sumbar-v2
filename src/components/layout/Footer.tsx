import React from "react";
import Link from "next/link";
import { ShieldCheck, Award, MapPin, Mail, ExternalLink, Heart, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#080A0E] border-t border-[#262B38] pt-12 pb-8 text-[#9AA3B2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        {/* TOP ROW: BRAND & PARTNERSHIP */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-3 w-7 rounded-sm overflow-hidden">
                <span className="w-1/3 bg-[#C8102E]" />
                <span className="w-1/3 bg-[#D4AF37]" />
                <span className="w-1/3 bg-black" />
              </div>
              <span className="font-heading font-black tracking-wider text-xl text-white">
                ESPORT<span className="text-[#D4AF37]">SUMBAR</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#9AA3B2] leading-relaxed max-w-md">
              Pusat data, direktori publik, dan pangkalan identitas digital atlet, pelatih, serta klub esport Sumatera Barat. Menghubungkan seluruh ekosistem melalui verifikasi resmi ESI 19 Kota dan Kabupaten.
            </p>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12151C] border border-[#22C55E]/40 text-[#22C55E] text-[10px] font-heading font-bold uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                Kemitraan ESI Sumatera Barat
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12151C] border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-heading font-bold uppercase">
                <Award className="w-3.5 h-3.5" />
                Patuh UU PDP (Privasi Terjamin)
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2.5 text-xs">
            <span className="font-heading font-bold text-white uppercase tracking-wider text-xs">
              Eksplorasi Ekosistem
            </span>
            <Link href="/explore" className="hover:text-white transition-colors">
              Direktori Atlet (Player)
            </Link>
            <Link href="/explore?tab=teams" className="hover:text-white transition-colors">
              Direktori Klub & Tim
            </Link>
            <Link href="/explore?tab=coaches" className="hover:text-white transition-colors">
              Pelatih Bersertifikasi
            </Link>
            <Link href="/regions" className="hover:text-white transition-colors">
              Data 19 Kota & Kabupaten
            </Link>
            <Link href="/gallery" className="hover:text-[#D4AF37] transition-colors font-medium">
              Galeri Kartu ESPORT ID
            </Link>
            <Link href="/design-system" className="hover:text-[#D4AF37] transition-colors font-mono text-[11px] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Katalog Komponen UI</span>
            </Link>
          </div>

          {/* Legal & Contacts */}
          <div className="flex flex-col gap-2.5 text-xs">
            <span className="font-heading font-bold text-white uppercase tracking-wider text-xs">
              Tata Kelola & Legal
            </span>
            <Link href="/me/privacy" className="hover:text-white transition-colors">
              Pengaturan Privasi UU PDP
            </Link>
            <Link href="/how-it-works" className="hover:text-white transition-colors">
              Mekanisme Verifikasi Berjenjang
            </Link>
            <Link href="/admin/region" className="hover:text-white transition-colors text-gray-400">
              Panel Pengcab ESI Daerah
            </Link>
            <Link href="/admin/province" className="hover:text-white transition-colors text-gray-400">
              Panel Pengprov ESI Sumbar
            </Link>
            <Link href="/admin/platform" className="hover:text-white transition-colors text-gray-400">
              Panel Operator Sistem
            </Link>
            <div className="mt-2 pt-2 border-t border-[#262B38]/60 flex flex-col gap-1 text-[11px]">
              <span className="text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#D4AF37]" /> Sekretariat: Kota Padang, Sumbar
              </span>
              <span className="text-gray-400 flex items-center gap-1">
                <Mail className="w-3 h-3 text-[#3B82F6]" /> kontak@esportsumbar.id
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: COPYRIGHT & CREDITS */}
        <div className="pt-6 border-t border-[#262B38]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#9AA3B2]">
          <p>© 2026 ESPORT SUMBAR. Seluruh hak cipta dilindungi undang-undang.</p>
          <p className="flex items-center gap-1">
            Dibangun dengan bangga untuk kemajuan esport Ranah Minang.
          </p>
        </div>
      </div>
    </footer>
  );
}
