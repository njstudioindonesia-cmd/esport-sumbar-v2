"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Award,
  Layers,
  Rotate3d,
  Info,
  CheckCircle2,
  AlertTriangle,
  Compass,
} from "lucide-react";
import { EsportCard } from "@/components/card/EsportCard";
import { MOCK_PLAYERS, MockCardVariant } from "@/data/mockCards";
import { CardRarity, CardVerification, CardSize } from "@/types/card";

export default function CardsDemoPage() {
  const [cards, setCards] = useState<MockCardVariant[]>(MOCK_PLAYERS);
  const [cardSize, setCardSize] = useState<CardSize>("md");
  const [allFlipped, setAllFlipped] = useState(false);

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
      {/* BACKGROUND ACCENTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#C8102E]/10 via-[#D4AF37]/5 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#3B82F6]/5 blur-3xl rounded-full" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#7C3AED]/5 blur-3xl rounded-full" />
      </div>

      {/* HEADER SECTION */}
      <header className="relative z-10 text-center max-w-3xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1E28] border border-[#262B38] mb-4">
          <div className="flex h-2.5 w-6 rounded-sm overflow-hidden">
            <span className="w-1/3 bg-[#C8102E]" />
            <span className="w-1/3 bg-[#D4AF37]" />
            <span className="w-1/3 bg-black" />
          </div>
          <span className="text-xs font-heading tracking-wider uppercase font-bold text-gray-300">
            ESPORT SUMBAR • PROTOTYPE PROMPT 1.1
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-heading font-extrabold uppercase tracking-tight text-white mb-3">
          Kartu Atlet <span className="text-[#D4AF37]">ESPORT ID</span>
        </h1>
        <p className="text-sm md:text-base text-[#9AA3B2] leading-relaxed max-w-2xl mx-auto">
          Identitas digital bergaya TCG untuk atlet esport Sumatera Barat. Menampilkan pemisahan tegas antara{" "}
          <strong className="text-white">Frame Rarity</strong> (pencapaian kompetisi) dan{" "}
          <strong className="text-[#D4AF37]">Lencana Verifikasi</strong> (pengesahan resmi ESI).
        </p>
      </header>

      {/* CONTROLS BAR */}
      <section className="relative z-10 w-full max-w-5xl mb-8 p-4 rounded-xl bg-[#12151C]/90 border border-[#262B38] backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        {/* Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-heading font-semibold text-[#9AA3B2] uppercase tracking-wider">
            Ukuran Kartu:
          </span>
          <div className="flex bg-[#1A1E28] p-1 rounded-lg border border-[#262B38]">
            {(["sm", "md", "lg"] as CardSize[]).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setCardSize(sz)}
                className={`px-3 py-1 rounded text-xs font-heading font-bold uppercase transition-all ${
                  cardSize === sz
                    ? "bg-[#D4AF37] text-[#0B0D12] shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Global Flip Trigger */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAllFlipped(!allFlipped)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#1A1E28] hover:bg-[#262B38] border border-[#262B38] text-xs font-heading font-bold uppercase tracking-wider text-gray-200 transition-colors"
          >
            <Rotate3d className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>{allFlipped ? "Tampilkan Sisi Depan" : "Balik Semua Kartu"}</span>
          </button>
          <span className="hidden sm:inline-block text-[11px] text-[#9AA3B2]">
            Tip: Gerakkan kursor atau klik kartu untuk flip 3D.
          </span>
        </div>
      </section>

      {/* CARDS DISPLAY CONTAINER */}
      <section className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-12">
        {cards.map((variant) => (
          <div
            key={variant.id}
            className="flex flex-col items-center gap-4 w-full max-w-[360px]"
          >
            {/* Card Preview */}
            <EsportCard
              rarity={variant.rarity}
              verification={variant.verification}
              data={variant.data}
              size={cardSize}
              interactive={true}
              initialFlipped={allFlipped}
            />

            {/* Customizer Panel for This Card */}
            <div className="w-full bg-[#12151C] border border-[#262B38] rounded-xl p-3.5 flex flex-col gap-2.5 shadow-lg">
              <div className="flex items-center justify-between border-b border-[#262B38]/80 pb-1.5">
                <span className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                  {variant.data.ign}
                </span>
                <span className="text-[10px] text-[#9AA3B2] font-mono">
                  {variant.data.region.name}
                </span>
              </div>

              {/* Rarity Buttons */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#9AA3B2]">
                  Frame Rarity:
                </span>
                <div className="grid grid-cols-4 gap-1">
                  {(["rookie", "contender", "elite", "legend"] as CardRarity[]).map(
                    (r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => updateCardRarity(variant.id, r)}
                        className={`py-1 px-1 rounded text-[10px] font-heading font-bold uppercase tracking-tight text-center transition-all ${
                          variant.rarity === r
                            ? "bg-[#D4AF37] text-black shadow-md"
                            : "bg-[#1A1E28] text-gray-400 hover:text-white hover:bg-[#262B38]"
                        }`}
                      >
                        {r.slice(0, 4)}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Verification Buttons */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#9AA3B2]">
                  Lencana Verifikasi (ESI):
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {(
                    [
                      { id: "unverified", label: "None" },
                      { id: "regional", label: "Regional" },
                      { id: "verified", label: "Verified" },
                      { id: "reverify", label: "Re-verify" },
                      { id: "suspended", label: "Suspend" },
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
                      className={`py-1 px-1 rounded text-[10px] font-heading font-medium tracking-tight text-center transition-all ${
                        variant.verification === v.id
                          ? "bg-[#22C55E]/20 border border-[#22C55E] text-[#22C55E]"
                          : "bg-[#1A1E28] text-gray-400 hover:text-white hover:bg-[#262B38]"
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
      </section>

      {/* EDUCATIONAL LEGENDA: PRINSIP P1 PRD */}
      <section className="relative z-10 w-full max-w-4xl bg-[#12151C] border border-[#262B38] rounded-2xl p-6 shadow-xl mb-12">
        <div className="flex items-center gap-2 mb-4 border-b border-[#262B38] pb-3">
          <Info className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="text-lg font-heading font-bold uppercase tracking-wider text-white">
            Panduan Desain & Tata Kelola Kartu (Prinsip P1)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kolom 1: Frame Rarity */}
          <div className="p-4 rounded-xl bg-[#1A1E28]/60 border border-[#262B38]">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#C084FC]" />
              <h3 className="font-heading font-bold text-sm uppercase text-gray-100">
                1. Frame Rarity (Pencapaian)
              </h3>
            </div>
            <p className="text-xs text-[#9AA3B2] leading-relaxed mb-3">
              Frame kartu sepenuhnya ditentukan oleh keaktifan profil, persentase kelengkapan data, dan prestasi turnamen tervalidasi. <strong>Frame tidak bisa dibeli dengan uang dan bukan tanda pengesahan institusional.</strong>
            </p>
            <ul className="text-xs text-gray-300 space-y-1.5">
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#8C5A3C]" />
                <strong>Rookie:</strong> Profil terdaftar dengan data dasar.
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#94A3B8]" />
                <strong>Contender:</strong> Kelengkapan data ≥ 80% & punya tim/relasi.
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                <strong>Elite:</strong> Memiliki minimal 1 prestasi tervalidasi.
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C084FC]" />
                <strong>Legend:</strong> Medali PON/Porprov/Nasional atau pengakuan khusus.
              </li>
            </ul>
          </div>

          {/* Kolom 2: Lencana Verifikasi ESI */}
          <div className="p-4 rounded-xl bg-[#1A1E28]/60 border border-[#262B38]">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="font-heading font-bold text-sm uppercase text-gray-100">
                2. Lencana Verifikasi (Kelembagaan ESI)
              </h3>
            </div>
            <p className="text-xs text-[#9AA3B2] leading-relaxed mb-3">
              Lencana perisai di sudut kanan atas merupakan wewenang mutlak ESI. Operator platform tidak berhak memberikan lencana ini secara sepihak.
            </p>
            <ul className="text-xs text-gray-300 space-y-1.5">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                <strong>Regional Checked:</strong> Lulus validasi ESI Kab/Kota.
              </li>
              <li className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                <strong>Verified:</strong> Terverifikasi penuh ESI Provinsi Sumbar.
              </li>
              <li className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
                <strong>Re-Verifikasi:</strong> Data kunci diubah; memerlukan verifikasi ulang.
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-500" />
                <strong>Suspended:</strong> Verifikasi dinonaktifkan sementara.
              </li>
            </ul>
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
