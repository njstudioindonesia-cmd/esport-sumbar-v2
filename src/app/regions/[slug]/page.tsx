import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  ChevronRight,
  ShieldCheck,
  Award,
  Users,
  Gamepad2,
  GraduationCap,
  Calendar,
  Building2,
  Phone,
  Mail,
  Info,
  ExternalLink,
  Trophy,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EsportCard } from "@/components/card/EsportCard";
import { REGIONS_DETAIL } from "@/data/regions";
import { GALLERY_CARDS } from "@/data/mockCards";
import { MOCK_NEWS } from "@/data/mockNews";

export function generateStaticParams() {
  return REGIONS_DETAIL.map((r) => ({
    slug: r.slug,
  }));
}

export default async function RegionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const region = REGIONS_DETAIL.find((r) => r.slug === slug);

  if (!region) {
    notFound();
  }

  // Get profiles belonging to this region
  const regionProfiles = GALLERY_CARDS.filter(
    (c) => c.data.region.code === region.code
  );

  // Get local news for this region
  const localNews = MOCK_NEWS.filter(
    (n) => n.region.toLowerCase().includes(region.name.toLowerCase()) || n.region === "Sumatera Barat"
  );

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-xs text-[#9AA3B2] mb-6 font-mono overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-white transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/regions" className="hover:text-white transition-colors">
            19 Daerah
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#D4AF37] font-bold">{region.name}</span>
        </nav>

        {/* REGION HEADER */}
        <section className="p-6 md:p-8 rounded-2xl bg-[#12151C] border border-[#262B38] mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-48 bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

          <div className="flex flex-col gap-2 z-10 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#1A1E28] border border-[#262B38] text-[10px] font-mono text-[#D4AF37] font-bold uppercase">
                KODE: {region.code}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase ${
                  region.adminMode === "active"
                    ? "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30"
                    : "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30"
                }`}
              >
                {region.adminMode === "active" ? "Pengcab ESI Aktif" : "Mode Fallback ESI Provinsi"}
              </span>
              {region.isPilot && (
                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-[9px] font-heading font-black">
                  WILAYAH PILOT
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-heading font-black uppercase text-white tracking-tight mt-1">
              {region.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#9AA3B2] leading-relaxed">
              {region.description}
            </p>
          </div>

          {/* Quick Metrics Badge Counter */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto shrink-0 z-10">
            <div className="p-3 rounded-xl bg-[#161922] border border-[#262B38] text-center min-w-[80px]">
              <span className="text-xl sm:text-2xl font-heading font-black text-white block">
                {region.playerCount}
              </span>
              <span className="text-[9px] uppercase font-mono text-[#9AA3B2]">
                Pemain
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#161922] border border-[#262B38] text-center min-w-[80px]">
              <span className="text-xl sm:text-2xl font-heading font-black text-[#3B82F6] block">
                {region.teamCount}
              </span>
              <span className="text-[9px] uppercase font-mono text-[#9AA3B2]">
                Klub / Tim
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#161922] border border-[#262B38] text-center min-w-[80px]">
              <span className="text-xl sm:text-2xl font-heading font-black text-[#D4AF37] block">
                {region.verifiedCount}
              </span>
              <span className="text-[9px] uppercase font-mono text-[#9AA3B2]">
                Verified
              </span>
            </div>
          </div>
        </section>

        {/* TWO COLUMN CONTENT: LEFT (PROFILES & AGENDA) | RIGHT (ESI AUTHORITY) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Area */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* PROFILES IN THIS REGION */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#D4AF37]" />
                  <h2 className="text-lg font-heading font-bold uppercase text-white tracking-wider">
                    Profil Terdaftar di {region.name}
                  </h2>
                </div>
                <Link
                  href={`/explore?tab=all`}
                  className="text-xs font-heading font-semibold text-[#D4AF37] hover:underline"
                >
                  Buka Direktori Lengkap
                </Link>
              </div>

              {regionProfiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
                  {regionProfiles.map((item) => (
                    <div key={item.id} className="flex flex-col items-center gap-2">
                      <EsportCard
                        type={item.type}
                        rarity={item.rarity}
                        verification={item.verification}
                        data={item.data}
                        size="sm"
                        interactive={true}
                      />
                      <Link
                        href={`/${item.type}/${(item.data.ign || item.data.teamName || item.data.displayName).toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-[11px] font-heading font-bold uppercase text-[#D4AF37] hover:underline flex items-center gap-1 mt-1"
                      >
                        <span>Lihat Profil Lengkap</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center rounded-2xl bg-[#12151C] border border-[#262B38] text-xs text-[#9AA3B2]">
                  Belum ada profil publik yang ditampilkan untuk wilayah ini pada mode pratinjau.
                  <div className="mt-3">
                    <Link
                      href="/register"
                      className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-heading font-bold uppercase text-xs inline-block"
                    >
                      Daftar Sebagai Atlet Pertama {region.name}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* LOCAL NEWS / AGENDA */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-4 h-4 text-[#3B82F6]" />
                <h2 className="text-lg font-heading font-bold uppercase text-white tracking-wider">
                  Agenda & Informasi Terkait
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {localNews.map((article) => (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className="p-4 rounded-xl bg-[#12151C] border border-[#262B38] hover:border-[#D4AF37]/50 flex flex-col justify-between gap-3 transition-colors group"
                  >
                    <div>
                      <span className="text-[9px] font-heading font-bold uppercase text-[#D4AF37]">
                        {article.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-heading font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2 mt-1">
                        {article.title}
                      </h4>
                    </div>
                    <span className="text-[10px] text-[#9AA3B2] font-mono">
                      {article.date} • {article.region}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: ESI Administrative Authority Card */}
          <aside className="lg:col-span-4 flex flex-col gap-5">
            {/* Authority Card */}
            <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] flex flex-col gap-4 shadow-lg">
              <div className="flex items-center gap-2.5 border-b border-[#262B38] pb-3">
                <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
                <div>
                  <h3 className="font-heading font-bold text-sm uppercase text-white">
                    Pengurus ESI Daerah
                  </h3>
                  <span className="text-[10px] text-[#9AA3B2] font-mono">
                    Otoritas Validasi Tingkat Daerah
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#9AA3B2] block">
                    Penanggung Jawab / Kontak
                  </span>
                  <p className="font-heading font-bold text-gray-200 mt-0.5">
                    {region.esiContactName}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#262B38]/60">
                  <span className="text-[10px] uppercase font-mono text-[#9AA3B2] block">
                    Sekretariat Resmi
                  </span>
                  <p className="text-gray-300 mt-0.5">
                    {region.esiSecretariat}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#262B38]/60">
                  <span className="text-[10px] uppercase font-mono text-[#9AA3B2] block">
                    Mode Pemeriksaan
                  </span>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      region.adminMode === "active"
                        ? "bg-[#22C55E]/15 text-[#22C55E]"
                        : "bg-[#F59E0B]/15 text-[#F59E0B]"
                    }`}
                  >
                    {region.adminMode === "active"
                      ? "Pemeriksaan Mandiri oleh Pengcab Daerah"
                      : "Mode Fallback: Pemeriksaan Langsung oleh ESI Sumbar"}
                  </span>
                </div>
              </div>

              {/* Action Button for Local Admins */}
              <Link
                href="/login"
                className="w-full mt-2 py-2.5 rounded-xl bg-[#1A1E28] hover:bg-[#262B38] border border-[#262B38] text-xs font-heading font-bold uppercase tracking-wider text-gray-200 text-center transition-colors"
              >
                Masuk ke Portal Pengcab {region.code}
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
