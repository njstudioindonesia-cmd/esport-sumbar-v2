"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
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
  Building,
  MapPin,
  Landmark,
  RotateCcw,
} from "lucide-react";
import { OFFICIAL_GAMES } from "@/data/games";
import { REGIONS_DETAIL } from "@/data/regions";
import { createProfileAction, saveProfileDraftAction } from "@/app/actions/profile";
import {
  ENTITY_REGISTRY,
  isEntityTypeEnabled,
  calculateCompletenessScore,
  calculateRarityTier,
} from "@/lib/entities";
import type { EntityType, RarityTier } from "@/lib/supabase/database.types";
import { ImageCropperModal } from "./ImageCropperModal";
import { DynamicEntityFields } from "./DynamicEntityFields";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { saveWizardDraft, loadWizardDraft, clearWizardDraft } from "@/lib/entities/draft";

export function DesktopCardWizard() {
  const router = useRouter();

  // Wizard Steps (1 - 6): Progress bar tipis emas di paling atas
  const [step, setStep] = useState<number>(1);

  // Form State
  const [entityType, setEntityType] = useState<EntityType>("player");
  const [birthDate, setBirthDate] = useState<string>("2007-06-15");
  const [guardianName, setGuardianName] = useState<string>("");
  const [guardianContact, setGuardianContact] = useState<string>("");
  const [guardianRelationship, setGuardianRelationship] = useState<string>("Orang Tua Kandung");
  const [guardianConsent, setGuardianConsent] = useState<boolean>(false);

  const [displayName, setDisplayName] = useState<string>("Sutan Harimau");
  const [regionCode, setRegionCode] = useState<string>("PDG");
  const [regionSearch, setRegionSearch] = useState<string>("");

  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [bio, setBio] = useState<string>("Atlet esport kompetitif asal Sumatera Barat.");

  // Atribut dinamis sesuai 7 bidang
  const [attributes, setAttributes] = useState<Record<string, any>>({
    ign: "HARIMAU_AIM",
    game_id: "mlbb",
    role: "Roamer",
    rank: "Mythic Glory 120★",
    year_started: 2022,
    is_looking_for_team: true,
  });

  // Pengaturan Privasi per Field (Default Aman sesuai UU PDP No. 27/2022)
  const [privacy, setPrivacy] = useState<{
    kontak: boolean;
    tglLahir: boolean;
    statistik: boolean;
    fotoPublik: boolean;
  }>({
    kontak: false, // privat default
    tglLahir: false, // privat default
    statistik: true, // publik default
    fotoPublik: true, // publik default untuk dewasa
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

  // Auto-Save Draft Banner
  const [hasDraftRestored, setHasDraftRestored] = useState<boolean>(false);

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

    // Jika di bawah 18 tahun, set foto privat secara default demi perlindungan anak
    if (under) {
      setPrivacy((prev) => ({ ...prev, fotoPublik: false }));
    }
  }, [birthDate, entityType]);

  // Load existing draft pada saat pertama kali komponen dimuat
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
      setHasDraftRestored(true);
    }
  }, []);

  // Simpan draf ke localStorage setiap kali ada perubahan data
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

  // Filtered 19 regions for search
  const filteredRegions = useMemo(() => {
    if (!regionSearch.trim()) return REGIONS_DETAIL;
    return REGIONS_DETAIL.filter(
      (r) =>
        r.name.toLowerCase().includes(regionSearch.toLowerCase()) ||
        r.code.toLowerCase().includes(regionSearch.toLowerCase())
    );
  }, [regionSearch]);

  // Active game details
  const activeGame = useMemo(() => {
    const gameId = attributes.game_id || attributes.main_game_id || "mlbb";
    return OFFICIAL_GAMES.find((g) => g.id === gameId) || OFFICIAL_GAMES[0];
  }, [attributes.game_id, attributes.main_game_id]);

  // Kalkulasi Skor Kelengkapan & Rarity Tier Real-Time
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

  // 3D Tilt Card Motion Values
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [12, -12]), {
    stiffness: 180,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-12, 12]), {
    stiffness: 180,
    damping: 24,
  });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleCardMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Navigasi Langkah Wizard
  const handleNext = () => {
    setErrorMessage(null);

    // Validasi Langkah 1: Entitas harus aktif
    if (step === 1 && !isEntityTypeEnabled(entityType)) {
      setErrorMessage("Bidang ini belum dibuka untuk pendaftaran publik (Segera hadir).");
      return;
    }

    // Validasi Langkah 2: Perlindungan Anak
    if (step === 2 && (entityType === "player" || entityType === "coach")) {
      if (isUnder18) {
        if (!guardianName.trim() || !guardianContact.trim()) {
          setErrorMessage("Nama dan kontak wali sah wajib diisi untuk pendaftar di bawah 18 tahun.");
          return;
        }
        if (!guardianConsent) {
          setErrorMessage("Persetujuan tertulis orang tua/wali wajib dicentang sesuai UU PDP.");
          return;
        }
      }
    }

    // Validasi Langkah 3: Identitas Dasar
    if (step === 3 && !displayName.trim()) {
      setErrorMessage("Nama resmi / tampilan wajib diisi.");
      return;
    }

    if (step < 6) {
      setStep((prev) => prev + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  // Navigasi Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (cropperOpen) return;
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleNext();
      } else if (e.key === "Escape" && step > 1 && !issuedResult) {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, cropperOpen, issuedResult, entityType, isUnder18, guardianConsent, displayName]);

  // Final Profile & ESPORT ID Creation
  const handleFinalSubmit = async () => {
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

      // Bersihkan draf lokal setelah berhasil terbit
      clearWizardDraft();

      setIssuedResult({
        profileId: result.profileId,
        esportId: result.esportId || "ESB-PDG-PL-100234",
        slug: result.slug || "profil-baru",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan sistem saat membuat profil.";
      setErrorMessage(msg);
      setIsFinishing(false);
    }
  };

  // Tentukan Aspek Rasio Crop Sesuai Entitas
  const getEntityCropperType = (): "avatar" | "logo" | "cover" => {
    if (entityType === "player" || entityType === "coach") return "avatar";
    if (entityType === "venue") return "cover";
    return "logo";
  };

  // Entity Details
  const entityDef = ENTITY_REGISTRY[entityType];

  return (
    <div className="w-full min-h-screen bg-[#07080C] text-white flex flex-col select-none">
      {/* ========================================================= */}
      {/* 1. PROGRESS BAR TIPIS EMAS DI PALING ATAS (TANPA "1 DARI 6") */}
      {/* ========================================================= */}
      <div className="sticky top-0 w-full h-1 bg-white/[0.06] z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#F3E5AB]"
          initial={{ width: "16%" }}
          animate={{ width: `${(step / 6) * 100}%` }}
          transition={{ ease: "easeInOut", duration: 0.35 }}
        />
      </div>

      {/* TOP BAR / NAVIGATION */}
      <header className="w-full border-b border-white/[0.06] bg-[#07080C]/90 backdrop-blur-md px-8 py-3.5 flex items-center justify-between z-40">
        <div className="flex items-center gap-4">
          {step > 1 && !issuedResult ? (
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 text-xs font-mono text-white/70 hover:text-white transition-all group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Kembali</span>
              <kbd className="hidden sm:inline px-1 py-0.2 bg-white/10 rounded text-[9px] text-white/40">
                Esc
              </kbd>
            </button>
          ) : (
            <Link
              href="/me/cards"
              className="inline-flex items-center gap-2 text-xs font-mono text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Daftar Kartu</span>
            </Link>
          )}

          <div className="h-4 w-px bg-white/10" />

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-all ${
                  s === step
                    ? "bg-[#D4AF37] scale-125 shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                    : s < step
                    ? "bg-emerald-400/80"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>

          <span className="text-xs font-mono text-white/60 ml-2">
            Langkah {step} • {
              step === 1 ? "Pilih Bidang" :
              step === 2 ? "Tanggal Lahir / Tahun" :
              step === 3 ? "Identitas & Atribut" :
              step === 4 ? "Foto / Logo" :
              step === 5 ? "Pengaturan Privasi" : "Tinjau & Terbitkan"
            }
          </span>
        </div>

        {/* Draft Notification Badge */}
        <div className="flex items-center gap-3">
          {hasDraftRestored && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[10px] font-mono text-[#D4AF37]">
              <span>Draf Tersimpan</span>
              <button
                type="button"
                onClick={() => {
                  clearWizardDraft();
                  setHasDraftRestored(false);
                  window.location.reload();
                }}
                className="hover:underline text-white/60 ml-1"
                title="Hapus draf dan mulai dari awal"
              >
                Reset
              </button>
            </div>
          )}

          <span className="text-[11px] font-mono text-white/40">
            ESPORT SUMBAR™
          </span>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. BODY DUA KOLOM: FORM KIRI (7/12) & KARTU KANAN (5/12) */}
      {/* ========================================================= */}
      <main className="w-full flex-1 max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* ======================================================= */}
          {/* KOLOM KIRI (7/12): LANGKAH INPUT WIZARD                */}
          {/* ======================================================= */}
          <div className="col-span-12 lg:col-span-7 flex flex-col">
            <div className="p-8 rounded-3xl bg-[#0D1017] border border-white/[0.08] shadow-2xl relative overflow-hidden">
              {/* Brand top accent bar */}
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-brand-pink to-transparent opacity-80" />

              {/* Error Message Alert */}
              {errorMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Dynamic Step Content */}
              <div className="min-h-[420px]">
                <AnimatePresence mode="wait">
                  {/* =================================================== */}
                  {/* LANGKAH 1: PILIH BIDANG (7 PILIHAN RESMI)           */}
                  {/* =================================================== */}
                  {step === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="flex flex-col"
                    >
                      <h2 className="text-2xl font-heading font-black text-white tracking-tight mb-1">
                        Pilih Bidang
                      </h2>
                      <p className="text-xs text-white/50 mb-6">
                        Pilih kategori identitas digital Anda dalam ekosistem ESPORT SUMBAR™.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                  // Update preset label
                                  if (entity.type === "team") {
                                    setDisplayName("Minang Pride Esports");
                                  } else if (entity.type === "coach") {
                                    setDisplayName("Coach Rizal");
                                  } else if (entity.type === "community") {
                                    setDisplayName("Komunitas MLBB Ranah Minang");
                                  } else if (entity.type === "venue") {
                                    setDisplayName("Cyber Minang iCafe");
                                  } else if (entity.type === "campus") {
                                    setDisplayName("UKM Esport UNAND");
                                  } else if (entity.type === "school") {
                                    setDisplayName("Ekskul Esport SMAN 1 Padang");
                                  }
                                }
                              }}
                              disabled={!isEnabled}
                              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                                !isEnabled
                                  ? "bg-white/[0.02] border-white/[0.05] opacity-50 cursor-not-allowed"
                                  : isSelected
                                  ? "bg-[#D4AF37]/10 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                                  : "bg-[#161A24] border-white/[0.06] hover:border-white/20 hover:bg-[#1A1F2C]"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${entity.badgeColor}`}>
                                  {entity.code}
                                </span>
                                {!isEnabled ? (
                                  <span className="text-[9px] font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded">
                                    Segera Hadir
                                  </span>
                                ) : isSelected ? (
                                  <div className="w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#07080C]">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </div>
                                ) : null}
                              </div>

                              <div>
                                <div className="text-sm font-heading font-black text-white">
                                  {entity.label}
                                </div>
                                <div className="text-[11px] text-white/50 mt-1 line-clamp-2">
                                  {entity.description}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* =================================================== */}
                  {/* LANGKAH 2: TANGGAL LAHIR & PERLINDUNGAN ANAK        */}
                  {/* =================================================== */}
                  {step === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="flex flex-col"
                    >
                      {entityType === "player" || entityType === "coach" ? (
                        <>
                          <h2 className="text-2xl font-heading font-black text-white tracking-tight mb-1">
                            Tanggal Lahir
                          </h2>
                          <p className="text-xs text-white/50 mb-6">
                            Diperlukan untuk pembagian divisi usia kompetisi resmi (Senior / Junior) dan kepatuhan UU PDP.
                          </p>

                          <div className="p-5 rounded-2xl bg-[#161A24] border border-white/[0.08] mb-5">
                            <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-2">
                              Pilih Tanggal Lahir Atlet
                            </label>
                            <input
                              type="date"
                              value={birthDate}
                              onChange={(e) => setBirthDate(e.target.value)}
                              className="w-full h-12 bg-[#0A0C13] border border-white/10 rounded-xl px-4 text-sm font-mono text-white outline-none focus:border-[#D4AF37] cursor-pointer"
                            />
                          </div>

                          {/* Under 18 Guardian Consent Flow */}
                          {isUnder18 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-3"
                            >
                              <div className="flex items-center gap-2 text-xs font-heading font-black text-amber-300">
                                <ShieldCheck className="w-4 h-4 text-amber-400" />
                                <span>Persetujuan Orang Tua / Wali Sah (Usia &lt; 18 Tahun)</span>
                              </div>
                              <p className="text-[11px] text-white/70 leading-relaxed">
                                Sesuai UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi, pendaftaran atlet anak wajib menyertakan izin tertulis wali. Foto profil akan disembunyikan secara default.
                              </p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                                <div>
                                  <label className="block text-[10px] font-mono text-white/60 mb-1">
                                    Nama Orang Tua / Wali <span className="text-red-400">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={guardianName}
                                    onChange={(e) => setGuardianName(e.target.value)}
                                    placeholder="Nama lengkap wali"
                                    className="w-full h-10 bg-[#0A0C13] border border-white/10 rounded-xl px-3 text-xs text-white outline-none focus:border-amber-400"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-mono text-white/60 mb-1">
                                    Nomor Telepon / WhatsApp <span className="text-red-400">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={guardianContact}
                                    onChange={(e) => setGuardianContact(e.target.value)}
                                    placeholder="0812xxxxxxxx"
                                    className="w-full h-10 bg-[#0A0C13] border border-white/10 rounded-xl px-3 text-xs text-white outline-none focus:border-amber-400"
                                  />
                                </div>
                              </div>

                              <label className="flex items-start gap-3 mt-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={guardianConsent}
                                  onChange={(e) => setGuardianConsent(e.target.checked)}
                                  className="w-4 h-4 mt-0.5 rounded border-white/20 accent-[#D4AF37]"
                                />
                                <span className="text-[11px] text-white/80 leading-normal">
                                  Saya menyatakan bahwa orang tua/wali telah memberikan persetujuan tertulis resmi untuk pendaftaran profil identitas atlet digital ini (Syarat &amp; Ketentuan v1.0-2026).
                                </span>
                              </label>
                            </motion.div>
                          )}
                        </>
                      ) : (
                        <>
                          <h2 className="text-2xl font-heading font-black text-white tracking-tight mb-1">
                            Tahun Berdiri &amp; Wilayah
                          </h2>
                          <p className="text-xs text-white/50 mb-6">
                            Lembaga, komunitas, dan venue memerlukan verifikasi tahun beroperasi dan wilayah domisili.
                          </p>

                          <div className="p-5 rounded-2xl bg-[#161A24] border border-white/[0.08] flex flex-col gap-4">
                            <div>
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-2">
                                Tahun Berdiri / Mulai Beroperasi
                              </label>
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
                                className="w-full h-12 bg-[#0A0C13] border border-white/10 rounded-xl px-4 text-sm font-mono text-white outline-none focus:border-[#D4AF37]"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* =================================================== */}
                  {/* LANGKAH 3: IDENTITAS & ATRIBUT KHUSUS BIDANG        */}
                  {/* =================================================== */}
                  {step === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="flex flex-col"
                    >
                      <h2 className="text-2xl font-heading font-black text-white tracking-tight mb-1">
                        Identitas &amp; Atribut
                      </h2>
                      <p className="text-xs text-white/50 mb-5">
                        Isi data resmi {entityDef.singularLabel.toLowerCase()} Anda untuk pembuatan kartu digital.
                      </p>

                      {/* Nama Tampil & Wilayah */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                            Nama Lengkap / Resmi <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Nama resmi"
                            maxLength={100}
                            className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                            Domisili Wilayah (Sumatera Barat) <span className="text-red-400">*</span>
                          </label>
                          <select
                            value={regionCode}
                            onChange={(e) => setRegionCode(e.target.value)}
                            className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none cursor-pointer"
                          >
                            {REGIONS_DETAIL.map((r) => (
                              <option key={r.code} value={r.code} className="bg-[#161A24]">
                                {r.name} ({r.code})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Formulir Dinamis Berdasarkan Entitas */}
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

                  {/* =================================================== */}
                  {/* LANGKAH 4: FOTO / LOGO (UNGGAH DENGAN CROP REAL)    */}
                  {/* =================================================== */}
                  {step === 4 && (
                    <motion.div
                      key="step-4"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="flex flex-col"
                    >
                      <h2 className="text-2xl font-heading font-black text-white tracking-tight mb-1">
                        {entityType === "team" || entityType === "community" || entityType === "campus" || entityType === "school"
                          ? "Unggah Logo Resmi"
                          : entityType === "venue"
                          ? "Unggah Foto Sampul & Logo"
                          : "Foto Profil Atlet"}
                      </h2>
                      <p className="text-xs text-white/50 mb-5">
                        Potong dan sesuaikan foto dengan rasio paspor resmi. Gambar akan dikonversi ke WebP otomatis tanpa metadata lokasi.
                      </p>

                      {/* Area Unggah & Tampilan Foto Saat Ini */}
                      <div className="p-6 rounded-2xl bg-[#161A24] border border-white/[0.08] flex flex-col items-center justify-center gap-4 mb-4">
                        <div className="relative">
                          {avatarUrl ? (
                            <div className="w-32 h-40 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-xl relative group">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={avatarUrl} alt="Foto Profil" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCropperType(getEntityCropperType());
                                    setCropperOpen(true);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-[#07080C] text-[11px] font-bold"
                                >
                                  Ganti
                                </button>
                              </div>
                            </div>
                          ) : (
                            <InitialsAvatar
                              name={displayName}
                              entityType={entityType}
                              size="xl"
                              isMinorProtected={isUnder18 && !privacy.fotoPublik}
                            />
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setCropperType(getEntityCropperType());
                              setCropperOpen(true);
                            }}
                            className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] text-xs font-heading font-black uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
                          >
                            <Upload className="w-4 h-4" />
                            <span>{avatarUrl ? "Ganti Foto" : "Unggah & Potong Foto"}</span>
                          </button>

                          {avatarUrl && (
                            <button
                              type="button"
                              onClick={() => setAvatarUrl("")}
                              className="px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 text-xs font-mono text-white/60 hover:text-white transition-all"
                            >
                              Gunakan Avatar Inisial
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Catatan Privasi Foto untuk Atlet <18 */}
                      {isUnder18 && (
                        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-300">
                          <Lock className="w-4 h-4 shrink-0 text-amber-400" />
                          <span>
                            <strong>Perlindungan Anak:</strong> Karena atlet berusia di bawah 18 tahun, foto tidak akan ditampilkan secara publik kecuali jika Anda mengaktifkannya pada langkah Privasi.
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* =================================================== */}
                  {/* LANGKAH 5: PRIVASI DATA (TOGGLE DENGAN DEFAULT AMAN)*/}
                  {/* =================================================== */}
                  {step === 5 && (
                    <motion.div
                      key="step-5"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h2 className="text-2xl font-heading font-black text-white tracking-tight">
                          Privasi Data
                        </h2>
                        {/* Toggle Mode Pratinjau Kartu */}
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#161A24] border border-white/[0.08]">
                          <button
                            type="button"
                            onClick={() => setPreviewMode("owner")}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all ${
                              previewMode === "owner"
                                ? "bg-[#D4AF37] text-[#07080C] font-bold"
                                : "text-white/60 hover:text-white"
                            }`}
                          >
                            Tampilan Anda
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewMode("public")}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all ${
                              previewMode === "public"
                                ? "bg-emerald-500 text-white font-bold"
                                : "text-white/60 hover:text-white"
                            }`}
                          >
                            Tampilan Publik
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-white/50 mb-5">
                        Kontrol data mana yang dapat dilihat oleh publik dan pengunjung direktori ESPORT SUMBAR™.
                      </p>

                      <div className="flex flex-col gap-2.5 mb-4">
                        {[
                          {
                            key: "kontak",
                            label: "Nomor Kontak & WhatsApp",
                            desc: "Hanya terlihat oleh Admin Verifikator Pengcab jika privat.",
                            isPublic: privacy.kontak,
                          },
                          {
                            key: "tglLahir",
                            label: "Tanggal Lahir & Usia Spesifik",
                            desc: "Publik hanya melihat kategori divisi (Junior / Senior).",
                            isPublic: privacy.tglLahir,
                          },
                          {
                            key: "statistik",
                            label: "Statistik Pertandingan & Riwayat",
                            desc: "Menampilkan prestasi dan rekam jejak turnamen.",
                            isPublic: privacy.statistik,
                          },
                          ...(isUnder18
                            ? [
                                {
                                  key: "fotoPublik",
                                  label: "Tampilkan Foto di Profil Publik",
                                  desc: "Memerlukan persetujuan wali untuk tampil di direktori.",
                                  isPublic: privacy.fotoPublik,
                                },
                              ]
                            : []),
                        ].map((item) => (
                          <div
                            key={item.key}
                            className="p-3.5 rounded-xl bg-[#161A24] border border-white/[0.06] flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              {item.isPublic ? (
                                <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : (
                                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                              )}
                              <div>
                                <div className="text-xs font-semibold text-white">{item.label}</div>
                                <div className="text-[10px] font-mono text-white/40">{item.desc}</div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setPrivacy((prev) => ({
                                  ...prev,
                                  [item.key]: !prev[item.key as keyof typeof privacy],
                                }))
                              }
                              className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold transition-all border ${
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

                  {/* =================================================== */}
                  {/* LANGKAH 6: TINJAU & TERBITKAN PROFIL                */}
                  {/* =================================================== */}
                  {step === 6 && (
                    <motion.div
                      key="step-6"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="flex flex-col"
                    >
                      <h2 className="text-2xl font-heading font-black text-white tracking-tight mb-1">
                        Tinjau &amp; Terbitkan
                      </h2>
                      <p className="text-xs text-white/50 mb-5">
                        Pastikan seluruh identitas sudah benar. ESPORT ID resmi akan diterbitkan seketika ke database.
                      </p>

                      {/* Skor Kelengkapan & Rarity Tier Live */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#D4AF37]/15 via-white/[0.02] to-transparent border border-[#D4AF37]/30 mb-5 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-[#D4AF37]" />
                            <span className="text-xs font-heading font-black text-white uppercase">
                              Tier Terbitan: {rarityTier.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-[11px] text-white/60 mt-0.5">
                            Skor kelengkapan data: {completenessScore}%
                          </p>
                        </div>
                        <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#AA7C11] to-[#D4AF37]"
                            style={{ width: `${completenessScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Summary Data Box */}
                      <div className="grid grid-cols-2 gap-3 text-xs mb-5">
                        <div className="p-3 rounded-xl bg-[#161A24] border border-white/[0.06]">
                          <span className="text-[10px] font-mono text-white/40 block">Nama Resmi</span>
                          <span className="font-semibold text-white truncate block">{displayName}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#161A24] border border-white/[0.06]">
                          <span className="text-[10px] font-mono text-white/40 block">Wilayah Pengcab</span>
                          <span className="font-semibold text-[#D4AF37] truncate block">{selectedRegion.name}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#161A24] border border-white/[0.06]">
                          <span className="text-[10px] font-mono text-white/40 block">Game Utama</span>
                          <span className="font-semibold text-white truncate block">{activeGame.name}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#161A24] border border-white/[0.06]">
                          <span className="text-[10px] font-mono text-white/40 block">Status Verifikasi</span>
                          <span className="font-semibold text-white/60 truncate block">Unverified (Siap Diajukan)</span>
                        </div>
                      </div>

                      {/* Hasil Sukses Terbit */}
                      {issuedResult && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-center flex flex-col items-center gap-3 mb-4"
                        >
                          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                            <Sparkles className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-base font-heading font-black text-white block">
                              ESPORT ID Resmi Berhasil Diterbitkan!
                            </span>
                            <span className="text-sm font-mono font-bold text-[#D4AF37] block mt-1">
                              {issuedResult.esportId}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                            <Link
                              href="/dashboard"
                              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D77F] text-[#07080C] text-xs font-heading font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-950/20 hover:brightness-110 transition-all"
                            >
                              <span>Buka Dashboard Saya</span>
                              <ChevronRight className="w-4 h-4" />
                            </Link>

                            <Link
                              href="/me/verification"
                              className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-xs font-mono text-white flex items-center gap-1.5 transition-all"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Ajukan Verifikasi</span>
                            </Link>

                            <button
                              type="button"
                              onClick={() => {
                                if (navigator.share) {
                                  navigator.share({
                                    title: displayName,
                                    text: `Kartu Atlet Esport Sumbar resmi: ${displayName}`,
                                    url: `${window.location.origin}/profile/${issuedResult.slug}`,
                                  }).catch(() => {});
                                } else {
                                  navigator.clipboard.writeText(`${window.location.origin}/profile/${issuedResult.slug}`);
                                  alert("Tautan kartu berhasil disalin ke clipboard!");
                                }
                              }}
                              className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-mono text-white flex items-center gap-1.5"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              <span>Bagikan</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setIssuedResult(null);
                                setStep(1);
                                setAvatarUrl("");
                                setDisplayName("Profil Baru");
                              }}
                              className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 text-xs font-mono text-white/60 hover:text-white flex items-center gap-1.5"
                            >
                              <PlusCircle className="w-3.5 h-3.5" />
                              <span>Tambah Profil</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ACTION BUTTON BAR (SATU TOMBOL UTAMA PER LAYAR) */}
              {!issuedResult && (
                <div className="pt-6 mt-6 border-t border-white/[0.08] flex items-center justify-between">
                  <div>
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={handleBack}
                        disabled={isFinishing}
                        className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/30 text-xs font-mono text-white/70 hover:text-white transition-colors"
                      >
                        Sebelumnya
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isFinishing}
                    className={`px-8 py-3 rounded-xl font-heading font-black text-xs tracking-wider uppercase transition-all flex items-center gap-2 shadow-lg active:scale-[0.99] disabled:opacity-50 ${
                      step === 6
                        ? "bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#AA7C11] text-[#07080C] shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:brightness-110"
                        : "bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C]"
                    }`}
                  >
                    {isFinishing ? (
                      <span>Menerbitkan Kartu...</span>
                    ) : step === 6 ? (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Buat Profil &amp; Terbitkan Kartu</span>
                      </>
                    ) : (
                      <>
                        <span>Lanjut</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ======================================================= */}
          {/* KOLOM KANAN (5/12): KARTU PRATINJAU LENGKET (STICKY)    */}
          {/* ======================================================= */}
          <div className="col-span-12 lg:col-span-5 sticky top-20 flex flex-col items-center">
            {/* Top pill badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-white/60 mb-5">
              <span className={`w-1.5 h-1.5 rounded-full ${previewMode === "public" ? "bg-emerald-400" : "bg-[#D4AF37]"} animate-pulse`} />
              <span>{previewMode === "public" ? "PRATINJAU PUBLIK" : "PRATINJAU REAL-TIME"}</span>
            </div>

            {/* 3D TILT TCG CARD CONTAINER */}
            <div
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className="relative [perspective:1200px]"
            >
              {/* Card Ambient Glow Behind */}
              <div
                className={`absolute inset-0 w-80 h-115 rounded-3xl blur-3xl pointer-events-none transition-all duration-500 ${
                  isFinishing || issuedResult
                    ? "bg-[#D4AF37]/50 scale-125"
                    : "bg-gradient-to-tr from-[#8C5A3C]/20 via-[#D4AF37]/15 to-transparent"
                }`}
              />

              {/* Animated Tilting Card Frame */}
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }}
                className={`relative w-[320px] h-[470px] rounded-[24px] bg-gradient-to-b from-[#1C1F2B] via-[#12151E] to-[#0A0C13] border-2 border-[#8C5A3C] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(140,90,60,0.25)] p-4 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                  isFinishing || issuedResult
                    ? "ring-4 ring-[#D4AF37] shadow-[0_0_60px_rgba(212,175,55,0.7)] scale-[1.03]"
                    : ""
                }`}
              >
                {/* Shining Light Sweep */}
                {(isFinishing || issuedResult) && (
                  <motion.div
                    initial={{ x: "-150%" }}
                    animate={{ x: "200%" }}
                    transition={{ duration: 1.1, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent skew-x-12 z-40 pointer-events-none"
                  />
                )}

                {/* Top Card Row: Rarity Tier Badge + Unverified Status */}
                <div className="w-full flex items-center justify-between z-10">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#8C5A3C]/30 border border-[#8C5A3C]/70 text-[9px] font-mono font-bold text-[#E6B89C] uppercase tracking-wider">
                    {rarityTier.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[9px] font-mono text-white/50">
                    <Shield className="w-3 h-3 text-white/40" />
                    <span>UNVERIFIED</span>
                  </div>
                </div>

                {/* Avatar / Photo Real-Time dengan Fallback Inisial */}
                <div className="relative w-full flex-1 my-3 flex flex-col items-center justify-center">
                  <div className="relative w-28 h-36 rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-[#0F1118]">
                    {/* Jika atlet di bawah 18 tahun dan foto tidak diizinkan publik, tampilkan inisial pada mode pratinjau publik */}
                    {avatarUrl && (previewMode === "owner" || !isUnder18 || privacy.fotoPublik) ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={avatarUrl}
                          alt={displayName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      </>
                    ) : (
                      <InitialsAvatar
                        name={displayName}
                        entityType={entityType}
                        size="full"
                        isMinorProtected={isUnder18 && !privacy.fotoPublik}
                      />
                    )}

                    {/* Brand Micro Mark */}
                    <div className="absolute bottom-1 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-pink shadow-[0_0_6px_#FF1752]" />
                  </div>

                  {/* Live Display Name & IGN */}
                  <div className="text-center mt-2.5">
                    <div className="text-base font-heading font-black tracking-wide text-white truncate max-w-[220px]">
                      {displayName || entityDef.label}
                    </div>
                    <div className="text-xs font-mono font-bold text-[#D4AF37]">
                      {attributes.ign ? `@${attributes.ign}` : `@${entityDef.code}`}
                    </div>
                  </div>
                </div>

                {/* Bottom Card Strip: Game + Role + Region */}
                <div className="w-full pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-white/70 z-10">
                  <div className="truncate max-w-[140px] text-brand-pink font-semibold">
                    {activeGame.shortName} • {attributes.role || entityDef.singularLabel}
                  </div>
                  <div className="px-2 py-0.5 rounded bg-white/[0.06] text-[#D4AF37] font-bold">
                    {selectedRegion.code}
                  </div>
                </div>
              </motion.div>
            </div>

            <span className="mt-4 text-[11px] font-mono text-white/40 tracking-wider">
              Identitas digital atlet ESPORT SUMBAR™
            </span>
          </div>
        </div>
      </main>

      {/* MODAL CROPPER FOTO */}
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
