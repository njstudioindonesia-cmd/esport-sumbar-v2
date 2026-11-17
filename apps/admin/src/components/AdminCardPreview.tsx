"use client";

import React from "react";
import {
  type UnifiedCardData,
  type CardEntityType,
  type CardRarity,
  type CardVerification,
  type CardSize,
} from "@esport-sumbar/contracts";
import { Card, StatusBadge, Avatar, RarityMaterialTag } from "@esport-sumbar/ui";
import { Gamepad2, MapPin } from "lucide-react";

export interface AdminCardPreviewProps {
  type: CardEntityType;
  rarity?: CardRarity;
  verification?: CardVerification;
  data: UnifiedCardData;
  size?: CardSize;
}

export function AdminCardPreview({
  type,
  rarity = "standard",
  verification = "unverified",
  data,
}: AdminCardPreviewProps) {
  const tierKey =
    rarity === "diamond"
      ? "legend"
      : rarity === "gold"
      ? "elite"
      : rarity === "silver"
      ? "contender"
      : "rookie";

  return (
    <Card className="w-full overflow-hidden bg-[#0A0A24] border-white/10 p-5 flex flex-col gap-4">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-white/10 text-white/80">
            {type}
          </span>
          <RarityMaterialTag tier={tierKey} size="sm" />
        </div>
        <StatusBadge status={verification} size="sm" />
      </div>

      {/* Member Profile */}
      <div className="flex items-center gap-3.5">
        <Avatar
          src={data.photoUrl}
          alt={data.name || data.ign}
          size="lg"
          className="ring-2 ring-white/10"
        />
        <div className="flex flex-col min-w-0">
          <span className="text-base font-extrabold text-white truncate">
            {data.ign || data.name}
          </span>
          <span className="text-xs text-white/60 truncate">{data.name}</span>
          <span className="text-[11px] font-mono text-[#FF1752] mt-0.5 font-bold">
            {data.esportId || "ID-PENDING"}
          </span>
        </div>
      </div>

      {/* Metadata Details */}
      <div className="grid grid-cols-2 gap-2 text-xs bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.06]">
        <div className="flex items-center gap-1.5 text-white/70">
          <Gamepad2 className="w-3.5 h-3.5 text-white/40 shrink-0" />
          <span className="truncate">{data.game || "-"}</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/70">
          <MapPin className="w-3.5 h-3.5 text-white/40 shrink-0" />
          <span className="truncate">{data.region || "-"}</span>
        </div>
      </div>

      {/* Role & Division */}
      <div className="flex items-center justify-between text-[11px] text-white/50 pt-1">
        <span>
          Peran: <strong className="text-white/80 font-medium">{data.role || "-"}</strong>
        </span>
        {data.division && (
          <span>
            Divisi: <strong className="text-white/80 font-medium">{data.division}</strong>
          </span>
        )}
      </div>
    </Card>
  );
}
