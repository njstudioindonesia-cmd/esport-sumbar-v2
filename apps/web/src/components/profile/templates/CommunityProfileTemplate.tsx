"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  MapPin,
  Gamepad2,
  ExternalLink,
  Image as ImageIcon,
  CheckCircle2,
  X,
  MessageCircle,
} from "lucide-react";
import type { UnifiedProfileDetail } from "@/lib/services/public-profiles";
import { SharedProfileActions, VerificationStatusBadge } from "./SharedProfileHeader";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";

export function CommunityProfileTemplate({ profile }: { profile: UnifiedProfileDetail }) {
  const [activeTab, setActiveTab] = useState<"about" | "gallery" | "teams">("about");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const { attributes, gallery = [] } = profile;
  const estimatedMembers = attributes.estimated_members || 50;
  const foundedYear = attributes.founded_year || 2022;
  const activityFrequency = attributes.activity_frequency || "mingguan";
  const groupLink = attributes.public_group_link;

  return (
    <div className="w-full flex flex-col gap-8">
      {/* 1. BANNER COVER LEBAR + LOGO KOMUNITAS */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-white/[0.08] bg-[#0E121B] shadow-2xl">
        {/* Banner Cover */}
        <div className="w-full h-44 sm:h-56 bg-gradient-to-r from-emerald-950 via-[#122019] to-[#0A0C13] relative">
          {profile.coverUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={profile.coverUrl} alt="Cover Komunitas" className="w-full h-full object-cover opacity-50" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E121B] via-transparent to-transparent" />
        </div>

        {/* Info Header Bar */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-14 sm:-mt-16">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-2xl bg-[#081F15] shrink-0">
              {profile.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
              ) : (
                <InitialsAvatar name={profile.displayName} entityType="community" size="full" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="text-xs font-mono text-white/50">{profile.esportId}</span>
                <VerificationStatusBadge status={profile.verificationStatus} badgeNo={profile.verifiedBadgeNo} />
              </div>
              <h1 className="text-2xl font-heading font-black text-white">{profile.displayName}</h1>
              <p className="text-xs font-mono text-emerald-400 mt-0.5">Komunitas Wilayah {profile.regionName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {groupLink && (
              <a
                href={groupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-1.5 hover:bg-emerald-500/30 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Grup Komunitas</span>
              </a>
            )}
            <SharedProfileActions profile={profile} isOwner={profile.isOwner} />
          </div>
        </div>
      </div>

      {/* 2. BARIS ANGKA BESAR KOMUNITAS */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#12151F] border border-white/[0.06] text-center">
          <div className="text-2xl font-heading font-black text-emerald-400">{estimatedMembers}+</div>
          <div className="text-[10px] font-mono text-white/40 uppercase mt-0.5">Anggota Aktif</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#12151F] border border-white/[0.06] text-center">
          <div className="text-2xl font-heading font-black text-white">{foundedYear}</div>
          <div className="text-[10px] font-mono text-white/40 uppercase mt-0.5">Tahun Berdiri</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#12151F] border border-white/[0.06] text-center">
          <div className="text-2xl font-heading font-black text-[#D4AF37] capitalize">{activityFrequency}</div>
          <div className="text-[10px] font-mono text-white/40 uppercase mt-0.5">Frekuensi Giat</div>
        </div>
      </div>

      {/* 3. TABS: TENTANG | GALERI (MAKS 8) */}
      <div className="flex items-center gap-2 border-b border-white/[0.08]">
        {[
          { id: "about", label: "Tentang Komunitas" },
          { id: "gallery", label: `Galeri Foto (${gallery.length}/8)` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-heading font-black tracking-wider uppercase transition-all relative ${
              activeTab === tab.id ? "text-emerald-400" : "text-white/50 hover:text-white"
            }`}
          >
            <span>{tab.label}</span>
            {activeTab === tab.id && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-400" />}
          </button>
        ))}
      </div>

      {/* 4. ISI TAB */}
      <div>
        {activeTab === "about" && (
          <div className="p-6 rounded-2xl bg-[#12151F] border border-white/[0.06] flex flex-col gap-4 text-xs text-white/70">
            <div>
              <span className="font-semibold text-white block mb-1">Deskripsi Komunitas:</span>
              <p className="leading-relaxed">
                {profile.bio || "Komunitas esport penggerak kegiatan mabar, turnamen mingguan, dan wadah silaturahmi pelaku esport di Sumatera Barat."}
              </p>
            </div>
          </div>
        )}

        {activeTab === "gallery" && (
          <div>
            {gallery.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {gallery.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo.url)}
                    className="relative aspect-video rounded-xl overflow-hidden border border-white/10 cursor-pointer group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt={photo.caption || "Galeri"} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    {photo.caption && (
                      <div className="absolute inset-x-0 bottom-0 p-1.5 bg-black/70 text-[9px] text-white truncate">
                        {photo.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-white/40 bg-white/[0.02] rounded-2xl border border-white/[0.04]">
                Belum ada foto kegiatan di galeri.
              </div>
            )}
          </div>
        )}
      </div>

      {/* LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={selectedPhoto} alt="Enlarged" className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain" />
        </div>
      )}
    </div>
  );
}
