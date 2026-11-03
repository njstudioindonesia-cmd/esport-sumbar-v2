"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Gamepad2,
  GraduationCap,
  Users,
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Upload,
  Eye,
  Lock,
  Calendar,
  AlertCircle,
  Share2,
  FileCheck,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EsportCard } from "@/components/card/EsportCard";
import { ShareCardModal } from "@/components/card/ShareCardModal";
import { OFFICIAL_GAMES } from "@/data/games";
import { REGIONS_DETAIL } from "@/data/regions";
import { CardEntityType, UnifiedCardData } from "@/types/card";
import { createProfileAction } from "@/app/actions/profile";

export default function NewProfileWizardPage() {
  const router = useRouter();

  // Wizard Step: 1 to 7
  const [step, setStep] = useState(1);

  // Form Fields
  const [roleType, setRoleType] = useState<CardEntityType>("player");

  // Step 2: Birth date & Guardian Consent
  const [birthDate, setBirthDate] = useState("2008-04-12"); // default young player for demo
  const [guardianName, setGuardianName] = useState("");
  const [guardianContact, setGuardianContact] = useState("");
  const [guardianAgreed, setGuardianAgreed] = useState(false);

  // Calculate under 18 in useEffect to comply with Next.js prerender guidelines
  const [isUnder18, setIsUnder18] = useState(false);

  React.useEffect(() => {
    if (!birthDate) {
      setIsUnder18(false);
      return;
    }
    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    setIsUnder18(currentYear - birthYear < 18);
  }, [birthDate]);

  // Step 3: Identitas Esport
  const [displayName, setDisplayName] = useState("Rian Pratama");
  const [ign, setIgn] = useState("SUTAN_RIAN");
  const [selectedGame, setSelectedGame] = useState("Mobile Legends: Bang Bang");
  const [gameRole, setGameRole] = useState("Roamer");
  const [selectedRegionCode, setSelectedRegionCode] = useState("PDG");

  // Step 4: Avatar URL
  const [avatarUrl, setAvatarUrl] = useState(
    "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop"
  );

  // Step 5: Privacy toggles per field
  const [privacyToggles, setPrivacyToggles] = useState({
    displayName: true, // true = public, false = admin & saya
    gameAccount: true,
    district: true,
    socialLinks: false,
    schoolInfo: false,
  });

  // Modal share
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Dynamic role choices based on selected game
  const availableRoles = useMemo(() => {
    const game = OFFICIAL_GAMES.find((g) => g.name === selectedGame);
    return game ? game.roles : ["Player Utama", "Cadangan"];
  }, [selectedGame]);

  // Selected region object
  const currentRegion = useMemo(() => {
    return REGIONS_DETAIL.find((r) => r.code === selectedRegionCode) || REGIONS_DETAIL[0];
  }, [selectedRegionCode]);

  // Live card preview data (Tier 1 Rookie)
  const previewCardData: UnifiedCardData = useMemo(() => {
    return {
      esportId: `ESB-${selectedRegionCode}-${roleType === "player" ? "PL" : roleType === "coach" ? "CO" : "TM"}-000999`,
      displayName: displayName || "Nama Pengguna",
      ign: ign || "IGN_PLAYER",
      teamName: roleType === "team" ? displayName || "Nama Klub" : undefined,
      avatarUrl: avatarUrl,
      logoUrl: roleType === "team" ? avatarUrl : undefined,
      game: selectedGame,
      role: gameRole,
      region: {
        name: currentRegion.name,
        code: currentRegion.code,
      },
      team: roleType === "player" ? { name: "Free Agent" } : undefined,
      rosterCount: roleType === "team" ? { current: 1, max: 7 } : undefined,
      joinedAt: "Baru saja",
    };
  }, [roleType, displayName, ign, avatarUrl, selectedGame, gameRole, selectedRegionCode, currentRegion]);

  // Step Navigation Validation
  const canProceed = () => {
    if (step === 1) return Boolean(roleType);
    if (step === 2) {
      if (!birthDate) return false;
      if (isUnder18 && (!guardianName || !guardianContact || !guardianAgreed)) {
        return false;
      }
      return true;
    }
    if (step === 3) {
      return Boolean(displayName && (roleType === "team" || ign) && selectedGame && gameRole);
    }
    return true;
  };

  const nextStep = () => {
    if (canProceed() && step < 6) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFinishCreation = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const result = await createProfileAction({
      entityType: roleType,
      displayName: displayName,
      ign: ign,
      regionId: currentRegion.id,
      regionCode: selectedRegionCode,
      mainGameId: OFFICIAL_GAMES.find((g) => g.name === selectedGame)?.id,
      roleName: gameRole,
      avatarUrl: avatarUrl,
      birthDate: birthDate,
      guardianConsent: isUnder18 ? {
        guardianName,
        guardianContact,
        guardianRelationship: "Orang Tua / Wali Sah",
      } : undefined,
      visibility: privacyToggles,
    });

    setIsSubmitting(false);
    if (!result.success) {
      setSubmitError(result.error || "Gagal menerbitkan profil.");
      return;
    }
    setStep(7); // Show success celebration
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* WIZARD PROGRESS BAR (Steps 1 to 6) */}
        {step <= 6 && (
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between text-xs font-heading font-bold uppercase tracking-wider text-[#9AA3B2] mb-2">
              <span>Langkah {step} dari 6</span>
              <span className="text-[#D4AF37]">
                {step === 1 && "Pilih Peran Entitas"}
                {step === 2 && "Data Usia & Persetujuan Wali"}
                {step === 3 && "Identitas Esport"}
                {step === 4 && "Foto / Avatar"}
                {step === 5 && "Pengaturan Privasi"}
                {step === 6 && "Tinjau & Terbitkan Kartu"}
              </span>
            </div>
            <div className="w-full h-2 bg-[#161922] rounded-full overflow-hidden flex gap-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={`h-full flex-1 transition-all ${
                    step >= i ? "bg-[#D4AF37]" : "bg-[#262B38]"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* STEP 7: SUCCESS CELEBRATION */}
        {step === 7 ? (
          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-[#12151C] border border-[#D4AF37]/50 shadow-[0_0_60px_rgba(212,175,55,0.25)] flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mb-4">
              <Sparkles className="w-8 h-8 animate-spin" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-heading font-black uppercase text-white tracking-tight mb-2">
              Selamat! Kartu <span className="text-[#D4AF37]">ESPORT ID</span> Terbit
            </h1>
            <p className="text-xs sm:text-sm text-[#9AA3B2] max-w-md mb-6 leading-relaxed">
              Profil Anda telah berhasil didaftarkan dengan status awal <strong>Tier 1 Rookie</strong>. Identitas digital Anda siap dibagikan ke media sosial atau diajukan untuk verifikasi resmi ESI.
            </p>

            {/* Newly Minted Card */}
            <div className="mb-8">
              <EsportCard
                type={roleType}
                rarity="rookie"
                verification="unverified"
                data={previewCardData}
                size="md"
                interactive={true}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
              <button
                type="button"
                onClick={() => setShareModalOpen(true)}
                className="w-full sm:flex-1 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C358] text-black text-xs font-heading font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                <Share2 className="w-4 h-4" />
                <span>Bagikan Kartu (PNG)</span>
              </button>

              <Link
                href="/dashboard"
                className="w-full sm:flex-1 py-3 rounded-xl bg-[#1A1E28] hover:bg-[#262B38] border border-[#262B38] text-gray-200 text-xs font-heading font-bold uppercase tracking-wider text-center"
              >
                Buka Dashboard Saya
              </Link>
            </div>
          </div>
        ) : (
          /* STEPS 1-6 FORM + LIVE CARD PREVIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* LEFT / FORM COLUMN */}
            <div className="lg:col-span-7 flex flex-col gap-6 bg-[#12151C] border border-[#262B38] rounded-2xl p-6 sm:p-8 shadow-xl">
              {/* STEP 1: PILIH PERAN */}
              {step === 1 && (
                <div className="flex flex-col gap-5">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-heading font-bold uppercase text-white">
                      1. Pilih Peran di Ekosistem
                    </h2>
                    <p className="text-xs text-[#9AA3B2] mt-1">
                      Satu akun dapat memiliki lebih dari satu profil (contoh: pemain sekaligus pelatih). Pilih profil utama yang ingin Anda buat terlebih dahulu.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: "player",
                        name: "Player (Atlet)",
                        icon: Gamepad2,
                        desc: "Atlet perseorangan untuk nomor game kompetitif resmi.",
                      },
                      {
                        id: "coach",
                        name: "Coach (Pelatih)",
                        icon: GraduationCap,
                        desc: "Pelatih taktis, analis, atau pembina tim berlisensi.",
                      },
                      {
                        id: "team",
                        name: "Team (Klub/Squad)",
                        icon: Users,
                        desc: "Klub, squad, atau organisasi kompetitif ber-roster.",
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = roleType === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setRoleType(item.id as any)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                            isSelected
                              ? "bg-[#D4AF37]/10 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                              : "bg-[#161922] border-[#262B38] hover:border-gray-500"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              isSelected
                                ? "bg-[#D4AF37] text-black"
                                : "bg-[#1A1E28] text-gray-300"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-heading font-bold text-sm text-white">
                              {item.name}
                            </h3>
                            <p className="text-[11px] text-[#9AA3B2] leading-relaxed mt-1">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: USIA & WALI (UU PDP) */}
              {step === 2 && (
                <div className="flex flex-col gap-5">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-heading font-bold uppercase text-white">
                      2. Data Usia & Perlindungan Anak
                    </h2>
                    <p className="text-xs text-[#9AA3B2] mt-1">
                      Sesuai Undang-Undang Perlindungan Data Pribadi (UU PDP), pengguna di bawah 18 tahun wajib menyertakan persetujuan orang tua/wali.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-heading font-semibold text-gray-300 uppercase">
                      Tanggal Lahir Pemilik Akun
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full bg-[#1A1E28] border border-[#262B38] focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* GUARDIAN CONSENT BLOCK (TRIGGERED IF UNDER 18) */}
                  {isUnder18 ? (
                    <div className="p-4 rounded-xl bg-[#1A1810] border border-[#D4AF37]/50 flex flex-col gap-3.5 animate-in fade-in">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#D4AF37]" />
                        <h4 className="font-heading font-bold text-xs uppercase text-[#D4AF37]">
                          Persetujuan Orang Tua / Wali Diperlukan
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#9AA3B2] leading-relaxed">
                        Anda terdeteksi berusia di bawah 18 tahun. Profil publik Anda akan otomatis diatur <strong>minimal secara default</strong> (nama asli dan sekolah disembunyikan). Silakan cantumkan data orang tua/wali.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-heading text-gray-300 uppercase">
                            Nama Lengkap Orang Tua / Wali
                          </label>
                          <input
                            type="text"
                            value={guardianName}
                            onChange={(e) => setGuardianName(e.target.value)}
                            placeholder="Contoh: Hendra Pratama"
                            className="bg-[#12151C] border border-[#262B38] rounded-lg p-2 text-xs text-white"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-heading text-gray-300 uppercase">
                            Nomor WhatsApp / HP Wali
                          </label>
                          <input
                            type="text"
                            value={guardianContact}
                            onChange={(e) => setGuardianContact(e.target.value)}
                            placeholder="0812-xxxx-xxxx"
                            className="bg-[#12151C] border border-[#262B38] rounded-lg p-2 text-xs text-white"
                          />
                        </div>
                      </div>

                      <label className="flex items-start gap-2 text-xs text-gray-300 cursor-pointer pt-2 border-t border-[#262B38]">
                        <input
                          type="checkbox"
                          checked={guardianAgreed}
                          onChange={(e) => setGuardianAgreed(e.target.checked)}
                          className="mt-0.5 rounded border-[#262B38] text-[#D4AF37] focus:ring-0"
                        />
                        <span className="text-[11px] leading-tight">
                          Orang tua / wali saya telah menyetujui pendaftaran kartu ESPORT ID ini dan mengizinkan ESI melakukan verifikasi berjenjang.
                        </span>
                      </label>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-xs text-[#22C55E] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Usia Anda memenuhi syarat pendaftaran mandiri (≥ 18 tahun).</span>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: IDENTITAS ESPORT */}
              {step === 3 && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-heading font-bold uppercase text-white">
                      3. Identitas & Cabang Game
                    </h2>
                    <p className="text-xs text-[#9AA3B2] mt-1">
                      Data ini akan tampil di bagian depan kartu TCG Anda.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* IGN */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-heading font-semibold text-gray-300 uppercase">
                        {roleType === "team" ? "Nama Tim / Klub" : "In-Game Name (IGN)"}
                      </label>
                      <input
                        type="text"
                        value={ign}
                        onChange={(e) => setIgn(e.target.value)}
                        placeholder="Contoh: SUTAN_AIM"
                        className="bg-[#1A1E28] border border-[#262B38] focus:border-[#D4AF37] rounded-xl p-2.5 text-xs sm:text-sm text-white focus:outline-none"
                      />
                    </div>

                    {/* Nama Tampil */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-heading font-semibold text-gray-300 uppercase">
                        Nama Lengkap / Nama Tampil
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Contoh: Raka Pratama"
                        className="bg-[#1A1E28] border border-[#262B38] focus:border-[#D4AF37] rounded-xl p-2.5 text-xs sm:text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Game & Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-heading font-semibold text-gray-300 uppercase">
                        Cabang Game Utama
                      </label>
                      <select
                        value={selectedGame}
                        onChange={(e) => setSelectedGame(e.target.value)}
                        className="bg-[#1A1E28] border border-[#262B38] rounded-xl p-2.5 text-xs sm:text-sm text-white focus:outline-none"
                      >
                        {OFFICIAL_GAMES.map((g) => (
                          <option key={g.id} value={g.name}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-heading font-semibold text-gray-300 uppercase">
                        Peran / Role di Game
                      </label>
                      <select
                        value={gameRole}
                        onChange={(e) => setGameRole(e.target.value)}
                        className="bg-[#1A1E28] border border-[#262B38] rounded-xl p-2.5 text-xs sm:text-sm text-white focus:outline-none"
                      >
                        {availableRoles.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Kota / Kabupaten (19 Daerah) */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-heading font-semibold text-gray-300 uppercase">
                      Domisili Daerah (Pengcab ESI Anda)
                    </label>
                    <select
                      value={selectedRegionCode}
                      onChange={(e) => setSelectedRegionCode(e.target.value)}
                      className="bg-[#1A1E28] border border-[#262B38] rounded-xl p-2.5 text-xs sm:text-sm text-white focus:outline-none"
                    >
                      <optgroup label="7 Kota">
                        {REGIONS_DETAIL.filter((r) => r.type === "kota").map((r) => (
                          <option key={r.code} value={r.code}>
                            {r.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="12 Kabupaten">
                        {REGIONS_DETAIL.filter((r) => r.type === "kabupaten").map((r) => (
                          <option key={r.code} value={r.code}>
                            {r.name}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 4: FOTO / LOGO */}
              {step === 4 && (
                <div className="flex flex-col gap-5">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-heading font-bold uppercase text-white">
                      4. Foto Profil & Avatar Kartu
                    </h2>
                    <p className="text-xs text-[#9AA3B2] mt-1">
                      Pilih foto potret menghadap depan untuk atlet/pelatih, atau logo berkualitas tinggi untuk tim.
                    </p>
                  </div>

                  {/* Preset Avatar Selection */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-heading text-gray-300 uppercase">
                      Pilih dari Foto Contoh atau Unggah Sendiri:
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=400&auto=format&fit=crop",
                      ].map((url, idx) => (
                        <div
                          key={idx}
                          onClick={() => setAvatarUrl(url)}
                          className={`aspect-square rounded-xl overflow-hidden border cursor-pointer transition-all ${
                            avatarUrl === url
                              ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/50 scale-105"
                              : "border-[#262B38] opacity-70 hover:opacity-100"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt="Preset"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upload Box (Simulated for client preview) */}
                  <div className="p-6 rounded-2xl border-2 border-dashed border-[#262B38] hover:border-[#D4AF37] text-center flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer bg-[#0E1117]">
                    <Upload className="w-8 h-8 text-[#D4AF37]" />
                    <p className="text-xs font-heading font-bold text-white uppercase">
                      Klik untuk Unggah Gambar dari Perangkat
                    </p>
                    <p className="text-[10px] text-[#9AA3B2]">
                      Mendukung format PNG atau JPG (Maks. 3 MB)
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 5: PENGATURAN PRIVASI PER FIELD */}
              {step === 5 && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-heading font-bold uppercase text-white">
                      5. Kontrol Privasi per Field
                    </h2>
                    <p className="text-xs text-[#9AA3B2] mt-1">
                      Tentukan informasi mana saja yang ingin Anda tampilkan kepada pengunjung publik di direktori.
                    </p>
                  </div>

                  <div className="flex flex-col divide-y divide-[#262B38] bg-[#0E1117] rounded-xl border border-[#262B38] p-3 text-xs">
                    {[
                      {
                        key: "displayName",
                        label: "Nama Asli Lengkap",
                        desc: "Jika disembunyikan, hanya IGN Anda yang terlihat oleh publik.",
                      },
                      {
                        key: "district",
                        label: "Kota / Kabupaten Asal",
                        desc: "Menampilkan daerah domisili Anda di kartu dan halaman jelajah.",
                      },
                      {
                        key: "gameAccount",
                        label: "Riwayat Akun Game & Peran",
                        desc: "Menampilkan game utama dan role ke dalam rekam jejak publik.",
                      },
                      {
                        key: "socialLinks",
                        label: "Tautan Media Sosial",
                        desc: "Menghubungkan akun Instagram/TikTok Anda ke profil.",
                      },
                      {
                        key: "schoolInfo",
                        label: "Asal Sekolah / Kampus",
                        desc: "Afiliasi institusi pendidikan (default terkunci bagi <18 th).",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="py-3 flex items-center justify-between gap-3"
                      >
                        <div className="flex flex-col">
                          <span className="font-heading font-bold text-white">
                            {item.label}
                          </span>
                          <span className="text-[10px] text-[#9AA3B2]">
                            {item.desc}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setPrivacyToggles((prev: any) => ({
                              ...prev,
                              [item.key]: !prev[item.key],
                            }))
                          }
                          className={`px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase transition-all ${
                            (privacyToggles as any)[item.key]
                              ? "bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40"
                              : "bg-[#1A1E28] text-gray-400 border border-[#262B38]"
                          }`}
                        >
                          {(privacyToggles as any)[item.key] ? "Publik" : "Privat (Admin)"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: TINJAU & BUAT KARTU */}
              {step === 6 && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-heading font-bold uppercase text-white">
                      6. Tinjau Kartu ESPORT ID
                    </h2>
                    <p className="text-xs text-[#9AA3B2] mt-1">
                      Periksa kembali data Anda sebelum kartu dicetak ke pangkalan data resmi.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0E1117] border border-[#262B38] flex flex-col gap-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#9AA3B2]">Kategori Entitas:</span>
                      <span className="font-heading font-bold text-white uppercase">{roleType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#9AA3B2]">In-Game Name (IGN):</span>
                      <span className="font-heading font-bold text-[#D4AF37]">{ign}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#9AA3B2]">Cabang Game:</span>
                      <span className="font-heading font-bold text-white">{selectedGame} ({gameRole})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#9AA3B2]">Wilayah Pengcab:</span>
                      <span className="font-heading font-bold text-white">{currentRegion.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#9AA3B2]">Tier Awal:</span>
                      <span className="font-heading font-bold text-[#E6B89C]">Tier 1 - Rookie</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[11px] text-[#D4AF37] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Kartu Anda langsung aktif dan dapat diunduh dalam resolusi 2x HD setelah ini.</span>
                  </div>
                </div>
              )}

              {/* NAVIGATION BUTTONS */}
              <div className="flex items-center justify-between pt-4 border-t border-[#262B38]">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1A1E28] hover:bg-[#262B38] text-xs font-heading font-bold uppercase text-gray-300"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Sebelumnya</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 6 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C358] text-black text-xs font-heading font-extrabold uppercase tracking-wider disabled:opacity-50"
                  >
                    <span>Langkah Selanjutnya</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex flex-col items-end gap-2">
                    {submitError && (
                      <span className="text-[11px] text-[#EF4444] font-medium">{submitError}</span>
                    )}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleFinishCreation}
                      className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C358] text-black text-xs font-heading font-extrabold uppercase tracking-wider shadow-lg hover:brightness-110 disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isSubmitting ? "Menerbitkan Kartu..." : "Terbitkan Kartu Sekarang"}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT / LIVE CARD PREVIEW COLUMN */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="sticky top-24 flex flex-col items-center gap-3">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Pratinjau Kartu Live (Rookie)
                </span>

                <EsportCard
                  type={roleType}
                  rarity="rookie"
                  verification="unverified"
                  data={previewCardData}
                  size="md"
                  interactive={true}
                />

                <span className="text-[10px] text-[#9AA3B2] text-center max-w-[280px]">
                  Kartu ini terbarui secara instan saat Anda mengisi formulir.
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* SHARE MODAL */}
      <ShareCardModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        cardData={{
          type: roleType,
          rarity: "rookie",
          verification: "unverified",
          data: previewCardData,
        }}
      />

      <Footer />
    </div>
  );
}
