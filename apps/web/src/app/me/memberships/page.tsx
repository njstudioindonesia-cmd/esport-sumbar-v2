"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  LogOut,
  Mail,
  UserCheck,
  X,
  PlusCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DesktopUserShell } from "@/components/dashboard/DesktopUserShell";
import { DesktopMembershipsView } from "@/components/dashboard/DesktopMembershipsView";
import { MobileBottomBar } from "@/components/mobile/MobileBottomBar";

export default function MembershipsPage() {
  const [activeTab, setActiveTab] = useState<"invitations" | "requests" | "my_teams" | "history">("invitations");

  // Sample dynamic states
  const [invitations, setInvitations] = useState([
    {
      id: "inv-1",
      teamName: "Minang Pride Esports",
      teamTag: "MPR",
      game: "Mobile Legends: Bang Bang",
      invitedBy: "Andi Saputra (Manajer Tim)",
      roleOffered: "Roamer / Rusher",
      date: "Kemarin, 14:30 WIB",
      status: "pending",
    },
  ]);

  const [myRequests, setMyRequests] = useState([
    {
      id: "req-1",
      teamName: "Ranah Garuda Esports",
      game: "PUBG Mobile",
      requestedRole: "Sniper Cadangan",
      date: "20 Jan 2026",
      status: "pending",
    },
    {
      id: "req-2",
      teamName: "Bukittinggi Esport Club",
      game: "Free Fire",
      requestedRole: "Fragger",
      date: "10 Jan 2026",
      status: "accepted",
    },
  ]);

  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAcceptInvite = (id: string) => {
    setInvitations((prev) => prev.filter((i) => i.id !== id));
    showToast("Berhasil bergabung dengan tim.");
  };

  const handleDeclineInvite = (id: string) => {
    setInvitations((prev) => prev.filter((i) => i.id !== id));
    showToast("Undangan tim telah ditolak.");
  };

  return (
    <main className="min-h-screen w-full bg-[#07080C]">
      {/* ========================================================= */}
      {/* DESKTOP VIEW (>= 1024px): BENTO ROSTER & SLIM SIDEBAR     */}
      {/* ========================================================= */}
      <div className="hidden lg:block w-full min-h-screen">
        <DesktopUserShell breadcrumb="Tim & Roster">
          <DesktopMembershipsView />
        </DesktopUserShell>
      </div>

      {/* ========================================================= */}
      {/* MOBILE VIEW (< 1024px): PWA MEMBERSHIP CONTAINER          */}
      {/* ========================================================= */}
      <div className="block lg:hidden min-h-[100dvh] w-full text-white pb-28">
        <header className="sticky top-0 z-30 px-4 pt-3 pb-3 bg-[#07080C]/90 backdrop-blur-2xl border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="w-10 h-10 rounded-full bg-[#161A24] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white"
              aria-label="Kembali ke Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-sm font-heading font-black text-white uppercase tracking-wider">
                Tim &amp; Roster
              </h1>
              <span className="text-[10px] font-mono text-[#D4AF37]">
                Relasi Keanggotaan
              </span>
            </div>
          </div>

          <Link
            href="/teams"
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-white/70 hover:text-white"
          >
            Cari Tim
          </Link>
        </header>

        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="fixed top-20 right-4 left-4 z-50 bg-[#161A24] border border-[#D4AF37] px-4 py-3 rounded-xl shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <span className="text-xs text-white font-medium">{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="max-w-md mx-auto px-4 pt-5 pb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-heading font-black text-white uppercase tracking-tight">
                Afiliasi Tim Anda
              </h2>
              <p className="text-[11px] text-white/50 mt-0.5">
                Kelola status klub terdaftar dan riwayat transfer atlet.
              </p>
            </div>
          </div>

          {/* TAB SELECTION */}
          <div className="flex rounded-xl bg-[#161A24] p-1 border border-white/[0.08] mb-6">
            {[
              { id: "invitations", label: "Undangan", count: invitations.length },
              { id: "requests", label: "Permintaan", count: myRequests.length },
              { id: "my_teams", label: "Tim Saya", count: 1 },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 text-xs font-heading font-bold rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-[#D4AF37] text-[#07080C]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {tab.label} {tab.count > 0 && `(${tab.count})`}
              </button>
            ))}
          </div>

          {/* TAB CONTENTS */}
          {activeTab === "invitations" && (
            <div className="flex flex-col gap-3">
              {invitations.length > 0 ? (
                invitations.map((inv) => (
                  <div key={inv.id} className="p-4 rounded-2xl bg-[#0F1118] border border-white/[0.08]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-heading font-black text-white">{inv.teamName}</span>
                      <span className="text-[10px] font-mono text-[#D4AF37]">{inv.teamTag}</span>
                    </div>
                    <p className="text-xs text-white/60 mt-1">Role: {inv.roleOffered}</p>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/[0.06]">
                      <button
                        onClick={() => handleAcceptInvite(inv.id)}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold"
                      >
                        Terima
                      </button>
                      <button
                        onClick={() => handleDeclineInvite(inv.id)}
                        className="flex-1 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold"
                      >
                        Tolak
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-xs text-white/40">Tidak ada undangan.</div>
              )}
            </div>
          )}

          {activeTab === "requests" && (
            <div className="flex flex-col gap-3">
              {myRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-2xl bg-[#0F1118] border border-white/[0.08]">
                  <span className="text-xs font-heading font-black text-white">{req.teamName}</span>
                  <p className="text-xs text-white/60 mt-1">Role: {req.requestedRole}</p>
                  <span className="text-[10px] font-mono text-amber-400 mt-2 block">{req.status}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "my_teams" && (
            <div className="p-5 rounded-2xl bg-[#0F1118] border border-white/[0.08]">
              <h3 className="text-sm font-heading font-black text-white">Minang Pride Esports</h3>
              <p className="text-xs text-white/50 mt-1">Mobile Legends: Bang Bang</p>
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/40">Status: Roster Aktif</span>
                <button
                  onClick={() => setLeaveModalOpen(true)}
                  className="text-xs font-mono text-red-400 hover:underline"
                >
                  Keluar Tim
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Persistent Bottom Bar */}
        <MobileBottomBar />
      </div>
    </main>
  );
}
