import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Network,
  Users,
  Shield,
  Gamepad2,
  Building2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Link2,
  MapPin,
  Flame,
  Award,
} from "lucide-react";
import { getEcosystemStats, getRelationRules } from "@/lib/services/relations";

export const instant = false;

export const metadata = {
  title: "Peta Ekosistem Esport Sumatera Barat | ESPORT SUMBAR V3",
  description:
    "Eksplorasi keterhubungan 7 pilar entitas olahraga elektronik Sumatera Barat: Atlet, Pelatih, Tim, Komunitas, Venue, Sekolah, dan Perguruan Tinggi.",
};

export default async function EcosystemPublicPage() {
  const stats = await getEcosystemStats();
  const rules = await getRelationRules();

  const ENTITY_CARDS = [
    {
      type: "player",
      name: "Atlet (Player)",
      icon: Gamepad2,
      color: "from-blue-500/20 to-cyan-500/10",
      border: "border-blue-500/30",
      textColor: "text-blue-400",
      count: stats.totalPlayers,
      desc: "Talenta kompetitif digital dengan rekam jejak terverifikasi, tier rarity terkelola, dan hak perwakilan tim.",
      canConnectTo: "Klub/Tim, Komunitas, Sekolah, Kampus",
    },
    {
      type: "team",
      name: "Klub & Tim (Team)",
      icon: Users,
      color: "from-[#D4AF37]/20 to-amber-500/10",
      border: "border-[#D4AF37]/40",
      textColor: "text-[#D4AF37]",
      count: stats.totalTeams,
      desc: "Organisasi roster aktif yang menaungi atlet, didukung pelatih terdaftar, dan bertanding di divisi game terdaftar.",
      canConnectTo: "Roster Atlet, Pelatih, Komunitas Naungan, Institusi, Basecamp",
    },
    {
      type: "coach",
      name: "Pelatih (Coach)",
      icon: Award,
      color: "from-purple-500/20 to-indigo-500/10",
      border: "border-purple-500/30",
      textColor: "text-purple-400",
      count: 0,
      desc: "Peracik strategi dan analis taktikal berlisensi dengan rekam jejak kepelatihan yang terverifikasi.",
      canConnectTo: "Klub/Tim, Pembina Sekolah/Kampus, Penasihat Komunitas",
    },
    {
      type: "community",
      name: "Komunitas Esport",
      icon: Flame,
      color: "from-rose-500/20 to-orange-500/10",
      border: "border-rose-500/30",
      textColor: "text-rose-400",
      count: stats.totalCommunities,
      desc: "Wadah pegiat esports akar rumput di 19 kota/kabupaten pembina bibit talenta muda.",
      canConnectTo: "Anggota Komunitas, Tim Naungan, Markas Venue, Kerja Sama Kampus/Sekolah",
    },
    {
      type: "venue",
      name: "Venue & Game House",
      icon: Building2,
      color: "from-emerald-500/20 to-teal-500/10",
      border: "border-emerald-500/30",
      textColor: "text-emerald-400",
      count: stats.totalVenues,
      desc: "Sentra fasilitas latihan, gaming lounge, dan arena turnamen berspesifikasi kompetisi terdaftar.",
      canConnectTo: "Basecamp Tim, Markas Komunitas, Tempat Latihan Sekolah/Kampus",
    },
    {
      type: "campus",
      name: "Perguruan Tinggi (Campus)",
      icon: GraduationCap,
      color: "from-amber-500/20 to-yellow-500/10",
      border: "border-amber-500/30",
      textColor: "text-amber-400",
      count: stats.totalCampuses,
      desc: "Unit kegiatan mahasiswa dan laboratorium esport kampus riset data olahraga elektronik.",
      canConnectTo: "Tim Mahasiswa, Pembina Pelatih, Kerja Sama Komunitas & Venue",
    },
    {
      type: "school",
      name: "Sekolah (School)",
      icon: Shield,
      color: "from-sky-500/20 to-blue-500/10",
      border: "border-sky-500/30",
      textColor: "text-sky-400",
      count: stats.totalSchools,
      desc: "Ekskul esport binaan pelajar dengan perlindungan UU PDP dan kewajiban izin wali untuk siswa di bawah 18 tahun.",
      canConnectTo: "Tim Pelajar, Pembina Pelatih, Tempat Latihan Venue",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white flex flex-col font-sans selection:bg-[#FF1752]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-12">
        {/* HERO SECTION */}
        <section className="relative p-8 lg:p-12 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 shadow-2xl overflow-hidden flex flex-col items-center text-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold uppercase tracking-wider">
            <Network className="w-4 h-4" />
            <span>JARINGAN TUNGGAL TERPADU V3</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black uppercase text-white tracking-tight max-w-4xl">
            Ekosistem Esport <span className="text-[#D4AF37]">Sumatera Barat</span>
          </h1>

          <p className="text-sm sm:text-base text-white/70 max-w-2xl leading-relaxed">
            Pusat interkoneksi antara 7 pilar industri olahraga elektronik Ranah Minang. Satu akun, satu profil, terhubung secara valid dengan aturan deklaratif terverifikasi.
          </p>

          {/* STATS BENTO ROW */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-4xl pt-4">
            <div className="p-4 rounded-2xl bg-[#0B0E17] border border-white/10 text-center">
              <span className="text-2xl sm:text-3xl font-heading font-black text-[#D4AF37] block">
                {stats.totalActiveRelations}
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-white/50 uppercase">
                Hubungan Aktif
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0E17] border border-white/10 text-center">
              <span className="text-2xl sm:text-3xl font-heading font-black text-blue-400 block">
                {stats.totalPlayers}
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-white/50 uppercase">
                Atlet Terdata
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0E17] border border-white/10 text-center">
              <span className="text-2xl sm:text-3xl font-heading font-black text-emerald-400 block">
                {stats.totalTeams}
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-white/50 uppercase">
                Klub &amp; Tim Terdaftar
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0E17] border border-white/10 text-center">
              <span className="text-2xl sm:text-3xl font-heading font-black text-rose-400 block">
                19
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-white/50 uppercase">
                Kota &amp; Kab Terhubung
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/me/profile/new"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#07080C] font-heading font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Daftarkan Profil Anda</span>
            </Link>

            <Link
              href="/explore"
              className="px-6 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-white/80 flex items-center gap-2"
            >
              <span>Jelajahi Direktori</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* 7 ENTITIES SHOWCASE GRID */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-[#D4AF37] uppercase font-bold tracking-wider">
              7 PILAR EKOSISTEM
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight">
              Entitas yang Saling Terhubung
            </h2>
            <p className="text-xs sm:text-sm text-white/60">
              Setiap entitas memiliki aturan hubungan khusus, perlindungan privasi, dan validasi dua arah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ENTITY_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.type}
                  className={`p-6 rounded-3xl bg-gradient-to-br ${card.color} border ${card.border} flex flex-col justify-between gap-5 transition-all hover:scale-[1.01]`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-white/[0.08] border border-white/10 flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${card.textColor}`} />
                      </div>
                      <span className="text-xs font-mono font-bold text-white/40 uppercase">
                        {card.type}
                      </span>
                    </div>

                    <h3 className="font-heading font-black text-xl text-white">
                      {card.name}
                    </h3>

                    <p className="text-xs text-white/70 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 text-xs font-mono flex flex-col gap-1">
                    <span className="text-[10px] text-white/40 uppercase">Target Hubungan Valid:</span>
                    <span className="text-white/90 text-[11px]">{card.canConnectTo}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ATURAN KETERHUBUNGAN EKOSISTEM (RELATION RULES MATRIX) */}
        <section className="p-8 rounded-3xl bg-[#0B0E17] border border-white/10 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-mono text-[#D4AF37] uppercase font-bold tracking-wider">
                MATRIKS ATURAN DEKLARATIF ({rules.length} ATURAN BAKU)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-black uppercase text-white tracking-tight">
              Integritas &amp; Batasan Hubungan (Mandat 6)
            </h2>
            <p className="text-xs text-white/60">
              Aturan ditegakkan secara otomatis di tingkat basis data. Mencegah relasi ilegal, pembajakan atlet, dan referensi yatim.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-all text-xs font-mono flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-white uppercase">{rule.sourceEntityType}</span>
                    <span className="text-white/30">➔</span>
                    <span className="font-bold text-[#D4AF37] uppercase">{rule.targetEntityType}</span>
                  </div>
                  <div className="text-xs text-emerald-400 font-bold capitalize">
                    Jenis: &quot;{rule.relationType.replace("_", " ")}&quot;
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-white/40 pt-2 border-t border-white/[0.05]">
                  <span>Maks. Aktif: <strong className="text-white">{rule.maxActiveLimit}</strong></span>
                  {rule.gameMatchRequired && (
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Wajib Game Sama
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
