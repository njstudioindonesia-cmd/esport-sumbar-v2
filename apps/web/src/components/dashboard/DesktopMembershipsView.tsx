"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
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
  UserCheck,
} from "lucide-react";

export function DesktopMembershipsView() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [activeMemberships, setActiveMemberships] = useState<any[]>([]);
  const [roster, setRoster] = useState<any[]>([]);
  const [teamProfile, setTeamProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Ambil profil pengguna
      const profRes = await fetch("/api/me/profiles");
      let currentTeam: any = null;
      if (profRes.ok) {
        const profJson = await profRes.json();
        const profiles = profJson.profiles || [];
        currentTeam = profiles.find((p: any) => p.entityType === "team") || null;
        setTeamProfile(currentTeam);
      }

      // 2. Ambil data memberships pengguna
      const memRes = await fetch("/api/me/memberships");
      if (memRes.ok) {
        const memJson = await memRes.json();
        setInvitations(memJson.invitations || []);
        setRequests(memJson.requests || []);
        setActiveMemberships(memJson.memberships || []);
      }

      // 3. Jika pengguna memiliki tim, ambil roster tim tersebut
      if (currentTeam?.id) {
        const rosRes = await fetch(`/api/me/memberships?team_id=${currentTeam.id}`);
        if (rosRes.ok) {
          const rosJson = await rosRes.json();
          setRoster(rosJson.roster || []);
        }
      }
    } catch (err) {
      console.warn("Failed to load memberships:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAcceptInvite = async (id: string) => {
    try {
      const res = await fetch("/api/me/memberships", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipId: id, action: "accept" }),
      });
      if (res.ok) {
        showToast("Undangan tim berhasil diterima! Anda telah bergabung.");
        loadData();
      }
    } catch {
      showToast("Gagal menerima undangan.");
    }
  };

  const handleDeclineInvite = async (id: string) => {
    try {
      const res = await fetch("/api/me/memberships", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipId: id, action: "decline" }),
      });
      if (res.ok) {
        showToast("Undangan tim telah ditolak.");
        setInvitations((prev) => prev.filter((i) => i.id !== id));
      }
    } catch {
      showToast("Gagal menolak undangan.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#1A1E28] border border-[#22C55E] text-white text-xs font-heading font-medium shadow-2xl animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-black text-white tracking-tight">
          Keanggotaan Tim &amp; Roster
        </h1>
        <p className="text-xs text-white/50 mt-1">
          Kelola tim resmi, daftar roster atlet, dan undangan transfer pemain antar klub ESPORT SUMBAR.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
          <span className="text-xs font-mono text-white/50">Memuat data tim &amp; keanggotaan...</span>
        </div>
      ) : (
        <>
          {/* ========================================================= */}
          {/* JIKA MEMILIKI PROFIL TIM: TAMPILKAN ROSTER TIM            */}
          {/* ========================================================= */}
          {teamProfile ? (
            <div className="p-8 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Users className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-black text-lg text-white">
                        {teamProfile.displayName}
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[10px] font-mono text-[#D4AF37] font-bold">
                        {teamProfile.esportId}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 mt-0.5">
                      Divisi: {teamProfile.mainGameName} • Homebase: {teamProfile.regionName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-white">Kuota Roster</div>
                    <div className="text-[10px] font-mono text-emerald-400">
                      {roster.length}/7 Anggota Aktif
                    </div>
                  </div>
                  <Link
                    href={`/me/team/${teamProfile.id}/roster`}
                    className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-xs font-heading font-black uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Kelola Roster</span>
                  </Link>
                </div>
              </div>

              {/* Anggota Roster Tim */}
              {roster.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mt-8">
                  {roster.map((member) => (
                    <div
                      key={member.id}
                      className="p-4 rounded-2xl bg-[#161A24] border border-white/[0.06] hover:border-[#D4AF37]/40 flex flex-col items-center text-center transition-all group"
                    >
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-[#D4AF37] transition-colors mb-3 bg-[#0F1118] flex items-center justify-center">
                        {member.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-heading font-black text-xl text-[#D4AF37]">
                            {member.name.charAt(0)}
                          </span>
                        )}
                        {member.role === "Kapten" && (
                          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#D4AF37] text-[#07080C] flex items-center justify-center shadow-md">
                            <Crown className="w-3 h-3 fill-current" />
                          </div>
                        )}
                      </div>

                      <div className="text-xs font-heading font-black text-white truncate max-w-[120px]">
                        {member.name}
                      </div>
                      <div className="text-[10px] font-mono text-[#D4AF37] font-semibold">
                        @{member.ign}
                      </div>

                      <span className="mt-2 px-2.5 py-0.5 rounded-full bg-white/[0.06] text-[9px] font-mono text-white/70 uppercase">
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center flex flex-col items-center gap-2 text-white/40">
                  <Users className="w-8 h-8 text-white/20 mb-1" />
                  <span className="text-xs font-mono">Belum ada anggota pemain tambahan dalam roster tim.</span>
                  <Link
                    href={`/me/team/${teamProfile.id}/roster`}
                    className="text-xs text-[#D4AF37] hover:underline mt-1 font-semibold"
                  >
                    Undang pemain sekarang via tautan atau QR &rarr;
                  </Link>
                </div>
              )}
            </div>
          ) : (
            /* JIKA HANYA MEMILIKI PROFIL ATLET: TAMPILKAN STATUS KLUB ATLET */
            <div className="p-8 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-6 h-6 text-[#D4AF37]" />
                  <div>
                    <h3 className="font-heading font-black text-base text-white">
                      Status Tim Resmi Anda
                    </h3>
                    <p className="text-xs text-white/50">
                      Klub esport tempat Anda terdaftar sebagai atlet binaan ESPORT SUMBAR.
                    </p>
                  </div>
                </div>

                <Link
                  href="/gallery?type=team"
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-mono text-white flex items-center gap-1.5 transition-all"
                >
                  <span>Jelajah Tim ESPORT SUMBAR</span>
                  <ExternalLink className="w-3 h-3 text-white/50" />
                </Link>
              </div>

              {activeMemberships.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {activeMemberships.map((m) => (
                    <div
                      key={m.id}
                      className="p-5 rounded-2xl bg-[#161A24] border border-white/[0.06] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-heading font-bold text-lg">
                          {m.teamName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-heading font-black text-white">
                            {m.teamName}
                          </div>
                          <div className="text-[11px] text-white/50">
                            Peran: <strong className="text-[#D4AF37]">{m.role}</strong> • {m.game}
                          </div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold">
                        Aktif
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center flex flex-col items-center gap-2 text-white/40">
                  <Users className="w-8 h-8 text-white/20 mb-1" />
                  <span className="text-xs font-mono">Anda saat ini berstatus Free Agent (belum terikat tim resmi).</span>
                  <span className="text-[11px] text-white/30">
                    Undangan masuk dari tim atau konfirmasi transfer pemain akan muncul di bawah ini.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* KOLOM KEMBAR: UNDANGAN MASUK TIM & PERMINTAAN SAYA       */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* KOLOM 1: UNDANGAN MASUK TIM */}
            <div className="p-6 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-heading font-black text-sm text-white uppercase tracking-wider">
                    Undangan Masuk Tim
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-[10px] font-mono text-white/60">
                  {invitations.length} Menunggu
                </span>
              </div>

              {invitations.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {invitations.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-4 rounded-2xl bg-[#161A24] border border-white/[0.06] flex items-center justify-between"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-heading font-bold text-white">
                            {inv.teamName}
                          </span>
                          <span className="text-[9px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-1.5 py-0.2 rounded">
                            {inv.esportId}
                          </span>
                        </div>
                        <span className="text-[11px] text-white/60 mt-0.5">
                          Role ditawarkan: <strong className="text-white">{inv.role}</strong>
                        </span>
                        <span className="text-[9px] font-mono text-white/40 mt-1">
                          {inv.game} • {inv.regionName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleAcceptInvite(inv.id)}
                          className="w-8 h-8 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center transition-all"
                          title="Terima Undangan"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeclineInvite(inv.id)}
                          className="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center transition-all"
                          title="Tolak Undangan"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-xs font-mono text-white/30">
                  Tidak ada undangan tim aktif saat ini.
                </div>
              )}
            </div>

            {/* KOLOM 2: PERMINTAAN BERGABUNG */}
            <div className="p-6 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#4C7DFF]" />
                  <h3 className="font-heading font-black text-sm text-white uppercase tracking-wider">
                    Permintaan Bergabung
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-[10px] font-mono text-white/60">
                  {requests.length} Dikirim
                </span>
              </div>

              {requests.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {requests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl bg-[#161A24] border border-white/[0.06] flex items-center justify-between"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-heading font-bold text-white">
                            {req.teamName}
                          </span>
                          <span className="text-[9px] font-mono text-white/40">
                            {req.esportId}
                          </span>
                        </div>
                        <span className="text-[11px] text-white/60 mt-0.5">
                          Peran: {req.role} • {req.game}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 text-[10px] font-mono">
                        Menunggu
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-xs font-mono text-white/30">
                  Belum ada permohonan bergabung yang Anda kirimkan.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
