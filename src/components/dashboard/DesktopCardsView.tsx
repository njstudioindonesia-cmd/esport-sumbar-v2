"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Share2,
  Download,
  Edit,
  ShieldCheck,
  HelpCircle,
  X,
  CheckCircle2,
  Lock,
  PlusCircle,
  Trophy,
  ExternalLink,
} from "lucide-react";
import { EsportCard } from "@/components/card/EsportCard";
import { GALLERY_CARDS } from "@/data/mockCards";
import { ShareCardModal } from "@/components/card/ShareCardModal";
import { UnifiedCardData, CardRarity, CardVerification } from "@/types/card";

export function DesktopCardsView() {
  const [selectedCard, setSelectedCard] = useState<any>(GALLERY_CARDS[2]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCriteriaDrawer, setShowCriteriaDrawer] = useState(false);

  // User's cards: Player, Coach, Team
  const userCards = [
    {
      id: "card-1",
      type: "player" as const,
      rarity: "elite" as CardRarity,
      verification: "verified" as CardVerification,
      title: "Kartu Atlet Utama",
      data: GALLERY_CARDS[2].data,
    },
    {
      id: "card-2",
      type: "coach" as const,
      rarity: "contender" as CardRarity,
      verification: "regional" as CardVerification,
      title: "Kartu Lisensi Pelatih",
      data: GALLERY_CARDS[5].data,
    },
    {
      id: "card-3",
      type: "team" as const,
      rarity: "elite" as CardRarity,
      verification: "verified" as CardVerification,
      title: "Klub Minang Pride",
      data: GALLERY_CARDS[10].data,
    },
  ];

  const handleDownload = (cardTitle: string) => {
    alert(`Mengunduh kartu paspor ${cardTitle} dalam resolusi tinggi PNG.`);
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-black text-white tracking-tight">
            Kartu Paspor Saya
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Kelola paspor esport resmi kamu yang terdaftar di Pengprov ESI Sumatera Barat.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowCriteriaDrawer(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[#D4AF37]/50 text-xs font-mono text-white/70 hover:text-white transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Kenapa tier ini?</span>
          </button>

          <Link
            href="/me/profile/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] text-xs font-heading font-black uppercase tracking-wider transition-all shadow-md"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Buat Kartu Baru</span>
          </Link>
        </div>
      </div>

      {/* Cards Gallery Grid (Large Cards with Hover Actions) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {userCards.map((card) => (
          <div
            key={card.id}
            className="group relative flex flex-col items-center p-6 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] hover:border-[#D4AF37]/40 shadow-xl transition-all"
          >
            {/* Top Label */}
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-xs font-heading font-bold text-white truncate max-w-[180px]">
                {card.title}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-[10px] font-mono text-[#D4AF37] font-semibold uppercase">
                {card.rarity}
              </span>
            </div>

            {/* The Large Card Display */}
            <div className="py-2">
              <EsportCard
                type={card.type}
                rarity={card.rarity}
                verification={card.verification}
                data={card.data}
                size="md"
                interactive={true}
              />
            </div>

            {/* Hover Action Bar (Bagikan, Unduh, Edit, Ajukan Verifikasi) */}
            <div className="w-full mt-6 pt-4 border-t border-white/[0.08] grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCard(card);
                  setShowShareModal(true);
                }}
                className="h-9 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] font-heading font-bold text-white flex items-center justify-center gap-1.5 transition-all"
              >
                <Share2 className="w-3 h-3 text-[#D4AF37]" />
                <span>Bagikan</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownload(card.title)}
                className="h-9 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] font-heading font-bold text-white flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-3 h-3 text-white/70" />
                <span>Unduh</span>
              </button>

              <Link
                href="/me/profile/new"
                className="h-9 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] font-heading font-bold text-white flex items-center justify-center gap-1.5 transition-all"
              >
                <Edit className="w-3 h-3 text-white/70" />
                <span>Edit</span>
              </Link>

              <Link
                href="/me/verification"
                className="h-9 px-3 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/30 text-[11px] font-heading font-bold text-[#D4AF37] flex items-center justify-center gap-1.5 transition-all"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Verifikasi</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* DRAWER "KENAPA TIER INI?" (SIDE CHECKLIST CRITERIA)       */}
      {/* ========================================================= */}
      {showCriteriaDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md h-full bg-[#0E1118] border-l border-white/10 p-8 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-heading font-black text-lg text-white">
                    Kriteria Tier Kartu
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCriteriaDrawer(false)}
                  className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tier Breakdown Checklist */}
              <div className="flex flex-col gap-6 mt-6">
                {/* TIER 1 ROOKIE */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-[#8C5A3C]/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-bold text-sm text-[#E6B89C]">
                      TIER 1 • ROOKIE
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      STATUS ANDA
                    </span>
                  </div>
                  <ul className="text-xs text-white/70 space-y-1.5">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      Mendaftar akun dan membuat kartu profil.
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      Status awal belum terverifikasi Pengcab.
                    </li>
                  </ul>
                </div>

                {/* TIER 2 CONTENDER */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-slate-500/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-bold text-sm text-[#94A3B8]">
                      TIER 2 • CONTENDER
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      TERVERIFIKASI
                    </span>
                  </div>
                  <ul className="text-xs text-white/70 space-y-1.5">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      Verifikasi identitas oleh Pengcab ESI Kota/Kabupaten.
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      Minimal 1 kali riwayat kejuaraan tingkat kota.
                    </li>
                  </ul>
                </div>

                {/* TIER 3 ELITE */}
                <div className="p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-bold text-sm text-[#D4AF37]">
                      TIER 3 • ELITE
                    </span>
                    <span className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/20 px-2 py-0.5 rounded font-bold">
                      AKTIF SEKARANG
                    </span>
                  </div>
                  <ul className="text-xs text-white/80 space-y-1.5">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      Verifikasi resmi Pengprov ESI Sumatera Barat.
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      Juara 1-3 Kejurda atau turnamen resmi PBESI Sumbar.
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      Nomor lencana resmi ESI-SB-VER-YYYY-XXXX.
                    </li>
                  </ul>
                </div>

                {/* TIER 4 LEGEND */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-purple-500/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-bold text-sm text-purple-400">
                      TIER 4 • LEGEND
                    </span>
                    <span className="text-[10px] font-mono text-white/40 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> TERKUNCI
                    </span>
                  </div>
                  <ul className="text-xs text-white/60 space-y-1.5">
                    <li className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-white/30 shrink-0" />
                      Medali PON, Kejurnas, atau Timnas PBESI Indonesia.
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-white/30 shrink-0" />
                      Sertifikasi Nasional PBESI Pusat.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCriteriaDrawer(false)}
              className="w-full h-11 mt-6 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs font-mono text-white font-bold transition-colors"
            >
              Tutup Panduan
            </button>
          </div>
        </div>
      )}

      {/* SHARE MODAL DIALOG */}
      {showShareModal && selectedCard && (
        <ShareCardModal
          cardData={selectedCard}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
