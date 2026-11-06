"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Cpu,
  Monitor,
  Wifi,
  Coffee,
  Sparkles,
  Trophy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { UnifiedProfileDetail } from "@/lib/services/public-profiles";
import { SharedProfileActions, VerificationStatusBadge } from "./SharedProfileHeader";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";

export function VenueProfileTemplate({ profile }: { profile: UnifiedProfileDetail }) {
  const [weeklyHoursOpen, setWeeklyHoursOpen] = useState(false);

  const { attributes, gallery = [] } = profile;
  const venueType = attributes.venue_type || "icafe";
  const capacity = attributes.capacity_units || 20;
  const isTournamentReady = attributes.is_tournament_ready ?? false;
  const businessAddress = attributes.business_address || "Sumatera Barat";
  const facilities = (attributes.facilities as string[]) || ["pc_high_end", "ac", "dedicated_fiber"];

  return (
    <div className="w-full flex flex-col gap-8">
      {/* 1. HERO VENUE: COVER & BANNER FASILITAS */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-white/[0.08] bg-[#0E121B] shadow-2xl">
        <div className="w-full h-48 sm:h-64 bg-gradient-to-r from-fuchsia-950 via-[#1A0C1E] to-[#0A0C13] relative">
          {profile.coverUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={profile.coverUrl} alt="Cover Venue" className="w-full h-full object-cover opacity-60" />
          ) : (
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E121B] via-transparent to-transparent" />

          {/* Badge Siap Turnamen */}
          {isTournamentReady && (
            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/60 text-fuchsia-300 text-[10px] font-mono font-bold backdrop-blur-md">
              <Trophy className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>SIAP TURNAMEN ESPORT SUMBAR</span>
            </div>
          )}
        </div>

        <div className="px-6 sm:px-8 pb-6 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-12 sm:-mt-14">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-fuchsia-500/50 shadow-2xl bg-[#17051A] shrink-0">
              {profile.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
              ) : (
                <InitialsAvatar name={profile.displayName} entityType="venue" size="full" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="text-xs font-mono text-white/50">{profile.esportId}</span>
                <VerificationStatusBadge status={profile.verificationStatus} badgeNo={profile.verifiedBadgeNo} />
              </div>
              <h1 className="text-2xl font-heading font-black text-white">{profile.displayName}</h1>
              <p className="text-xs font-mono text-fuchsia-400 mt-0.5 uppercase tracking-wider">{venueType} • {profile.regionName}</p>
            </div>
          </div>

          <SharedProfileActions profile={profile} isOwner={profile.isOwner} />
        </div>
      </div>

      {/* 2. BARIS ANGKA BESAR & STATUS OPERASIONAL */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#12151F] border border-white/[0.06] text-center">
          <div className="text-3xl font-heading font-black text-fuchsia-400">{capacity}</div>
          <div className="text-[10px] font-mono text-white/40 uppercase mt-0.5">Unit Gaming Station</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#12151F] border border-white/[0.06] text-center flex flex-col justify-center items-center">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>BUKA HARI INI</span>
          </div>
          <div className="text-[10px] font-mono text-white/40 uppercase mt-1">10:00 - 24:00 WIB</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#12151F] border border-white/[0.06] text-center flex flex-col justify-center items-center">
          <div className="text-xs font-bold text-white truncate max-w-[200px]">{businessAddress}</div>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(businessAddress + ", " + profile.regionName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-mono text-[#D4AF37] hover:underline flex items-center gap-1 mt-1"
          >
            <MapPin className="w-3 h-3" />
            <span>Buka Navigasi Lokasi</span>
          </a>
        </div>
      </div>

      {/* 3. FASILITAS VENUE */}
      <div className="p-6 rounded-2xl bg-[#12151F] border border-white/[0.06] flex flex-col gap-3">
        <h3 className="text-xs font-mono uppercase text-white/60 tracking-wider">Fasilitas Venue</h3>
        <div className="flex flex-wrap gap-2">
          {facilities.map((fac) => (
            <span key={fac} className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white/80">
              ✓ {fac.replace(/_/g, " ").toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* 4. GALERI VENUE (MAKS 8 FOTO) */}
      {gallery.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-mono uppercase text-white/60 tracking-wider">Galeri Venue</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {gallery.map((photo) => (
              <div key={photo.id} className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt="Venue" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
