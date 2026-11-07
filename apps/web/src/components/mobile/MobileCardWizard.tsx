"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Gamepad2,
  GraduationCap,
  Users,
  Shield,
  ShieldCheck,
  Eye,
  Lock,
  Search,
  Check,
  ArrowLeft,
  Sparkles,
  Upload,
  Calendar,
  AlertCircle,
  Trophy,
  Award,
  ChevronRight,
  Share2,
  PlusCircle,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import { OFFICIAL_GAMES } from "@/data/games";
import { REGIONS_DETAIL } from "@/data/regions";
import { createProfileAction } from "@/app/actions/profile";
import {
  ENTITY_REGISTRY,
  isEntityTypeEnabled,
  calculateCompletenessScore,
  calculateRarityTier,
} from "@/lib/entities";
import type { EntityType, RarityTier } from "@/lib/supabase/database.types";
import { ImageCropperModal } from "@/components/wizard/ImageCropperModal";
import { DynamicEntityFields } from "@/components/wizard/DynamicEntityFields";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { saveWizardDraft, loadWizardDraft, clearWizardDraft } from "@/lib/entities/draft";
import { CardSuccessCelebration } from "@/components/glass/CardSuccessCelebration";

export function MobileCardWizard() {
  const router = useRouter();

  // Wizard Steps (1 - 6): Progress bar tipis emas di atas
  const [step, setStep] = useState<number>(1);

  // Form State
  const [entityType, setEntityType] = useState<EntityType>("player");
  const [birthDate, setBirthDate] = useState<string>("");
  const [guardianName, setGuardianName] = useState<string>("");
  const [guardianContact, setGuardianContact] = useState<string>("");
  const [guardianRelationship, setGuardianRelationship] = useState<string>("Orang Tua Kandung");
  const [guardianConsent, setGuardianConsent] = useState<boolean>(false);

  const [displayName, setDisplayName] = useState<string>("");
  const [regionCode, setRegionCode] = useState<string>("PDG");
  const [regionSearch, setRegionSearch] = useState<string>("");

  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [bio, setBio] = useState<string>("");

  // Atribut dinamis sesuai 7 bidang
  const [attributes, setAttributes] = useState<Record<string, any>>({});

  // Pengaturan Privasi per Field
  const [privacy, setPrivacy] = useState<{
    kontak: boolean;
    tglLahir: boolean;
    statistik: boolean;
    fotoPublik: boolean;
  }>({
    kontak: false,
    tglLahir: false,
    statistik: true,
    fotoPublik: true,
  });

  // Toggle Mode Pratinjau Kartu: Publik vs Pemilik
  const [previewMode, setPreviewMode] = useState<"owner" | "public">("owner");

  // Modal Cropper State
  const [cropperOpen, setCropperOpen] = useState<boolean>(false);
  const [cropperType, setCropperType] = useState<"avatar" | "logo" | "cover">("avatar");

  // Loading, Finishing, dan Hasil Penerbitan
  const [isFinishing, setIsFinishing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [issuedResult, setIssuedResult] = useState<{
    profileId: string;
    esportId: string;
    slug: string;
  } | null>(null);

  const triggerHaptic = (ms = 10) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // Ignored
      }
    }
  };

  // Under-18 detection via useEffect
  const [isUnder18, setIsUnder18] = useState<boolean>(false);

  useEffect(() => {
    if (!birthDate || (entityType !== "player" && entityType !== "coach")) {
      setIsUnder18(false);
      return;
    }
    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    const under = currentYear - birthYear < 18;
    setIsUnder18(under);

    if (under) {
      setPrivacy((prev) => ({ ...prev, fotoPublik: false }));
    }
  }, [birthDate, entityType]);

  // Load existing draft
  useEffect(() => {
    const draft = loadWizardDraft();
    if (draft && draft.displayName) {
      setEntityType((draft.entityType as EntityType) || "player");
      if (draft.birthDate) setBirthDate(draft.birthDate);
      if (draft.guardianName) setGuardianName(draft.guardianName);
      if (draft.guardianContact) setGuardianContact(draft.guardianContact);
      if (draft.guardianConsent !== undefined) setGuardianConsent(draft.guardianConsent);
      if (draft.displayName) setDisplayName(draft.displayName);
      if (draft.regionCode) setRegionCode(draft.regionCode);
      if (draft.avatarUrl) setAvatarUrl(draft.avatarUrl);
      if (draft.coverUrl) setCoverUrl(draft.coverUrl);
      if (draft.bio) setBio(draft.bio);
      if (draft.attributes) setAttributes(draft.attributes);
      if (draft.privacy) setPrivacy(draft.privacy);
      if (draft.step) setStep(Math.min(draft.step, 6));
    }
  }, []);

  // Simpan draf ke localStorage
  useEffect(() => {
    if (step < 6 && !issuedResult) {
      saveWizardDraft({
        step,
        entityType,
        birthDate,
        guardianName,
        guardianContact,
        guardianRelationship,
        guardianConsent,
        displayName,
        regionCode,
        avatarUrl,
        coverUrl,
        bio,
        attributes,
        privacy,
      });
    }
  }, [
    step,
    entityType,
    birthDate,
    guardianName,
    guardianContact,
    guardianRelationship,
    guardianConsent,
    displayName,
    regionCode,
    avatarUrl,
    coverUrl,
    bio,
    attributes,
    privacy,
    issuedResult,
  ]);

  // Selected region details
  const selectedRegion = useMemo(() => {
    return REGIONS_DETAIL.find((r) => r.code === regionCode) || REGIONS_DETAIL[0];
  }, [regionCode]);

  // Active game details
  const activeGame = useMemo(() => {
    const gameId = attributes.game_id || attributes.main_game_id || "mlbb";
    return OFFICIAL_GAMES.find((g) => g.id === gameId) || OFFICIAL_GAMES[0];
  }, [attributes.game_id, attributes.main_game_id]);

  // Skor Kelengkapan & Rarity
  const completenessScore = useMemo(() => {
    return calculateCompletenessScore(
      entityType,
      {
        display_name: displayName,
        region_id: selectedRegion.id,
        avatar_url: avatarUrl || undefined,
        bio: bio || undefined,
        main_game_id: activeGame.id,
      },
      attributes
    );
  }, [entityType, displayName, selectedRegion.id, avatarUrl, bio, activeGame.id, attributes]);

  const rarityTier: RarityTier = useMemo(() => {
    return calculateRarityTier({
      completenessScore,
      confirmedRelationsCount: 0,
      validatedAchievementsCount: 0,
    });
  }, [completenessScore]);

  const entityDef = ENTITY_REGISTRY[entityType];

  const handleNext = () => {
    triggerHaptic();
    setErrorMessage(null);

    if (step === 1 && !isEntityTypeEnabled(entityType)) {
      setErrorMessage("Bidang ini belum dibuka (Segera hadir).");
      return;
    }

    if (step === 2 && (entityType === "player" || entityType === "coach")) {
      if (isUnder18) {
        if (!guardianName.trim() || !guardianContact.trim()) {
          setErrorMessage("Nama dan kontak wali wajib diisi untuk usia < 18 tahun.");
          return;
        }
        if (!guardianConsent) {
          setErrorMessage("Persetujuan wali wajib dicentang.");
          return;
        }
      }
    }

    if (step === 3 && !displayName.trim()) {
      setErrorMessage("Nama tampilan wajib diisi.");
      return;
    }

    if (step < 6) {
      setStep((prev) => prev + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleBack = () => {
    triggerHaptic();
    setErrorMessage(null);
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = async () => {
    triggerHaptic(30);
    setIsFinishing(true);
    setErrorMessage(null);

    try {
      const result = await createProfileAction({
        entityType,
        displayName: displayName.trim(),
        ign: attributes.ign?.trim() || undefined,
        regionId: selectedRegion.id,
        regionCode: selectedRegion.code,
        mainGameId: activeGame.id,
        roleName: attributes.role || undefined,
        avatarUrl: avatarUrl || undefined,
        birthDate: entityType === "player" || entityType === "coach" ? birthDate : undefined,
        bio: bio.trim() || undefined,
        guardianConsent:
          isUnder18 && guardianConsent
            ? {
                guardianName: guardianName.trim(),
                guardianContact: guardianContact.trim(),
                guardianRelationship,
              }
            : undefined,
        metadata: {
          ...attributes,
          cover_url: coverUrl || undefined,
        },
        visibility: {
          contact: privacy.kontak,
          birthDate: privacy.tglLahir,
          stats: privacy.statistik,
          photo: privacy.fotoPublik,
        },
      });

      if (!result.success || !result.profileId) {
        throw new Error(result.error || "Gagal menerbitkan profil.");
      }

      clearWizardDraft();

      setIssuedResult({
        profileId: result.profileId,
        esportId: result.esportId || "ESB-PDG-PL-100234",
        slug: result.slug || "profil-baru",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat membuat profil.";
      setErrorMessage(msg);
      setIsFinishing(false);
    }
  };

  const getEntityCropperType = (): "avatar" | "logo" | "cover" => {
    if (entityType === "player" || entityType === "coach") return "avatar";
    if (entityType === "venue") return "cover";
    return "logo";
  };

  return (
    <div className="relative w-full h-[100dvh] max-w-[440px] mx-auto bg-[#07080C] text-white flex flex-col justify-between overflow-hidden select-none">
      {/* 1. PROGRESS BAR TIPIS EMAS DI PALING ATAS (TANPA TEKS "1 DARI 6") */}
      <div className="w-full h-1 bg-white/[0.06] z-30">
        <motion.div
          className="h-full bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#F3E5AB]"
          initial={{ width: "16%" }}
          animate={{ width: `${(step / 6) * 100}%` }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
        />
      </div>

      {/* TOP BAR / BACK NAVIGATION */}
      <div className="w-full flex items-center justify-between px-5 pt-3 z-30 min-h-[40px]">
        {step > 1 && !issuedResult ? (
          <button
            onClick={handleBack}
            className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex h-1.5 w-6 rounded-full overflow-hidden opacity-70">
            <span className="w-1/3 bg-[#C8102E]" />
            <span className="w-1/3 bg-[#D4AF37]" />
            <span className="w-1/3 bg-black" />
          </div>
        )}

        {/* Stepper Dots */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                s === step ? "bg-[#D4AF37] scale-125" : s < step ? "bg-emerald-400" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        <div className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
          {rarityTier.toUpperCase()}
        </div>
      </div>

      {/* 2. BAGIAN ATAS (~38% TINGGI LAYAR): KARTU PRATINJAU HIDUP REAL-TIME */}
      <div className="relative w-full h-[38%] flex items-center justify-center px-6 py-1 z-10 [perspective:1000px]">
        {/* Subtle Ambient Glow */}
        <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-[#8C5A3C]/20 via-[#D4AF37]/15 to-transparent blur-3xl pointer-events-none" />

        {/* The Live Hero TCG Card */}
        <motion.div
          animate={{
            rotateY: [-2, 2, -2],
            rotateX: [1, -1, 1],
            scale: isFinishing || issuedResult ? [1, 1.04, 1.06] : 1,
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`relative w-52 h-72 rounded-[18px] bg-gradient-to-b from-[#1C1F2B] via-[#12151E] to-[#0A0C13] border-2 p-3 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
            rarityTier === "legend"
              ? "border-[#C084FC] shadow-[0_0_30px_rgba(192,132,252,0.4)]"
              : rarityTier === "elite"
              ? "border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.45)]"
              : rarityTier === "contender"
              ? "border-[#94A3B8] shadow-[0_0_20px_rgba(148,163,184,0.3)]"
              : "border-[#8C5A3C] shadow-[0_12px_32px_rgba(140,90,60,0.25)]"
          } ${
            isFinishing || issuedResult ? "ring-4 ring-[#D4AF37] shadow-[0_0_48px_rgba(212,175,55,0.6)]" : ""
          }`}
        >
          {/* Card Gleam Animation on Final Submit */}
          {(isFinishing || issuedResult) && (
            <motion.div
              initial={{ x: "-150%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent skew-x-12 z-40 pointer-events-none"
            />
          )}

          {/* Top Card Info: Rarity & Entity Type */}
          <div className="w-full flex items-center justify-between z-10">
            <span
              className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase ${
                rarityTier === "legend"
                  ? "bg-[#7C3AED]/30 text-white"
                  : rarityTier === "elite"
                  ? "bg-[#D4AF37]/25 text-[#D4AF37]"
                  : rarityTier === "contender"
                  ? "bg-[#94A3B8]/25 text-[#F1F5F9]"
                  : "bg-[#8C5A3C]/30 text-[#E6B89C]"
              }`}
            >
              {rarityTier.toUpperCase()}
            </span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10">
              <Shield className="w-2.5 h-2.5 text-white/50" />
              <span className="text-[7px] font-mono text-white/50 uppercase">{entityType}</span>
            </div>
          </div>

          {/* Avatar / Photo Real-Time dengan Fallback Inisial */}
          <div className="relative w-full flex-1 my-1 flex flex-col items-center justify-center">
            <div className="relative w-20 h-24 rounded-xl overflow-hidden border border-white/10 shadow-md bg-[#0F1118]">
              {avatarUrl && (previewMode === "owner" || !isUnder18 || privacy.fotoPublik) ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </>
              ) : (
                <InitialsAvatar
                  name={displayName}
                  entityType={entityType}
                  size="full"
                  isMinorProtected={isUnder18 && !privacy.fotoPublik}
                />
              )}
            </div>

            {/* Live Name & IGN */}
            <div className="text-center mt-1">
              <div className="text-xs font-heading font-black tracking-wide text-white truncate max-w-[150px]">
                {displayName || entityDef.label}
              </div>
              <div className="text-[9px] font-mono text-[#D4AF37] font-semibold">
                {attributes.ign ? `@${attributes.ign}` : `@${entityDef.code}`}
              </div>
            </div>
          </div>

          {/* Bottom Card Strip: Game + Role + Region */}
          <div className="w-full pt-1.5 border-t border-white/[0.08] flex items-center justify-between text-[8px] font-mono text-white/70 z-10">
            <div className="truncate max-w-[95px] text-[#4C7DFF]">
              {activeGame.shortName} • {attributes.role || entityDef.singularLabel}
            </div>
            <div className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[#D4AF37] font-bold">
              {regionCode}
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. BAGIAN BAWAH (~62% TINGGI LAYAR): PANEL INPUT BOTTOM SHEET */}
      <div className="w-full flex-1 bg-[#0D1017] border-t border-white/[0.08] rounded-t-3xl p-5 flex flex-col justify-between z-20 shadow-2xl overflow-y-auto no-scrollbar">
        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {/* LANGKAH 1: PILIH BIDANG (7 PILIHAN) */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col"
              >
                <div className="text-lg font-heading font-black text-white mb-0.5">
                  Pilih Bidang
                </div>
                <p className="text-[11px] text-white/50 mb-3">
                  Pilih kategori identitas ESPORT SUMBAR Anda.
                </p>

                <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {Object.values(ENTITY_REGISTRY).map((entity) => {
                    const isEnabled = isEntityTypeEnabled(entity.type);
                    const isSelected = entityType === entity.type;

                    return (
                      <button
                        key={entity.type}
                        type="button"
                        onClick={() => {
                          if (isEnabled) {
                            setEntityType(entity.type);
                            triggerHaptic();
                          }
                        }}
                        disabled={!isEnabled}
                        className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          !isEnabled
                            ? "bg-white/[0.02] border-white/[0.04] opacity-50 cursor-not-allowed"
                            : isSelected
                            ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white"
                            : "bg-[#161A24] border-white/[0.06] text-white/70"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded border ${entity.badgeColor}`}>
                            {entity.code}
                          </span>
                          {!isEnabled && (
                            <span className="text-[7px] font-mono text-white/40">Segera</span>
                          )}
                        </div>
                        <div className="text-xs font-heading font-bold truncate">
                          {entity.singularLabel}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* LANGKAH 2: TANGGAL LAHIR & PERLINDUNGAN ANAK */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col"
              >
                {entityType === "player" || entityType === "coach" ? (
                  <>
                    <div className="text-lg font-heading font-black text-white mb-0.5">
                      Tanggal Lahir
                    </div>
                    <p className="text-[11px] text-white/50 mb-3">
                      Sesuai akta / tanggal lahir untuk validasi usia dan perlindungan atlet.
                    </p>

                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full h-11 bg-[#161A24] border border-white/10 rounded-xl px-3 text-xs font-mono text-white outline-none mb-3"
                    />

                    {isUnder18 && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-2">
                        <div className="text-[11px] font-heading font-bold text-amber-300 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Persetujuan Wali (&lt;18 Tahun)</span>
                        </div>
                        <input
                          type="text"
                          value={guardianName}
                          onChange={(e) => setGuardianName(e.target.value)}
                          placeholder="Nama Wali"
                          className="w-full h-9 bg-[#0A0C13] border border-white/10 rounded-lg px-2.5 text-xs text-white outline-none"
                        />
                        <input
                          type="text"
                          value={guardianContact}
                          onChange={(e) => setGuardianContact(e.target.value)}
                          placeholder="No. WhatsApp Wali"
                          className="w-full h-9 bg-[#0A0C13] border border-white/10 rounded-lg px-2.5 text-xs text-white outline-none"
                        />
                        <label className="flex items-start gap-2 cursor-pointer mt-1">
                          <input
                            type="checkbox"
                            checked={guardianConsent}
                            onChange={(e) => setGuardianConsent(e.target.checked)}
                            className="w-3.5 h-3.5 mt-0.5 rounded accent-[#D4AF37]"
                          />
                          <span className="text-[10px] text-white/70 leading-tight">
                            Wali telah menyetujui pendaftaran identitas atlet ini sesuai UU PDP.
                          </span>
                        </label>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="text-lg font-heading font-black text-white mb-0.5">
                      Tahun Berdiri
                    </div>
                    <input
                      type="number"
                      min={1990}
                      max={new Date().getFullYear()}
                      value={attributes.founded_year || 2022}
                      onChange={(e) =>
                        setAttributes((prev) => ({
                          ...prev,
                          founded_year: parseInt(e.target.value, 10),
                        }))
                      }
                      className="w-full h-11 bg-[#161A24] border border-white/10 rounded-xl px-3 text-xs font-mono text-white outline-none"
                    />
                  </>
                )}
              </motion.div>
            )}

            {/* LANGKAH 3: IDENTITAS & ATRIBUT */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col max-h-64 overflow-y-auto pr-1"
              >
                <div className="text-lg font-heading font-black text-white mb-0.5">
                  Identitas &amp; Atribut
                </div>

                <div className="flex flex-col gap-2.5 mb-3">
                  <div>
                    <label className="text-[10px] font-mono text-white/60 block mb-1">
                      Nama Tampilan <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Nama lengkap"
                      className="w-full h-10 bg-[#161A24] border border-white/10 rounded-xl px-3 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-white/60 block mb-1">
                      Domisili Wilayah <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={regionCode}
                      onChange={(e) => setRegionCode(e.target.value)}
                      className="w-full h-10 bg-[#161A24] border border-white/10 rounded-xl px-3 text-xs text-white outline-none"
                    >
                      {REGIONS_DETAIL.map((r) => (
                        <option key={r.code} value={r.code} className="bg-[#161A24]">
                          {r.name} ({r.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <DynamicEntityFields
                  entityType={entityType}
                  attributes={attributes}
                  onChange={(key, val) =>
                    setAttributes((prev) => ({ ...prev, [key]: val }))
                  }
                  bio={bio}
                  onBioChange={setBio}
                />
              </motion.div>
            )}

            {/* LANGKAH 4: FOTO / LOGO */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center text-center"
              >
                <div className="text-lg font-heading font-black text-white mb-0.5">
                  Foto Profil
                </div>
                <p className="text-[11px] text-white/50 mb-3">
                  Potong sesuai rasio paspor digital (WebP &le; 2 MB).
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCropperType(getEntityCropperType());
                      setCropperOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#07080C] text-xs font-heading font-black uppercase flex items-center gap-1.5 shadow-lg"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{avatarUrl ? "Ganti Foto" : "Unggah & Potong"}</span>
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl("")}
                      className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] font-mono text-white/60"
                    >
                      Inisial
                    </button>
                  )}
                </div>

                {isUnder18 && (
                  <p className="text-[10px] text-amber-300 bg-amber-500/10 p-2 rounded-lg text-left">
                    Foto anak disembunyikan secara default demi privasi UU PDP.
                  </p>
                )}
              </motion.div>
            )}

            {/* LANGKAH 5: PRIVASI */}
            {step === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-lg font-heading font-black text-white">Privasi</div>
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#161A24] text-[9px] font-mono">
                    <button
                      type="button"
                      onClick={() => setPreviewMode("owner")}
                      className={`px-2 py-0.5 rounded ${previewMode === "owner" ? "bg-[#D4AF37] text-black font-bold" : "text-white/60"}`}
                    >
                      Anda
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode("public")}
                      className={`px-2 py-0.5 rounded ${previewMode === "public" ? "bg-emerald-500 text-white font-bold" : "text-white/60"}`}
                    >
                      Publik
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {[
                    { key: "kontak", label: "Nomor Kontak & WhatsApp", isPublic: privacy.kontak },
                    { key: "tglLahir", label: "Tanggal Lahir", isPublic: privacy.tglLahir },
                    { key: "statistik", label: "Statistik Pertandingan", isPublic: privacy.statistik },
                    ...(isUnder18
                      ? [{ key: "fotoPublik", label: "Tampilkan Foto Publik", isPublic: privacy.fotoPublik }]
                      : []),
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="p-2.5 rounded-xl bg-[#161A24] border border-white/[0.06] flex items-center justify-between"
                    >
                      <span className="text-xs text-white">{item.label}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setPrivacy((prev) => ({
                            ...prev,
                            [item.key]: !prev[item.key as keyof typeof privacy],
                          }))
                        }
                        className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          item.isPublic
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        }`}
                      >
                        {item.isPublic ? "PUBLIK" : "PRIVAT"}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* LANGKAH 6: TINJAU & TERBITKAN */}
            {step === 6 && (
              <motion.div
                key="step-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col"
              >
                <div className="text-lg font-heading font-black text-white mb-0.5">
                  Siap Diterbitkan
                </div>
                <p className="text-[11px] text-white/50 mb-3">
                  ESPORT ID diterbitkan otomatis ke basis data ESPORT SUMBAR.
                </p>

                <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-between text-xs mb-3">
                  <span className="font-heading font-black text-white">Tier: {rarityTier.toUpperCase()}</span>
                  <span className="font-mono text-[#D4AF37]">Skor {completenessScore}%</span>
                </div>

                {issuedResult && (
                  <div className="mb-4">
                    <CardSuccessCelebration
                      esportId={issuedResult.esportId}
                      entityType={entityType}
                      rarityTier={rarityTier}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button Bottom Bar */}
        {!issuedResult && (
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isFinishing}
                className="px-4 py-2 rounded-xl text-xs font-mono text-white/60"
              >
                Kembali
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={isFinishing}
              className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-[#07080C] text-xs font-heading font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg active:scale-95"
            >
              {isFinishing ? (
                <span>Menerbitkan...</span>
              ) : step === 6 ? (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Terbitkan</span>
                </>
              ) : (
                <>
                  <span>Lanjut</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Modal Cropper Foto */}
      <ImageCropperModal
        isOpen={cropperOpen}
        onClose={() => setCropperOpen(false)}
        aspectRatioType={cropperType}
        entityName={displayName}
        onUploadSuccess={(url) => {
          if (cropperType === "cover") {
            setCoverUrl(url);
          } else {
            setAvatarUrl(url);
          }
        }}
      />
    </div>
  );
}
