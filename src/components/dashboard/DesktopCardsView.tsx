"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Share2,
  Download,
  Edit,
  ShieldCheck,
  PlusCircle,
  HelpCircle,
  CheckCircle2,
  X,
  Trophy,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import { EsportCard } from "@/components/card/EsportCard";
import { ShareCardModal } from "@/components/card/ShareCardModal";
import { UnifiedCardData, CardRarity, CardVerification, mapVerificationToCard } from "@/types/card";

interface UserProfileCardItem {
  id: string;
  type: any;
  rarity: CardRarity;
  verification: CardVerification;
  title: string;
  slug: string;
  data: UnifiedCardData;
}

export function DesktopCardsView() {
  const [cards, setCards] = useState<UserProfileCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCriteriaDrawer, setShowCriteriaDrawer] = useState(false);

  // Ambil profil nyata dari database via /api/me/profiles
  useEffect(() => {
    let isMounted = true;
    async function fetchCards() {
      try {
        const res = await fetch("/api/me/profiles");
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.profiles) {
            const mapped: UserProfileCardItem[] = json.profiles.map((p: any) => ({
              id: p.id,
              type: p.entityType || "player",
              rarity: (p.rarityTier as CardRarity) || "rookie",
              verification: mapVerificationToCard(p.verificationStatus),
              title: `Kartu ${p.displayName}`,
              slug: p.slug,
              data: {
                esportId: p.esportId,
                displayName: p.displayName,
                ign: p.ign || undefined,
                avatarUrl: p.avatarUrl || undefined,
                region: {
                  name: p.regionName || "Sumatera Barat",
                  code: p.regionCode || "SB",
                },
                game: p.mainGameName || "Esport",
                role: p.roleName || undefined,
                joinedAt: p.createdAt ? new Date(p.createdAt).getFullYear().toString() : undefined,
              },
            }));
            setCards(mapped);
            if (mapped.length > 0) {
              setSelectedCard(mapped[0]);
            }
          }
        }
      } catch (e) {
        console.warn("Failed to load user cards:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchCards();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDownload = (cardTitle: string) => {
    alert(`Mengunduh kartu paspor ${cardTitle} dalam resolusi tinggi PNG.`);
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF1752] hover:bg-[#E01447] text-white text-xs font-heading font-black uppercase tracking-wider transition-all shadow-md shadow-[#FF1752]/20"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Buat Kartu Baru</span>
          </Link>
        </div>
      </div>

      {/* State Loading */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="h-96 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] animate-pulse" />
          ))}
        </div>
      ) : cards.length === 0 ? (
        /* Empty State: Belum memiliki profil */
        <div className="w-full p-12 rounded-3xl bg-[#0F1118]/60 border border-white/[0.08] flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#FF1752]/10 border border-[#FF1752]/30 flex items-center justify-center text-[#FF1752] shadow-lg shadow-[#FF1752]/15">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-heading font-black text-xl text-white">Belum Ada Kartu Paspor</h3>
            <p className="text-xs text-white/50 max-w-md mt-1 leading-relaxed">
              Anda belum memiliki kartu paspor digital resmi PBESI Sumatera Barat. Daftarkan identitas Anda sekarang untuk mendapatkan ESPORT ID resmi dan akses turnamen.
            </p>
          </div>
          <Link
            href="/me/profile/new"
            className="btn-brand-primary text-xs py-2.5 px-6 flex items-center gap-2 mt-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Buat Kartu Paspor Pertama</span>
          </Link>
        </div>
      ) : (
        /* Cards Gallery Grid (Large Cards with Hover Actions) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card) => (
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

              {/* Action Bar (Bagikan, Unduh, Edit, Profil Publik) */}
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
                  href={`/me/profile/${card.id}/edit`}
                  className="h-9 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] font-heading font-bold text-white flex items-center justify-center gap-1.5 transition-all"
                >
                  <Edit className="w-3 h-3 text-white/70" />
                  <span>Edit Profil</span>
                </Link>

                <Link
                  href={`/${card.type}/${card.slug}`}
                  target="_blank"
                  className="h-9 px-3 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/30 text-[11px] font-heading font-bold text-[#D4AF37] flex items-center justify-center gap-1.5 transition-all"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Lihat Publik</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

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
                      PENDAFTARAN AWAL
                    </span>
                  </div>
                  <ul className="text-xs text-white/70 space-y-1.5">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      Mendaftar akun dan membuat kartu profil digital.
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
                      LOLOS DAERAH
                    </span>
                  </div>
                  <ul className="text-xs text-white/70 space-y-1.5">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      Telah diverifikasi resmi oleh Pengcab ESI Kabupaten/Kota.
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      Mendapatkan lencana hijau regional approved.
                    </li>
                  </ul>
                </div>

                {/* TIER 3 ELITE */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-[#D4AF37]/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-bold text-sm text-[#D4AF37]">
                      TIER 3 • ELITE
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      VERIFIKASI PROVINSI
                    </span>
                  </div>
                  <ul className="text-xs text-white/70 space-y-1.5">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      Verifikasi Pengprov ESI Sumatera Barat dengan Nomor Register Lencana.
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      Memiliki rekam jejak turnamen resmi atau kejuaraan daerah.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.08]">
              <Link
                href="/me/verification"
                onClick={() => setShowCriteriaDrawer(false)}
                className="w-full btn-brand-primary text-xs py-3 text-center flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Ajukan Verifikasi Sekarang</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal Dialog */}
      {showShareModal && selectedCard && (
        <ShareCardModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          cardData={selectedCard}
        />
      )}
    </div>
  );
}
