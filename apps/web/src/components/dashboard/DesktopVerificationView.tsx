"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Lock,
  Clock,
  FileText,
  Calendar,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Send,
  Loader2,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { uploadEvidenceAction } from "@/app/actions/upload";

interface VerificationData {
  profile: {
    id: string;
    displayName: string;
    ign: string | null;
    esportId: string;
    entityType: string;
    regionId: string;
    regionName: string;
    regionCode: string;
    gameName: string;
    verificationStatus: string;
    rarityTier: string;
  } | null;
  request: {
    id: string;
    status: string;
    notes: string | null;
    submittedAt: string;
    decidedAt: string | null;
    evidenceFiles: { name: string; url: string; size?: string }[];
    revisionFields: string[];
  } | null;
}

export function DesktopVerificationView() {
  const [data, setData] = useState<VerificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  // Form submission state
  const [userNotes, setUserNotes] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{ id: string; title: string; fileName: string; url: string; size?: string }[]>([]);
  const [uploadingSlotId, setUploadingSlotId] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadVerificationData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/me/verification");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.warn("Failed to load verification status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVerificationData();
  }, []);

  const profile = data?.profile;
  const request = data?.request;
  const status = profile?.verificationStatus || "unverified";
  const entityType = profile?.entityType || "player";

  // Dynamic Stepper calculation based on true status
  const getSteps = () => {
    const isSubmitted = ["submitted", "in_review_regional", "regional_checked", "verified", "revision_requested"].includes(status);
    const isRegionalChecked = ["regional_checked", "verified"].includes(status);
    const isVerified = status === "verified";
    const isRevision = status === "revision_requested";

    return [
      {
        id: 1,
        name: "Diajukan",
        date: request?.submittedAt ? new Date(request.submittedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : (status !== "unverified" ? "Terkirim" : "Belum Diajukan"),
        status: isSubmitted ? "completed" : "active",
      },
      {
        id: 2,
        name: `Pengcab ${profile?.regionName || "Daerah"}`,
        date: isRevision ? "Perlu Revisi" : isRegionalChecked ? "Lolos Seleksi" : isSubmitted ? "Dalam Telaah" : "Menunggu Berkas",
        status: isRevision ? "revision" : isRegionalChecked ? "completed" : isSubmitted ? "active" : "upcoming",
      },
      {
        id: 3,
        name: "Pengprov Sumbar",
        date: isVerified ? "Disahkan" : isRegionalChecked ? "Dalam Pengesahan" : "Menunggu Daerah",
        status: isVerified ? "completed" : isRegionalChecked ? "active" : "upcoming",
      },
      {
        id: 4,
        name: "Lencana Emas",
        date: isVerified ? "Aktif" : "Menunggu Selesai",
        status: isVerified ? "completed" : "upcoming",
      },
    ];
  };

  const steps = getSteps();

  // Document templates tailored to Entity Type
  const getDocumentSlots = () => {
    if (entityType === "team") {
      return [
        {
          id: "legalitas_tim",
          title: "Surat Keputusan / Legalitas Tim",
          desc: "Akta pendirian klub, SK kepengurusan tim, atau surat keterangan manajemen resmi.",
          defaultFile: "sk_kepengurusan_klub.pdf",
        },
        {
          id: "roster_domisili",
          title: "Daftar Roster & Bukti Domisili Sumbar",
          desc: "Daftar susunan pemain aktif beserta identitas domisili Sumatera Barat.",
          defaultFile: "roster_resmi_tim.pdf",
        },
        {
          id: "prestasi_tim",
          title: "Piagam Prestasi Turnamen Tim",
          desc: "Sertifikat juara turnamen resmi atau piagam kejuaraan yang pernah diikuti.",
          defaultFile: "portofolio_kejuaraan_tim.pdf",
        },
      ];
    }
    if (entityType === "school" || entityType === "campus") {
      return [
        {
          id: "sk_sekolah",
          title: "Surat Keterangan Sekolah / Kampus",
          desc: "SK Kepala Sekolah / Dekan pengesahan Ekstrakurikuler atau UKM Esport resmi.",
          defaultFile: "sk_ekstrakurikuler_esport.pdf",
        },
        {
          id: "daftar_anggota",
          title: "Daftar Pelajar / Mahasiswa Binaan",
          desc: "Kartu Pelajar/Mahasiswa aktif anggota komunitas esport sekolah.",
          defaultFile: "daftar_atlet_pelajar.pdf",
        },
        {
          id: "surat_pembina",
          title: "Surat Mandat Guru Pembina",
          desc: "Penunjukan guru pendamping / pembina resmi perwakilan sekolah.",
          defaultFile: "surat_mandat_guru_pembina.pdf",
        },
      ];
    }
    // Default: Player or Coach
    return [
      {
        id: "ktp",
        title: "Kartu Tanda Penduduk (KTP) / KIA",
        desc: "Identitas resmi domisili Sumatera Barat untuk validasi NIK dan usia.",
        defaultFile: "identitas_resmi_ktp_kia.jpg",
      },
      {
        id: "piagam",
        title: "Piagam Prestasi / Sertifikat Turnamen",
        desc: "Sertifikat turnamen resmi PBESI, Kejurda, Porprov, atau turnamen komunitas resmi.",
        defaultFile: "piagam_kejuaraan_terakhir.pdf",
      },
      {
        id: "rekomendasi",
        title: "Surat Rekomendasi Klub / Pengcab",
        desc: "Surat pengantar resmi dari manajer tim terdaftar atau Pengcab ESI daerah.",
        defaultFile: "surat_rekomendasi_resmi.pdf",
      },
    ];
  };

  const documentSlots = getDocumentSlots();

  const handleFileSelected = async (slotId: string, slotTitle: string, file: File) => {
    if (!profile) return;
    setUploadingSlotId(slotId);
    setSubmitError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("profileId", profile.id);

      const res = await uploadEvidenceAction(formData);
      if (!res.success) {
        throw new Error(res.error || "Gagal mengunggah berkas bukti.");
      }

      setUploadedFiles((prev) => {
        const filtered = prev.filter((f) => f.id !== slotId);
        return [
          ...filtered,
          {
            id: slotId,
            title: slotTitle,
            fileName: res.name || file.name,
            url: res.signedUrl || res.path || "",
            size: res.size || `${(file.size / 1024).toFixed(0)} KB`,
          },
        ];
      });

      setSubmitSuccess(`Berkas "${res.name || file.name}" berhasil diunggah.`);
      setTimeout(() => setSubmitSuccess(null), 3500);
    } catch (err: any) {
      setSubmitError(err.message || "Gagal mengunggah berkas bukti.");
    } finally {
      setUploadingSlotId(null);
    }
  };

  const handleSubmitVerification = async () => {
    if (!profile) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const evidenceFiles = uploadedFiles.map((f) => ({
        name: f.fileName,
        url: f.url,
        size: f.size || "1.2 MB",
      }));

      // Wajibkan minimal 1 dokumen bukti nyata diunggah
      if (evidenceFiles.length === 0 && (!request?.evidenceFiles || request.evidenceFiles.length === 0)) {
        throw new Error("Harap unggah setidaknya 1 berkas bukti pendukung (KTP/SK/Piagam) sebelum mengirim pengajuan.");
      }

      const payloadFiles = evidenceFiles.length > 0 ? evidenceFiles : request?.evidenceFiles || [];

      const res = await fetch("/api/me/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: profile.id,
          regionId: profile.regionId,
          notes: userNotes || `Pengajuan verifikasi resmi entitas ${profile.entityType} untuk ${profile.displayName}.`,
          evidenceFiles: payloadFiles,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "Gagal mengirim berkas verifikasi");
      }

      setSubmitSuccess("Berkas verifikasi resmi berhasil dikirimkan ke antrean Pengcab ESI!");
      await loadVerificationData();
    } catch (err: any) {
      setSubmitError(err.message || "Terjadi kesalahan saat mengajukan verifikasi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center gap-3 text-white/50">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
        <span className="text-xs font-mono">Memuat status verifikasi Anda...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-12 text-center rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-col items-center gap-4">
        <ShieldCheck className="w-12 h-12 text-[#D4AF37]" />
        <div>
          <h2 className="text-lg font-heading font-black text-white">Belum Ada Profil Terdaftar</h2>
          <p className="text-xs text-white/50 max-w-sm mt-1">
            Silakan buat profil digital atau kartu paspor terlebih dahulu sebelum mengajukan verifikasi keabsahan PBESI.
          </p>
        </div>
        <Link href="/me/profile/new" className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-heading font-black text-xs uppercase tracking-wider">
          Buat Profil Sekarang →
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[10px] font-mono text-[#D4AF37] font-bold uppercase">
              {entityType.toUpperCase()} • {profile.regionName}
            </span>
            <span className="text-xs font-mono text-white/40">
              {profile.esportId}
            </span>
          </div>
          <h1 className="text-2xl font-heading font-black text-white tracking-tight">
            Status Verifikasi Resmi: {profile.displayName}
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Pelacakan validasi berjenjang oleh Pengcab Kota/Kabupaten dan Pengprov ESI Sumatera Barat.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-mono text-[#D4AF37] self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <span>
            {status === "verified"
              ? "TAHAP 4 • TERVERIFIKASI RESMI"
              : status === "regional_checked"
              ? "TAHAP 3 • PENGESAHAN PROVINSI"
              : status === "submitted" || status === "in_review_regional"
              ? "TAHAP 2 • PENELAAHAN PENGCAB DAERAH"
              : status === "revision_requested"
              ? "TAHAP 2 • PERLU REVISI DOKUMEN"
              : "TAHAP 1 • MENUNGGU PENGAJUAN BERKAS"}
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. TRACKER HORIZONTAL BERGAYA PELACAK PAKET               */}
      {/* ========================================================= */}
      <div className="p-8 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] shadow-2xl backdrop-blur-xl">
        <div className="relative flex items-center justify-between max-w-4xl mx-auto px-4 sm:px-8">
          {/* Connecting Line */}
          <div className="absolute left-12 right-12 top-6 h-0.5 bg-white/[0.08] -z-0">
            <div
              className={`h-full bg-gradient-to-r from-emerald-500 via-[#D4AF37] to-transparent transition-all duration-500 ${
                status === "verified"
                  ? "w-full"
                  : status === "regional_checked"
                  ? "w-[75%]"
                  : status === "submitted" || status === "in_review_regional" || status === "revision_requested"
                  ? "w-[45%]"
                  : "w-[15%]"
              }`}
            />
          </div>

          {/* Stepper Nodes */}
          {steps.map((st) => (
            <div key={st.id} className="relative z-10 flex flex-col items-center">
              {st.status === "completed" ? (
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : st.status === "revision" ? (
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-500 text-amber-400 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              ) : st.status === "active" ? (
                <div className="relative w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border-2 border-[#D4AF37] text-[#D4AF37] flex items-center justify-center shadow-[0_0_24px_rgba(212,175,55,0.5)]">
                  <span className="w-4 h-4 rounded-full bg-[#D4AF37] animate-pulse" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-[#161A24] border border-white/[0.08] text-white/30 flex items-center justify-center">
                  <span className="font-mono text-sm font-bold">0{st.id}</span>
                </div>
              )}

              <div className="text-center mt-3">
                <div
                  className={`text-sm font-heading font-bold ${
                    st.status === "active"
                      ? "text-[#D4AF37]"
                      : st.status === "completed"
                      ? "text-emerald-400"
                      : st.status === "revision"
                      ? "text-amber-400"
                      : "text-white/40"
                  }`}
                >
                  {st.name}
                </div>
                <div className="text-[10px] font-mono text-white/40 mt-0.5">
                  {st.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEEDBACK TOAST / ALERT */}
      {submitSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{submitSuccess}</span>
        </div>
      )}

      {submitError && (
        <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span>{submitError}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. CATATAN PEMERIKSAAN DARI PENGCAB (JIKA ADA REVISI/NOTE) */}
      {/* ========================================================= */}
      {status === "revision_requested" && (
        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-sm text-amber-400">
                  Catatan Pemeriksaan Pengcab {profile.regionName}
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300">
                  PERLU REVISI
                </span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed mt-1 max-w-2xl">
                {request?.notes || "Mohon perbarui atau lengkapi berkas identitas resmi Anda agar dapat disahkan."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveHighlight("dokumen")}
              className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold transition-all"
            >
              Unggah Perbaikan Sekarang
            </button>
          </div>
        </div>
      )}

      {/* JIKA STATUS UNVERIFIED: BANNER AJAKAN VERIFIKASI */}
      {status === "unverified" && (
        <div className="p-6 rounded-3xl bg-blue-950/20 border border-blue-800/40 text-xs text-[#93C5FD] flex items-start gap-3.5 shadow-md">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1 leading-relaxed">
            <span className="font-heading font-black uppercase text-white text-sm">
              Ajukan Verifikasi Resmi PBESI {profile.regionName}
            </span>
            <span>
              Sebagai entitas <strong>{entityType.toUpperCase()}</strong> terdaftar ({profile.displayName}), Anda berhak memperoleh lisensi dan lencana keabsahan resmi dari Pengprov ESI Sumatera Barat. Unggah dokumen pendukung di bawah ini untuk diverifikasi langsung oleh Pengurus Cabang Anda.
            </span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. DUA KOLOM: TILE BUKTI & INFORMASI STATUS RESMI          */}
      {/* ========================================================= */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* KOLOM KIRI (8 COLS): DOKUMEN BUKTI SESUAI ENTITAS */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-heading font-black text-base text-white">
              Dokumen Bukti Pendukung ({entityType.toUpperCase()})
            </h3>
            <span className="text-[11px] font-mono text-white/40">
              Enkripsi AES-256 • Sesuai UU PDP No. 27/2022
            </span>
          </div>

          {/* Dokumen Slots Sesuai Bidang */}
          {documentSlots.map((slot, idx) => {
            const uploaded = uploadedFiles.find((f) => f.id === slot.id);
            const existingFile = request?.evidenceFiles?.[idx] || request?.evidenceFiles?.find((f) => f.name.toLowerCase().includes(slot.id));
            const isHighlighted = activeHighlight === slot.id || activeHighlight === "dokumen";
            const isUploadingThis = uploadingSlotId === slot.id;

            return (
              <div
                key={slot.id}
                className={`p-6 rounded-3xl bg-[#0F1118]/80 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                  isHighlighted
                    ? "border-amber-400 ring-2 ring-amber-400/30 bg-amber-500/5 shadow-xl"
                    : "border-white/[0.08] hover:border-white/20"
                }`}
              >
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={(el) => {
                    fileInputRefs.current[slot.id] = el;
                  }}
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelected(slot.id, slot.title, f);
                  }}
                />

                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#161A24] border border-white/10 flex items-center justify-center text-[#D4AF37] group-hover:scale-105 transition-transform shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-black text-sm text-white">
                        {slot.title}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          uploaded
                            ? "bg-emerald-500/15 text-emerald-400"
                            : existingFile || status === "verified"
                            ? "bg-blue-500/15 text-blue-400"
                            : status === "revision_requested"
                            ? "bg-amber-500/15 text-amber-400"
                            : "bg-white/[0.06] text-white/50"
                        }`}
                      >
                        {uploaded
                          ? "Siap Diunggah"
                          : status === "verified"
                          ? "Terverifikasi"
                          : existingFile
                          ? "Sudah Terkirim"
                          : status === "revision_requested"
                          ? "Perlu Diunggah"
                          : "Wajib"}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed mt-0.5">
                      {slot.desc}
                    </p>
                    <span className="text-[10px] font-mono text-white/40 block mt-1">
                      {uploaded ? (
                        <span className="text-emerald-400">Berkas baru: {uploaded.fileName} ({uploaded.size})</span>
                      ) : existingFile ? (
                        <span className="text-white/60">Terkirim: {existingFile.name} {existingFile.size ? `(${existingFile.size})` : ""}</span>
                      ) : (
                        <span className="text-white/30">Belum ada berkas dipilih</span>
                      )}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isUploadingThis || status === "verified"}
                  onClick={() => fileInputRefs.current[slot.id]?.click()}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-[#D4AF37] hover:text-[#07080C] border border-white/10 text-xs font-mono font-bold text-white transition-all flex items-center justify-center gap-1.5 shrink-0 self-end sm:self-auto disabled:opacity-50"
                >
                  {isUploadingThis ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                      <span>Mengunggah...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploaded || existingFile ? "Ganti Berkas" : "Pilih Berkas"}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}

          {/* Form Pengajuan / Catatan Pengirim */}
          {(status === "unverified" || status === "revision_requested") && (
            <div className="p-6 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-col gap-4 mt-2">
              <span className="text-xs font-heading font-bold text-white">
                Catatan Pengantar Pengajuan (Opsional)
              </span>
              <textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="Tuliskan keterangan tambahan untuk pengurus cabang (misal: portofolio turnamen, nomor kontak manajer, dll)..."
                className="w-full h-24 p-4 rounded-2xl bg-[#161A24] border border-white/10 text-xs text-white placeholder-white/30 focus:border-[#D4AF37] outline-none resize-none font-sans"
              />

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-white/40 font-mono">
                  Pengajuan akan dikirimkan ke antrean Pengcab ESI {profile.regionName}.
                </span>
                <button
                  type="button"
                  onClick={handleSubmitVerification}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D77F] text-[#07080C] text-xs font-heading font-black uppercase tracking-wider hover:brightness-110 shadow-lg disabled:opacity-50 flex items-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{status === "revision_requested" ? "Kirim Berkas Revisi" : "Kirim Pengajuan"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* KOLOM KANAN (4 COLS): STATUS LISENSI & OTORITAS */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Cincin Status Lisensi */}
          <div className="p-6 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-col items-center text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4">
              STATUS KEABSAHAN LISENSI
            </span>

            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke={status === "verified" ? "#22C55E" : "#D4AF37"}
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={
                    status === "verified"
                      ? 0
                      : status === "regional_checked"
                      ? 2 * Math.PI * 50 * 0.25
                      : status === "submitted"
                      ? 2 * Math.PI * 50 * 0.5
                      : 2 * Math.PI * 50 * 0.85
                  }
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute flex flex-col items-center px-2">
                <span className="font-mono font-black text-xl text-white">
                  {status === "verified"
                    ? "AKTIF"
                    : status === "regional_checked"
                    ? "PROV"
                    : status === "submitted"
                    ? "DAERAH"
                    : status === "revision_requested"
                    ? "REVISI"
                    : "DRAFT"}
                </span>
                <span className="text-[9px] font-mono text-white/40 uppercase mt-0.5">
                  {status === "verified" ? "Lencana Emas" : "Status Berkas"}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/[0.08] w-full text-xs">
              <div className="flex items-center justify-between text-white/60 font-mono">
                <span>Entitas:</span>
                <span className="text-white font-bold uppercase">{entityType}</span>
              </div>
              <div className="flex items-center justify-between text-white/60 font-mono mt-1.5">
                <span>Wilayah:</span>
                <span className="text-white font-bold">{profile.regionName}</span>
              </div>
              <div className="flex items-center justify-between text-white/60 font-mono mt-1.5">
                <span>No. ESPORT ID:</span>
                <span className="text-[#D4AF37] font-bold">{profile.esportId}</span>
              </div>
            </div>
          </div>

          {/* Otoritas PBESI Sumbar Guarantee */}
          <div className="p-5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-heading font-black text-[#D4AF37]">
                Jaminan Pengprov ESI Sumbar
              </span>
            </div>
            <p className="text-[11px] text-white/70 leading-relaxed">
              Verifikasi keabsahan profil digital diterbitkan secara bertahap oleh Pengcab ESI {profile.regionName} dan disahkan tunggal oleh Pengprov ESI Sumatera Barat sesuai regulasi PBESI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
