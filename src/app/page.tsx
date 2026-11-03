"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  ShieldCheck,
  Award,
  Rotate3d,
  Info,
  Filter,
  Users,
  Gamepad2,
  GraduationCap,
  Shield,
  Search,
  Eye,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { EsportCard } from "@/components/card/EsportCard";
import { GALLERY_CARDS, MockCardVariant } from "@/data/mockCards";
import {
  CardRarity,
  CardVerification,
  CardEntityType,
  CardSize,
} from "@/types/card";

export default function GaleriKartuPage() {
  const [cards, setCards] = useState<MockCardVariant[]>(GALLERY_CARDS);
  const [selectedType, setSelectedType] = useState<CardEntityType | "all">("all");
  const [selectedRarity, setSelectedRarity] = useState<CardRarity | "all">("all");
  const [selectedVerification, setSelectedVerification] = useState<CardVerification | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cardSize, setCardSize] = useState<CardSize>("md");
  const [allFlipped, setAllFlipped] = useState(false);

  // Live filter predicate
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchType = selectedType === "all" || card.type === selectedType;
      const matchRarity = selectedRarity === "all" || card.rarity === selectedRarity;
      const matchVerif = selectedVerification === "all" || card.verification === selectedVerification;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        card.data.displayName.toLowerCase().includes(query) ||
        (card.data.ign && card.data.ign.toLowerCase().includes(query)) ||
        (card.data.teamName && card.data.teamName.toLowerCase().includes(query)) ||
        card.data.region.name.toLowerCase().includes(query) ||
        card.data.game.toLowerCase().includes(query) ||
        card.data.esportId.toLowerCase().includes(query);

      return matchType && matchRarity && matchVerif && matchSearch;
    });
  }, [cards, selectedType, selectedRarity, selectedVerification, searchQuery]);

  const updateCardRarity = (id: string, rarity: CardRarity) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, rarity } : c))
    );
  };

  const updateCardVerification = (id: string, verification: CardVerification) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, verification } : c))
    );
  };

  return (
    <main className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] px-4 py-8 md:py-12 flex flex-col items-center">
      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-gradient-to-b from-[#C8102E]/15 via-[#D4AF37]/5 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-12 left-10 w-80 h-80 bg-[#3B82F6]/5 blur-3xl rounded-full" />
        <div className="absolute bottom-12 right-10 w-80 h-80 bg-[#7C3AED]/5 blur-3xl rounded-full" />
      </div>

      {/* HEADER SECTION */}
      <header className="relative z-10 text-center max-w-4xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1E28] border border-[#262B38] mb-4 shadow-sm">
          <div className="flex h-2.5 w-6 rounded-sm overflow-hidden" title="Minang Marawa Accent">
            <span className="w-1/3 bg-[#C8102E]" />
            <span className="w-1/3 bg-[#D4AF37]" />
            <span className="w-1/3 bg-black" />
          </div>
          <span className="text-xs font-heading tracking-wider uppercase font-bold text-gray-300">
            ESPORT SUMBAR • GALERI KARTU DIGITAL TCG
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-heading font-extrabold uppercase tracking-tight text-white mb-3">
          Galeri Kartu <span className="text-[#D4AF37]">3 Tipe × 4 Rarity</span>
        </h1>
        <p className="text-sm md:text-base text-[#9AA3B2] leading-relaxed max-w-2xl mx-auto">
          Ekosistem kartu identitas digital untuk <strong className="text-white">Player (Atlet)</strong>,{" "}
          <strong className="text-[#3B82F6]">Coach (Pelatih)</strong>, dan{" "}
          <strong className="text-[#22C55E]">Team (Klub/Squad)</strong> dengan efek 3D Tilt interaktif serta pemisahan tegas Frame Rarity vs Lencana Verifikasi ESI.
        </p>
      </header>

      {/* FILTER & CONTROL TOOLBAR */}
      <section className="relative z-10 w-full max-w-6xl mb-8 p-4 md:p-5 rounded-2xl bg-[#12151C]/90 border border-[#262B38] backdrop-blur-md flex flex-col gap-4 shadow-xl">
        {/* Top Controls: Entity Type Pills & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Entity Type Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-heading font-bold text-[#9AA3B2] uppercase tracking-wider mr-1">
              Entitas:
            </span>
            {[
              { id: "all", label: "Semua (12)", icon: Sparkles },
              { id: "player", label: "Player (4)", icon: Gamepad2 },
              { id: "coach", label: "Coach (4)", icon: GraduationCap },
              { id: "team", label: "Team (4)", icon: Users },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedType(t.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    selectedType === t.id
                      ? "bg-[#D4AF37] text-[#0B0D12] shadow-md"
                      : "bg-[#1A1E28] text-gray-300 hover:text-white hover:bg-[#262B38]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari IGN, tim, wilayah, game..."
              className="w-full bg-[#1A1E28] border border-[#262B38] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Secondary Filter Bar: Rarity, Verification & Display Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#262B38]/70">
          <div className="flex flex-wrap items-center gap-2">
            {/* Rarity Filter */}
            <div className="flex items-center gap-1 bg-[#1A1E28] p-1 rounded-lg border border-[#262B38]">
              <span className="text-[10px] font-heading font-bold text-[#9AA3B2] uppercase px-1.5">
                Rarity:
              </span>
              {(["all", "rookie", "contender", "elite", "legend"] as const).map(
                (r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRarity(r)}
                    className={`px-2 py-0.5 rounded text-[10px] font-heading font-bold uppercase transition-all ${
                      selectedRarity === r
                        ? "bg-[#D4AF37] text-black shadow-sm"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {r}
                  </button>
                )
              )}
            </div>

            {/* Verification Filter */}
            <div className="flex items-center gap-1 bg-[#1A1E28] p-1 rounded-lg border border-[#262B38]">
              <span className="text-[10px] font-heading font-bold text-[#9AA3B2] uppercase px-1.5">
                Verifikasi:
              </span>
              {[
                { id: "all", label: "Semua" },
                { id: "regional", label: "Regional" },
                { id: "verified", label: "Verified" },
                { id: "unverified", label: "Unverified" },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVerification(v.id as any)}
                  className={`px-2 py-0.5 rounded text-[10px] font-heading font-bold uppercase transition-all ${
                    selectedVerification === v.id
                      ? "bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size & Flip Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#1A1E28] p-1 rounded-lg border border-[#262B38]">
              {(["sm", "md", "lg"] as CardSize[]).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setCardSize(sz)}
                  className={`px-2.5 py-0.5 rounded text-[10px] font-heading font-bold uppercase transition-all ${
                    cardSize === sz
                      ? "bg-[#D4AF37] text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setAllFlipped(!allFlipped)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1E28] hover:bg-[#262B38] border border-[#262B38] text-xs font-heading font-bold uppercase tracking-wider text-gray-200 transition-colors"
            >
              <Rotate3d className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>{allFlipped ? "Sisi Depan" : "Balik Semua"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* CARDS GRID */}
      <section className="relative z-10 w-full max-w-6xl mb-14">
        {filteredCards.length === 0 ? (
          <div className="w-full p-12 text-center rounded-2xl bg-[#12151C] border border-[#262B38]">
            <Filter className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <h3 className="font-heading font-bold text-lg text-white">
              Tidak Ada Kartu yang Cocok
            </h3>
            <p className="text-xs text-[#9AA3B2] mt-1">
              Coba sesuaikan kata kunci pencarian atau ubah kombinasi filter Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {filteredCards.map((variant) => (
              <div
                key={variant.id}
                className="flex flex-col items-center gap-3.5 w-full max-w-[360px]"
              >
                {/* 3D TCG Card */}
                <EsportCard
                  type={variant.type}
                  rarity={variant.rarity}
                  verification={variant.verification}
                  data={variant.data}
                  size={cardSize}
                  interactive={true}
                  initialFlipped={allFlipped}
                />

                {/* Interactive Customizer Panel */}
                <div className="w-full bg-[#12151C] border border-[#262B38] rounded-xl p-3 flex flex-col gap-2 shadow-md">
                  <div className="flex items-center justify-between border-b border-[#262B38]/80 pb-1">
                    <span className="text-xs font-heading font-bold text-white uppercase tracking-wider truncate">
                      {variant.type === "team"
                        ? variant.data.teamName
                        : variant.data.ign || variant.data.displayName}
                    </span>
                    <span className="text-[10px] text-[#9AA3B2] font-mono shrink-0">
                      {variant.data.region.name}
                    </span>
                  </div>

                  <p className="text-[10px] text-[#9AA3B2] italic leading-tight">
                    {variant.tagline}
                  </p>

                  {/* Switch Rarity Frame */}
                  <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#262B38]/50">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-[#9AA3B2] shrink-0">
                      Rarity:
                    </span>
                    <div className="grid grid-cols-4 gap-1 flex-1">
                      {(["rookie", "contender", "elite", "legend"] as CardRarity[]).map(
                        (r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => updateCardRarity(variant.id, r)}
                            className={`py-0.5 px-1 rounded text-[9px] font-heading font-bold uppercase text-center transition-all ${
                              variant.rarity === r
                                ? "bg-[#D4AF37] text-black shadow-sm"
                                : "bg-[#1A1E28] text-gray-400 hover:text-white"
                            }`}
                          >
                            {r.slice(0, 4)}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Switch Verification Badge */}
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-[#9AA3B2] shrink-0">
                      Verifikasi:
                    </span>
                    <div className="grid grid-cols-3 gap-1 flex-1">
                      {(
                        [
                          { id: "unverified", label: "None" },
                          { id: "regional", label: "Regional" },
                          { id: "verified", label: "Verified" },
                        ] as const
                      ).map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() =>
                            updateCardVerification(
                              variant.id,
                              v.id as CardVerification
                            )
                          }
                          className={`py-0.5 px-1 rounded text-[9px] font-heading font-medium text-center transition-all ${
                            variant.verification === v.id
                              ? "bg-[#22C55E]/20 border border-[#22C55E] text-[#22C55E]"
                              : "bg-[#1A1E28] text-gray-400 hover:text-white"
                          }`}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SIDE-BY-SIDE EDUCATIONAL COMPARISON PANEL (FRAME vs LENCANA) */}
      <section className="relative z-10 w-full max-w-5xl bg-[#12151C] border border-[#262B38] rounded-2xl p-6 md:p-8 shadow-2xl mb-12">
        <div className="flex items-center gap-2.5 mb-6 border-b border-[#262B38] pb-4">
          <Info className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <h2 className="text-xl font-heading font-bold uppercase tracking-wider text-white">
              Prinsip P1: Pemisahan Frame (Rarity) vs Lencana (Verifikasi)
            </h2>
            <p className="text-xs text-[#9AA3B2]">
              Aturan fundamental tata kelola kartu ESPORT SUMBAR untuk menjaga integritas kelembagaan ESI.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* KOLOM KIRI: FRAME RARITY */}
          <div className="flex flex-col gap-3 p-5 rounded-xl bg-[#1A1E28]/70 border border-[#262B38]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C084FC]" />
              <h3 className="font-heading font-bold text-sm uppercase text-gray-100">
                1. Frame Kartu (Rarity Visual)
              </h3>
            </div>
            <p className="text-xs text-[#9AA3B2] leading-relaxed">
              Frame kartu berfokus pada <strong>prestasi dan kelengkapan profil</strong> atlet/klub. Ini merupakan sistem gamifikasi visual dan <em>bukan</em> pengesahan legal.
            </p>

            <div className="space-y-2 mt-2">
              <div className="flex items-start gap-2 text-xs p-2 rounded bg-[#12151C] border border-[#8C5A3C]/40">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8C5A3C] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#E6B89C]">Tier 1 - Rookie (Perunggu):</strong>
                  <p className="text-[11px] text-[#9AA3B2]">Akun terdaftar dengan data dasar.</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs p-2 rounded bg-[#12151C] border border-[#94A3B8]/40">
                <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-200">Tier 2 - Contender (Perak):</strong>
                  <p className="text-[11px] text-[#9AA3B2]">Kelengkapan ≥ 80% dan minimal 1 relasi aktif terkonfirmasi.</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs p-2 rounded bg-[#12151C] border border-[#D4AF37]/40">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#D4AF37]">Tier 3 - Elite (Emas Holografik):</strong>
                  <p className="text-[11px] text-[#9AA3B2]">Memiliki ≥ 1 prestasi kejuaraan dengan bukti tervalidasi.</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs p-2 rounded bg-[#12151C] border border-[#C084FC]/40">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C084FC] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#C084FC]">Tier 4 - Legend (Kristal Animasi):</strong>
                  <p className="text-[11px] text-[#9AA3B2]">Peraih medali PON/Kejurnas/Provinsi atau kontribusi luar biasa.</p>
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: LENCANA VERIFIKASI */}
          <div className="flex flex-col gap-3 p-5 rounded-xl bg-[#1A1E28]/70 border border-[#262B38]">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="font-heading font-bold text-sm uppercase text-gray-100">
                2. Lencana Verifikasi (Kelembagaan ESI)
              </h3>
            </div>
            <p className="text-xs text-[#9AA3B2] leading-relaxed">
              Lencana perisai di sudut kanan atas merupakan <strong>otoritas kelembagaan ESI</strong>. Hanya diberikan setelah melalui proses verifikasi berjenjang.
            </p>

            <div className="space-y-2 mt-2">
              <div className="flex items-start gap-2 text-xs p-2 rounded bg-[#12151C] border border-gray-700">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-400">Unverified:</strong>
                  <p className="text-[11px] text-[#9AA3B2]">Belum mengajukan atau dalam tahap pendaftaran mandiri.</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs p-2 rounded bg-[#12151C] border border-[#22C55E]/40">
                <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#22C55E]">Regional Checked:</strong>
                  <p className="text-[11px] text-[#9AA3B2]">Telah diperiksa dan disetujui oleh Pengcab ESI Kota/Kabupaten.</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs p-2 rounded bg-[#12151C] border border-[#D4AF37]/40">
                <Award className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#D4AF37]">Verified (ESI Sumbar):</strong>
                  <p className="text-[11px] text-[#9AA3B2]">Verifikasi resmi Pengprov ESI Sumbar + Nomor Register Lencana.</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs p-2 rounded bg-[#12151C] border border-[#F59E0B]/40">
                <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F59E0B]">Menunggu Verifikasi Ulang:</strong>
                  <p className="text-[11px] text-[#9AA3B2]">Terjadi perubahan data kunci (tim, domisili, IGN) pada profil terverifikasi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 text-center text-xs text-[#9AA3B2] py-4">
        ESPORT SUMBAR Platform • Inisiatif Tata Kelola Digital Ekosistem Esport Sumatera Barat
      </footer>
    </main>
  );
}
