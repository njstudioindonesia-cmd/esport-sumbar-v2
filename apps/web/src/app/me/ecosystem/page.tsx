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
  Share2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DesktopUserShell } from "@/components/dashboard/DesktopUserShell";
import { DesktopMembershipsView } from "@/components/dashboard/DesktopMembershipsView";
import { MobileBottomBar } from "@/components/mobile/MobileBottomBar";

export default function MyEcosystemPage() {
  const [activeTab, setActiveTab] = useState<"invitations" | "requests" | "my_teams" | "history">("invitations");

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

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAcceptInvite = (id: string) => {
    setInvitations((prev) => prev.filter((i) => i.id !== id));
    showToast("Berhasil bergabung ke ekosistem mitra.");
  };

  const handleDeclineInvite = (id: string) => {
    setInvitations((prev) => prev.filter((i) => i.id !== id));
    showToast("Undangan kemitraan ditolak.");
  };

  return (
    <main className="min-h-screen w-full bg-[#07080C]">
      {/* DESKTOP VIEW (>= 1024px): BENTO ROSTER & SLIM SIDEBAR */}
      <div className="hidden lg:block w-full min-h-screen">
        <DesktopUserShell breadcrumb="Ekosistem Saya">
          <DesktopMembershipsView />
        </DesktopUserShell>
      </div>

      {/* MOBILE VIEW (< 1024px): PWA ECOSYSTEM CONTAINER */}
      <div className="block lg:hidden min-h-[100dvh] w-full text-white pb-28">
        <header className="sticky top-0 z-30 px-4 pt-3 pb-3 bg-[#07080C]/90 backdrop-blur-2xl border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/me"
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-pink-500" />
                Ekosistem Saya
              </h1>
              <p className="text-[11px] text-slate-400">Kemitraan & Relasi 7 Entitas</p>
            </div>
          </div>
        </header>

        {toastMessage && (
          <div className="m-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
            {toastMessage}
          </div>
        )}

        <div className="p-4 space-y-4">
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab("invitations")}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "invitations" ? "bg-pink-600 text-white" : "text-slate-400"
              }`}
            >
              Undangan ({invitations.length})
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "requests" ? "bg-pink-600 text-white" : "text-slate-400"
              }`}
            >
              Permintaan ({myRequests.length})
            </button>
          </div>

          {activeTab === "invitations" && (
            <div className="space-y-3">
              {invitations.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Tidak ada undangan masuk saat ini.
                </div>
              ) : (
                invitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-white">{inv.teamName}</h3>
                      <p className="text-xs text-slate-400">{inv.game} · {inv.roleOffered}</p>
                      <p className="text-[10px] text-slate-500 mt-1">Oleh: {inv.invitedBy}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => handleAcceptInvite(inv.id)}
                        className="flex-1 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-medium"
                      >
                        Terima
                      </button>
                      <button
                        onClick={() => handleDeclineInvite(inv.id)}
                        className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                      >
                        Tolak
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "requests" && (
            <div className="space-y-3">
              {myRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-sm font-bold text-white">{req.teamName}</h3>
                    <p className="text-xs text-slate-400">{req.game} · {req.requestedRole}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${
                      req.status === "accepted"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {req.status === "accepted" ? "Diterima" : "Menunggu"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <MobileBottomBar />
      </div>
    </main>
  );
}
