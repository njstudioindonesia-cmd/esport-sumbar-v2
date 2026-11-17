"use client";

import React, { useState } from "react";
import {
  Edit3,
  ShieldCheck,
  Network,
  Lock,
  Eye,
  EyeOff,
  Share2,
  CheckCircle2,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Button, StatusBadge } from "@esport-sumbar/ui";
import type { UnifiedProfileDetail } from "@/lib/services/public-profiles";
import { ProfileEditDrawer } from "./drawers/ProfileEditDrawer";
import { VerificationDrawer } from "./drawers/VerificationDrawer";
import { PrivacySettingsModal } from "./drawers/PrivacySettingsModal";
import { ShareCardModal } from "@/components/card/ShareCardModal";
import { mapVerificationToCard } from "@esport-sumbar/contracts";

export interface OwnerControlBarProps {
  profile: UnifiedProfileDetail;
  previewAsPublic: boolean;
  onTogglePreviewPublic: (enabled: boolean) => void;
  onSelectTab?: (tab: string) => void;
  onProfileUpdated?: () => void;
  initialAction?: "edit" | "verify" | "privacy" | "ecosystem" | null;
}

export function OwnerControlBar({
  profile,
  previewAsPublic,
  onTogglePreviewPublic,
  onSelectTab,
  onProfileUpdated,
  initialAction,
}: OwnerControlBarProps) {
  const [editDrawerOpen, setEditDrawerOpen] = useState(initialAction === "edit");
  const [verificationDrawerOpen, setVerificationDrawerOpen] = useState(
    initialAction === "verify"
  );
  const [privacyModalOpen, setPrivacyModalOpen] = useState(
    initialAction === "privacy"
  );
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // If in Preview as Public mode, render only a small sticky floating pill to return to Owner Mode
  if (previewAsPublic) {
    return (
      <div className="sticky top-20 z-40 mb-6 flex items-center justify-between p-3 px-5 rounded-2xl bg-[#0C0C26]/90 border border-[#FF1752]/40 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="flex items-center gap-2.5 text-xs text-white/70">
          <Eye className="w-4 h-4 text-[#FF1752]" />
          <span>Sedang melihat pratinjau publik (seperti tamu)</span>
        </div>
        <button
          type="button"
          onClick={() => onTogglePreviewPublic(false)}
          className="px-3 py-1.5 rounded-xl bg-[#FF1752] hover:bg-[#E01246] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
        >
          <EyeOff className="w-3.5 h-3.5" />
          <span>Kembali ke Mode Pemilik</span>
        </button>
      </div>
    );
  }

  const cardStatus = mapVerificationToCard(profile.verificationStatus);

  return (
    <>
      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-[#0C0C26] border border-[#FF1752]/30 shadow-[0_8px_28px_rgba(255,23,82,0.08)] flex flex-col gap-4">
        {/* Top Meta Line */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF1752]/15 border border-[#FF1752]/40 flex items-center justify-center text-[#FF1752] shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  Ini Profil &amp; Kartu Anda
                </span>
                <span className="px-2 py-0.5 rounded bg-[#FF1752]/20 text-[10px] font-mono font-bold text-[#FF1752]">
                  PEMILIK RESMI
                </span>
              </div>
              <p className="text-[11px] text-white/50">
                Kelola data, dokumen verifikasi, keterhubungan tim, dan privasi langsung di tempat.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <StatusBadge status={cardStatus} size="sm" />
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setEditDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-bold text-white transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#FF1752]" />
            <span>Edit Data &amp; Foto</span>
          </button>

          <button
            type="button"
            onClick={() => setVerificationDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-bold text-white transition-all cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Verifikasi &amp; Lencana</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab("ecosystem")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-bold text-white transition-all cursor-pointer"
          >
            <Network className="w-3.5 h-3.5 text-[#2BB673]" />
            <span>Kemitraan Ekosistem</span>
          </button>

          <button
            type="button"
            onClick={() => setPrivacyModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-bold text-white transition-all cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-white/50" />
            <span>Privasi Data</span>
          </button>

          <button
            type="button"
            onClick={() => setShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-bold text-white transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-white/50" />
            <span>Bagikan Kartu</span>
          </button>

          <div className="ml-auto">
            <button
              type="button"
              onClick={() => onTogglePreviewPublic(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#05051A] hover:bg-black/60 border border-white/15 text-xs font-semibold text-white/70 hover:text-white transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#FF1752]" />
              <span>Pratinjau Publik</span>
            </button>
          </div>
        </div>
      </div>

      {/* Drawers and Modals */}
      <ProfileEditDrawer
        isOpen={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        profile={profile}
        onSuccess={() => {
          if (onProfileUpdated) onProfileUpdated();
        }}
      />

      <VerificationDrawer
        isOpen={verificationDrawerOpen}
        onClose={() => setVerificationDrawerOpen(false)}
        profile={profile}
        onSuccess={() => {
          if (onProfileUpdated) onProfileUpdated();
        }}
      />

      <PrivacySettingsModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        profile={profile}
      />

      {shareModalOpen && (
        <ShareCardModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          cardData={{
            type: profile.entityType as any,
            rarity: (profile.rarityTier as any) || "rookie",
            verification: (cardStatus === "prov_verified" ? "verified" : cardStatus) as any,
            data: {
              slug: profile.slug,
              esportId: profile.esportId,
              displayName: profile.displayName,
              ign: profile.ign || profile.displayName,
              game: profile.mainGameName || "Esport",
              role: profile.roleName || "-",
              region: {
                name: profile.regionName || "Sumatera Barat",
                code: profile.regionCode || "SB",
              },
              avatarUrl: profile.avatarUrl || undefined,
            },
          }}
        />
      )}
    </>
  );
}
