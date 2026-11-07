"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Lock,
  User,
  Sparkles,
  Info,
} from "lucide-react";
import { DynamicEntityFields } from "@/components/wizard/DynamicEntityFields";
import { updateProfileAction } from "@/app/actions/profile";
import type { EntityType, VerificationStatus } from "@/lib/supabase/database.types";

interface MobileProfileEditViewProps {
  profileId: string;
  entityType: EntityType;
  initialDisplayName: string;
  initialIgn: string;
  initialBio: string;
  initialRoleName: string;
  initialAttributes: Record<string, any>;
  verificationStatus: VerificationStatus;
  slug: string;
}

export function MobileProfileEditView({
  profileId,
  entityType,
  initialDisplayName,
  initialIgn,
  initialBio,
  initialRoleName,
  initialAttributes,
  verificationStatus,
  slug,
}: MobileProfileEditViewProps) {
  const router = useRouter();

  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [ign, setIgn] = useState(initialIgn);
  const [bio, setBio] = useState(initialBio);
  const [roleName, setRoleName] = useState(initialRoleName);
  const [attributes, setAttributes] = useState<Record<string, any>>(initialAttributes);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isVerified = ["verified", "verified"].includes(verificationStatus);

  const triggerHaptic = (ms = 15) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // Ignored
      }
    }
  };

  const handleAttributeChange = (key: string, value: any) => {
    setAttributes((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setErrorMessage("Nama tampilan profil wajib diisi.");
      return;
    }

    triggerHaptic(25);
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await updateProfileAction(profileId, {
        displayName: displayName.trim(),
        ign: ign.trim() || undefined,
        bio: bio.trim() || undefined,
        roleName: roleName.trim() || undefined,
        metadata: attributes,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Gagal memperbarui profil.");
      } else {
        setSuccessMessage(res.message || "Profil berhasil diperbarui!");
        setTimeout(() => {
          router.push(`/${entityType}/${slug}`);
          router.refresh();
        }, 1200);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan sistem.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-[100dvh] max-w-[420px] mx-auto bg-[#07080C] text-white flex flex-col pb-32">
      {/* Top Mobile Header */}
      <header className="sticky top-0 z-30 px-4 pt-3 pb-3 bg-[#07080C]/90 backdrop-blur-2xl border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              triggerHaptic();
              router.back();
            }}
            className="w-10 h-10 rounded-full bg-[#161A24] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-heading font-black text-white uppercase tracking-wider">
              Edit Profil
            </h1>
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase">
              Bidang: {entityType}
            </span>
          </div>
        </div>

        <Link
          href={`/${entityType}/${slug}`}
          className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-white/70 hover:text-white"
        >
          Lihat Publik
        </Link>
      </header>

      {/* Main Scrollable Content */}
      <form onSubmit={handleSubmit} className="px-4 py-5 flex flex-col gap-5">
        {/* Warning Verifikasi Ulang */}
        {isVerified && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-300">Profil Terverifikasi ESPORT SUMBAR</div>
              <p className="text-[11px] text-amber-200/70 mt-0.5 leading-relaxed">
                Mengubah nama tampilan atau IGN akan memerlukan validasi ulang Komunitas Esport.
              </p>
            </div>
          </div>
        )}

        {/* Feedback Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Section 1: Identitas Utama */}
        <div className="p-4 rounded-2xl bg-[#0F1118] border border-white/[0.08] flex flex-col gap-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
            IDENTITAS DASAR
          </span>

          <div>
            <label className="block text-xs font-heading font-bold text-white mb-1.5">
              Nama Tampilan / Organisasi <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Nama profil tampilan"
              maxLength={100}
              className="w-full h-12 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-4 text-sm text-white outline-none"
            />
          </div>

          {(entityType === "player" || entityType === "coach") && (
            <div>
              <label className="block text-xs font-heading font-bold text-white mb-1.5">
                In-Game Name (IGN)
              </label>
              <input
                type="text"
                value={ign}
                onChange={(e) => setIgn(e.target.value)}
                placeholder="mis. HARIMAU_AIM"
                maxLength={50}
                className="w-full h-12 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-4 text-sm text-white outline-none"
              />
            </div>
          )}
        </div>

        {/* Section 2: Spesifikasi Khusus Bidang */}
        <div className="p-4 rounded-2xl bg-[#0F1118] border border-white/[0.08] flex flex-col gap-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
            SPESIFIKASI &amp; ATRIBUT BIDANG
          </span>

          <DynamicEntityFields
            entityType={entityType}
            attributes={attributes}
            onChange={handleAttributeChange}
            bio={bio}
            onBioChange={setBio}
          />
        </div>

        {/* Section 3: Informasi UU PDP */}
        <div className="p-3.5 rounded-2xl bg-[#161A24]/60 border border-white/[0.06] flex items-center justify-between text-xs text-white/50">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Data privat dilindungi UU PDP No. 27/2022</span>
          </div>
          <span className="text-[10px] font-mono text-[#D4AF37] font-bold">AES-256</span>
        </div>
      </form>

      {/* Fixed Sticky Bottom Action Dock */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto p-4 bg-[#07080C]/90 backdrop-blur-2xl border-t border-white/[0.08] z-30 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 h-14 rounded-full bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#E5C158] text-[#07080C] font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(212,175,55,0.3)] transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#07080C]" />
          ) : (
            <Save className="w-4 h-4 text-[#07080C]" />
          )}
          <span>{isLoading ? "Menyimpan Data..." : "Simpan Perubahan Profil"}</span>
        </button>
      </div>
    </div>
  );
}
