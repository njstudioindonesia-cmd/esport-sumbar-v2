"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Network,
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Plus,
  Crown,
  Gamepad2,
  ExternalLink,
  Loader2,
  AlertCircle,
  Building2,
  GraduationCap,
  Flame,
  Award,
  X,
  Search,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import {
  requestRelationAction,
  respondRelationAction,
  endRelationAction,
  cancelRelationAction,
} from "@/app/actions/relations";

export function DesktopMembershipsView() {
  const [activeTab, setActiveTab] = useState<"active" | "incoming" | "outgoing" | "history">("active");
  const [profile, setProfile] = useState<any | null>(null);
  const [rules, setRules] = useState<any[]>([]);
  const [activeRelations, setActiveRelations] = useState<any[]>([]);
  const [incomingPending, setIncomingPending] = useState<any[]>([]);
  const [outgoingPending, setOutgoingPending] = useState<any[]>([]);
  const [historyRelations, setHistoryRelations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Modal Hubungkan State
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<any | null>(null);
  const [targetSearchQuery, setTargetSearchQuery] = useState("");
  const [targetCandidates, setTargetCandidates] = useState<any[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<any | null>(null);
  const [relationNotes, setRelationNotes] = useState("");
  const [isSearchingTargets, setIsSearchingTargets] = useState(false);
  const [isSubmittingConnect, setIsSubmittingConnect] = useState(false);

  const showToast = (text: string, isError = false) => {
    setToastMessage({ text, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadEcosystemData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ecosystem");
      if (res.ok) {
        const json = await res.json();
        setProfile(json.profile || null);
        setRules(json.rules || []);
        setActiveRelations(json.active || []);
        setIncomingPending(json.incomingPending || []);
        setOutgoingPending(json.outgoingPending || []);
        setHistoryRelations(json.history || []);

        if (json.rules && json.rules.length > 0 && !selectedRule) {
          setSelectedRule(json.rules[0]);
        }
      }
    } catch (err: any) {
      showToast("Gagal memuat data ekosistem: " + err.message, true);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRule]);

  useEffect(() => {
    loadEcosystemData();
  }, [loadEcosystemData]);

  // Cari target profil ketika rule dipilih atau query diketik
  useEffect(() => {
    if (!isConnectModalOpen || !selectedRule) return;

    const timer = setTimeout(async () => {
      setIsSearchingTargets(true);
      try {
        const gameParam = selectedRule.gameMatchRequired && profile?.main_game_id
          ? `&game_id=${encodeURIComponent(profile.main_game_id)}`
          : "";
        const res = await fetch(
          `/api/ecosystem/targets?type=${encodeURIComponent(selectedRule.targetEntityType)}&q=${encodeURIComponent(targetSearchQuery)}${gameParam}`
        );
        if (res.ok) {
          const json = await res.json();
          // Filter jangan tampilkan diri sendiri
          const candidates = (json.targets || []).filter((t: any) => t.id !== profile?.id);
          setTargetCandidates(candidates);
        }
      } catch (err) {
        console.warn("Failed searching targets:", err);
      } finally {
        setIsSearchingTargets(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [isConnectModalOpen, selectedRule, targetSearchQuery, profile]);

  const handleOpenConnectModal = () => {
    setSelectedTarget(null);
    setTargetSearchQuery("");
    setRelationNotes("");
    if (rules.length > 0) {
      setSelectedRule(rules[0]);
    }
    setIsConnectModalOpen(true);
  };

  const handleSubmitConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTarget || !selectedRule) {
      showToast("Pilih entitas target terlebih dahulu.", true);
      return;
    }

    setIsSubmittingConnect(true);
    try {
      const res = await requestRelationAction({
        targetProfileId: selectedTarget.id,
        relationType: selectedRule.relationType,
        notes: relationNotes,
      });

      if (res.success) {
        showToast(res.message || "Permohonan relasi berhasil dikirim!");
        setIsConnectModalOpen(false);
        loadEcosystemData();
      } else {
        showToast(res.error || "Gagal mengajukan relasi", true);
      }
    } finally {
      setIsSubmittingConnect(false);
    }
  };

  const handleRespond = async (relationId: string, decision: "accept" | "reject") => {
    const res = await respondRelationAction(relationId, decision);
    if (res.success) {
      showToast(res.message || `Permohonan relasi ${decision === "accept" ? "diterima" : "ditolak"}.`);
      loadEcosystemData();
    } else {
      showToast(res.error || "Gagal memproses permohonan", true);
    }
  };

  const handleEndRelation = async (relationId: string, partnerName: string) => {
    if (!confirm(`Apakah Anda yakin ingin mengakhiri relasi resmi dengan "${partnerName}"?`)) {
      return;
    }
    const res = await endRelationAction(relationId);
    if (res.success) {
      showToast(res.message || "Relasi telah resmi diakhiri.");
      loadEcosystemData();
    } else {
      showToast(res.error || "Gagal mengakhiri relasi", true);
    }
  };

  const handleCancelPending = async (relationId: string) => {
    const res = await cancelRelationAction(relationId);
    if (res.success) {
      showToast("Permohonan relasi berhasil dibatalkan.");
      loadEcosystemData();
    } else {
      showToast(res.error || "Gagal membatalkan permohonan", true);
    }
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "player":
        return <Gamepad2 className="w-4 h-4 text-blue-400" />;
      case "team":
        return <Users className="w-4 h-4 text-[#D4AF37]" />;
      case "coach":
        return <Award className="w-4 h-4 text-purple-400" />;
      case "community":
        return <Flame className="w-4 h-4 text-rose-400" />;
      case "venue":
        return <Building2 className="w-4 h-4 text-emerald-400" />;
      case "campus":
        return <GraduationCap className="w-4 h-4 text-amber-400" />;
      case "school":
        return <ShieldCheck className="w-4 h-4 text-sky-400" />;
      default:
        return <Network className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl border text-xs font-mono shadow-2xl animate-in slide-in-from-top-4 ${
            toastMessage.isError
              ? "bg-[#1A1215] border-rose-500/50 text-rose-300"
              : "bg-[#101A15] border-emerald-500/50 text-emerald-300"
          }`}
        >
          {toastMessage.isError ? <XCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* HEADER & ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono uppercase font-bold tracking-wider">
              EKOSISTEM TERHUBUNG V3
            </span>
            <span className="text-white/40 text-xs font-mono">• INTERKONEKSI 7 ENTITAS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            Ekosistem &amp; Keterhubungan Saya
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Kelola hubungan resmi profil Anda dengan Tim, Komunitas, Pelatih, Venue, Kampus, dan Sekolah.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/ecosystem"
            className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-white/80 transition-all flex items-center gap-1.5"
          >
            <Network className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Peta Ekosistem</span>
          </Link>

          <button
            onClick={handleOpenConnectModal}
            disabled={rules.length === 0}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#07080C] font-heading font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Hubungkan Entitas</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-white/40">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
          <span className="text-xs font-mono">Memuat relasi ekosistem Anda...</span>
        </div>
      ) : (
        <>
          {/* TABS NAVIGATION */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-white/[0.08] pb-1">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono flex items-center gap-2 transition-all ${
                activeTab === "active"
                  ? "bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] font-bold"
                  : "text-white/60 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Hubungan Aktif ({activeRelations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("incoming")}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono flex items-center gap-2 transition-all ${
                activeTab === "incoming"
                  ? "bg-blue-500/20 border border-blue-500 text-blue-400 font-bold"
                  : "text-white/60 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Permintaan Masuk ({incomingPending.length})</span>
              {incomingPending.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("outgoing")}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono flex items-center gap-2 transition-all ${
                activeTab === "outgoing"
                  ? "bg-amber-500/20 border border-amber-500 text-amber-400 font-bold"
                  : "text-white/60 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Permintaan Keluar ({outgoingPending.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono flex items-center gap-2 transition-all ${
                activeTab === "history"
                  ? "bg-white/[0.08] border border-white/20 text-white font-bold"
                  : "text-white/60 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <span>Riwayat ({historyRelations.length})</span>
            </button>
          </div>

          {/* TAB CONTENT: 1. HUBUNGAN AKTIF */}
          {activeTab === "active" && (
            <div>
              {activeRelations.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#0B0E17] border border-white/10 flex flex-col items-center gap-3">
                  <Network className="w-10 h-10 text-white/20" />
                  <p className="text-sm font-heading text-white/70">
                    Belum ada hubungan ekosistem yang aktif.
                  </p>
                  <p className="text-xs text-white/40 max-w-md">
                    Hubungkan profil Anda dengan Tim resmi, Komunitas binaan, atau Institusi pendidikan untuk meningkatkan tier rarity ke Contender.
                  </p>
                  <button
                    onClick={handleOpenConnectModal}
                    className="mt-2 px-4 py-2 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-mono font-bold"
                  >
                    + Ajukan Hubungan Pertama
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeRelations.map((rel) => (
                    <div
                      key={rel.id}
                      className="p-5 rounded-2xl bg-[#0B0E17] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold capitalize">
                            {rel.relationType.replace("_", " ")}
                          </span>
                          <span className="text-[10px] font-mono text-white/40">
                            Mulai: {new Date(rel.startedAt || rel.createdAt).toLocaleDateString("id-ID", { month: "short", year: "numeric" })}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                            {rel.otherProfile?.avatarUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={rel.otherProfile.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              getEntityIcon(rel.otherProfile?.entityType)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-heading font-black text-sm text-white truncate">
                              {rel.otherProfile?.displayName}
                            </h3>
                            <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/50">
                              <span className="text-[#D4AF37] uppercase font-bold">{rel.otherProfile?.entityType}</span>
                              <span>•</span>
                              <span>{rel.otherProfile?.esportId}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                        <Link
                          href={`/${rel.otherProfile?.entityType}/${rel.otherProfile?.slug}`}
                          className="text-[11px] font-mono text-white/60 hover:text-white flex items-center gap-1"
                        >
                          <span>Buka Profil</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>

                        <button
                          onClick={() => handleEndRelation(rel.id, rel.otherProfile?.displayName)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-mono transition-all"
                        >
                          Akhiri Hubungan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: 2. PERMINTAAN MASUK */}
          {activeTab === "incoming" && (
            <div>
              {incomingPending.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#0B0E17] border border-white/10 text-white/40 text-xs font-mono">
                  Tidak ada permohonan relasi baru yang masuk.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {incomingPending.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 rounded-2xl bg-[#0B0E17] border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
                          {getEntityIcon(req.otherProfile?.entityType)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading font-black text-sm text-white">
                              {req.otherProfile?.displayName}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold">
                              Mengajukan: &quot;{req.relationType}&quot;
                            </span>
                          </div>
                          <p className="text-xs font-mono text-white/50 mt-0.5">
                            ID: {req.otherProfile?.esportId} • Entitas: {req.otherProfile?.entityType}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 self-end sm:self-auto">
                        <button
                          onClick={() => handleRespond(req.id, "reject")}
                          className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-rose-500/20 text-white/60 hover:text-rose-300 text-xs font-mono transition-all"
                        >
                          Tolak
                        </button>
                        <button
                          onClick={() => handleRespond(req.id, "accept")}
                          className="px-4 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold transition-all"
                        >
                          Setujui
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: 3. PERMINTAAN KELUAR */}
          {activeTab === "outgoing" && (
            <div>
              {outgoingPending.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#0B0E17] border border-white/10 text-white/40 text-xs font-mono">
                  Tidak ada permohonan keluar yang sedang menunggu persetujuan.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {outgoingPending.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 rounded-2xl bg-[#0B0E17] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                          {getEntityIcon(req.otherProfile?.entityType)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading font-black text-sm text-white">
                              {req.otherProfile?.displayName}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                              Menunggu Respons Target
                            </span>
                          </div>
                          <p className="text-xs font-mono text-white/50 mt-0.5">
                            Permohonan: &quot;{req.relationType}&quot; • Kedaluwarsa otomatis 14 hari
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCancelPending(req.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-mono transition-all self-end sm:self-auto"
                      >
                        Batalkan Permohonan
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: 4. RIWAYAT */}
          {activeTab === "history" && (
            <div>
              {historyRelations.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#0B0E17] border border-white/10 text-white/40 text-xs font-mono">
                  Belum ada riwayat relasi yang tercatat.
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {historyRelations.map((h) => (
                    <div
                      key={h.id}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/70"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center shrink-0">
                          {getEntityIcon(h.otherProfile?.entityType)}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{h.otherProfile?.displayName}</span>
                          <span className="text-[10px] text-white/40">
                            Jenis: {h.relationType} • {h.status === "ended" ? "Diakhiri" : h.status === "rejected" ? "Ditolak" : h.status}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] text-white/40">
                        {new Date(h.endedAt || h.createdAt).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ============================================================== */}
      {/* MODAL: HUBUNGKAN ENTITAS (MANDAT 6.1)                           */}
      {/* ============================================================== */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl max-h-[90vh] bg-[#0A0D15] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Network className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    Hubungkan Profil ke Ekosistem
                  </h3>
                  <span className="text-xs font-mono text-white/50">
                    Target hanya yang sah menurut aturan ekosistem
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsConnectModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-white/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitConnect} className="p-6 overflow-y-auto flex-1 flex flex-col gap-4 text-xs font-mono">
              {/* 1. PILIH ATURAN TARGET YANG SAH */}
              <div>
                <label className="text-white/60 mb-1.5 block uppercase text-[10px]">
                  1. Pilih Jenis Hubungan Sah *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {rules.map((rule) => {
                    const isSelected = selectedRule?.id === rule.id;
                    return (
                      <button
                        key={rule.id}
                        type="button"
                        onClick={() => {
                          setSelectedRule(rule);
                          setSelectedTarget(null);
                        }}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          isSelected
                            ? "bg-[#D4AF37]/20 border-[#D4AF37] text-white"
                            : "bg-white/[0.02] border-white/10 text-white/70 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-black text-xs uppercase text-[#D4AF37]">
                            {rule.targetEntityType}
                          </span>
                          <span className="text-[10px] font-mono text-white/40">
                            Maks. {rule.maxActiveLimit}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-white mt-1 capitalize">
                          Relasi: &quot;{rule.relationType.replace("_", " ")}&quot;
                        </span>
                        {rule.gameMatchRequired && (
                          <span className="text-[9px] text-blue-400 mt-1">
                            Wajib Game Sama
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. CARI ENTITAS TARGET */}
              {selectedRule && (
                <div>
                  <label className="text-white/60 mb-1.5 block uppercase text-[10px]">
                    2. Cari {selectedRule.targetEntityType} Terdaftar *
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={`Cari nama ${selectedRule.targetEntityType}...`}
                      value={targetSearchQuery}
                      onChange={(e) => setTargetSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* HASIL PENCARIAN TARGET */}
                  <div className="mt-2 max-h-[160px] overflow-y-auto flex flex-col gap-1.5 border border-white/5 rounded-xl p-1 bg-white/[0.01]">
                    {isSearchingTargets ? (
                      <div className="p-4 text-center text-white/40 flex items-center justify-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                        <span>Mencari entitas valid...</span>
                      </div>
                    ) : targetCandidates.length === 0 ? (
                      <div className="p-4 text-center text-white/40">
                        Tidak ditemukan {selectedRule.targetEntityType} yang cocok.
                      </div>
                    ) : (
                      targetCandidates.map((cand) => {
                        const isChosen = selectedTarget?.id === cand.id;
                        return (
                          <button
                            key={cand.id}
                            type="button"
                            onClick={() => setSelectedTarget(cand)}
                            className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                              isChosen
                                ? "bg-emerald-500/20 border-emerald-500 text-white"
                                : "bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.05]"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                                {getEntityIcon(cand.entityType)}
                              </div>
                              <div>
                                <span className="font-heading font-bold text-xs text-white block">
                                  {cand.display_name}
                                </span>
                                <span className="text-[10px] text-white/40">
                                  ID: {cand.esport_id}
                                </span>
                              </div>
                            </div>

                            {isChosen && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* 3. CATATAN / PESAN */}
              <div>
                <label className="text-white/60 mb-1 block uppercase text-[10px]">
                  3. Pesan / Catatan Pengajuan (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="mis. Mengajukan diri sebagai anggota divisi MLBB tim ini..."
                  value={relationNotes}
                  onChange={(e) => setRelationNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-2">
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white/70 text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingConnect || !selectedTarget || !selectedRule}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#07080C] font-heading font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmittingConnect && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Kirim Permohonan Hubungan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
