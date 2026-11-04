"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DynamicEntityFields } from "@/components/wizard/DynamicEntityFields";
import { updateProfileAction } from "@/app/actions/profile";
import type { EntityType, VerificationStatus } from "@/lib/supabase/database.types";
import {
  Save,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldAlert,
} from "lucide-react";

interface EditProfileClientFormProps {
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

export function EditProfileClientForm({
  profileId,
  entityType,
  initialDisplayName,
  initialIgn,
  initialBio,
  initialRoleName,
  initialAttributes,
  verificationStatus,
  slug,
}: EditProfileClientFormProps) {
  const router = useRouter();

  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [ign, setIgn] = useState(initialIgn);
  const [bio, setBio] = useState(initialBio);
  const [roleName, setRoleName] = useState(initialRoleName);
  const [attributes, setAttributes] = useState<Record<string, any>>(initialAttributes);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isVerified = ["verified", "regional_checked"].includes(verificationStatus);

  const handleAttributeChange = (key: string, value: any) => {
    setAttributes((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setErrorMessage("Nama resmi profil wajib diisi.");
      return;
    }

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
          router.push(`/profile/${slug}`);
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Top Header & Kembali */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <Link
            href={`/profile/${slug}`}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-heading font-black text-white">
              Edit Profil {entityType.toUpperCase()}
            </h1>
            <p className="text-xs text-white/40">
              Perbarui rincian identitas, kontak privat, atau spesifikasi entitas.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] text-xs font-heading font-black uppercase tracking-wider flex items-center gap-2 shadow-lg disabled:opacity-50 transition-all cursor-pointer"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isLoading ? "Menyimpan..." : "Simpan Perubahan"}</span>
        </button>
      </div>

      {/* Warning Verifikasi Ulang bila Terverifikasi */}
      {isVerified && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-300">Profil Sudah Terverifikasi Resmi ESI</div>
            <p className="text-[11px] text-amber-200/70 mt-0.5 leading-relaxed">
              Jika Anda mengubah nama tampilan resmi atau In-Game Name (IGN), sistem akan otomatis mengalihkan status verifikasi ke <strong>peninjauan ulang</strong> demi menjaga integritas data kejuaraan PBESI.
            </p>
          </div>
        </div>
      )}

      {/* Pesan Sukses / Error */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-300">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage} Mengalihkan ke profil publik...</span>
        </div>
      )}

      {/* Form Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] shadow-2xl backdrop-blur-xl flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
              Nama Tampilan Resmi <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Nama profil resmi"
              maxLength={100}
              className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none"
            />
          </div>

          {(entityType === "player" || entityType === "coach") && (
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                In-Game Name (IGN)
              </label>
              <input
                type="text"
                value={ign}
                onChange={(e) => setIgn(e.target.value)}
                placeholder="mis. HARIMAU_AIM"
                maxLength={50}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none"
              />
            </div>
          )}
        </div>

        {/* Dynamic Entity Specific Fields */}
        <DynamicEntityFields
          entityType={entityType}
          attributes={attributes}
          onChange={handleAttributeChange}
          bio={bio}
          onBioChange={setBio}
        />
      </div>

      {/* Bottom Floating Save Button for Mobile */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] text-xs font-heading font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 transition-all cursor-pointer"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isLoading ? "Menyimpan Perubahan..." : "Simpan Perubahan"}</span>
        </button>
      </div>
    </form>
  );
}
