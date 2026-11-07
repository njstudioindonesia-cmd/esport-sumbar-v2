"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Share2,
  Trash2,
  Check,
  Sparkles,
  Inbox,
  Filter,
} from "lucide-react";
import { UserShell } from "@/components/dashboard/DesktopUserShell";
import { GlassSurface } from "@/components/glass/GlassSurface";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "verification" | "ecosystem" | "system";
  read: boolean;
  createdAt: string;
}

export default function MyNotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "verification" | "ecosystem">("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "Verifikasi Berkas Disetujui",
      message: "Lencana verifikasi Anda telah aktif dan disematkan pada Paspor Digital Anda.",
      type: "verification",
      read: false,
      createdAt: "10 menit yang lalu",
    },
    {
      id: "notif-2",
      title: "Undangan Kemitraan Ekosistem Baru",
      message: "Minang Pride Esports mengundang Anda untuk bergabung ke dalam divisi MLBB.",
      type: "ecosystem",
      read: false,
      createdAt: "2 jam yang lalu",
    },
    {
      id: "notif-3",
      title: "Pembaruan Platform V3",
      message: "Fitur keterhubungan ekosistem 7 entitas kini tersedia secara penuh.",
      type: "system",
      read: true,
      createdAt: "Kemarin",
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((item) => {
    if (filter === "unread") return !item.read;
    if (filter === "verification") return item.type === "verification";
    if (filter === "ecosystem") return item.type === "ecosystem";
    return true;
  });

  return (
    <main className="min-h-screen w-full bg-[#07080C] text-white">
      <UserShell breadcrumb="Notifikasi">
        <div className="max-w-4xl mx-auto py-4 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-heading font-black text-white uppercase tracking-tight flex items-center gap-2.5">
                <Bell className="w-6 h-6 text-[#D4AF37]" />
                <span>Pusat Notifikasi</span>
              </h1>
              <p className="text-xs text-white/50 mt-1">
                Pemberitahuan terpusat kurasi verifikasi, undangan ekosistem, dan keamanan akun Anda.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <GlassButton
                variant="secondary"
                size="sm"
                onClick={markAllRead}
                className="flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tandai Semua Dibaca</span>
              </GlassButton>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/[0.03] border border-white/10 overflow-x-auto text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl font-heading font-bold transition-all ${
                filter === "all" ? "bg-[#D4AF37] text-black" : "text-white/60 hover:text-white"
              }`}
            >
              Semua ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3.5 py-1.5 rounded-xl font-heading font-bold transition-all ${
                filter === "unread" ? "bg-[#D4AF37] text-black" : "text-white/60 hover:text-white"
              }`}
            >
              Belum Dibaca ({notifications.filter((n) => !n.read).length})
            </button>
            <button
              onClick={() => setFilter("verification")}
              className={`px-3.5 py-1.5 rounded-xl font-heading font-bold transition-all ${
                filter === "verification" ? "bg-[#D4AF37] text-black" : "text-white/60 hover:text-white"
              }`}
            >
              Verifikasi
            </button>
            <button
              onClick={() => setFilter("ecosystem")}
              className={`px-3.5 py-1.5 rounded-xl font-heading font-bold transition-all ${
                filter === "ecosystem" ? "bg-[#D4AF37] text-black" : "text-white/60 hover:text-white"
              }`}
            >
              Ekosistem
            </button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <GlassCard
                variant="thin"
                elevation="flat"
                radius="3xl"
                className="p-12 text-center flex flex-col items-center justify-center gap-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                  <Inbox className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-heading font-bold text-white uppercase">
                  Tidak Ada Notifikasi
                </h3>
                <p className="text-xs text-white/50 max-w-sm">
                  Seluruh notifikasi telah Anda tangani atau belum ada aktivitas baru.
                </p>
              </GlassCard>
            ) : (
              filteredNotifications.map((item) => (
                <GlassCard
                  key={item.id}
                  variant={item.read ? "thin" : "thick"}
                  elevation={item.read ? "flat" : "raised"}
                  radius="2xl"
                  className={`p-4 transition-all flex items-start justify-between gap-4 ${
                    !item.read ? "border-[#D4AF37]/40 shadow-lg shadow-[#D4AF37]/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${
                        item.type === "verification"
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : item.type === "ecosystem"
                          ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
                          : "bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30"
                      }`}
                    >
                      {item.type === "verification" ? (
                        <ShieldCheck className="w-5 h-5" />
                      ) : item.type === "ecosystem" ? (
                        <Share2 className="w-5 h-5" />
                      ) : (
                        <Bell className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-heading font-bold text-white">
                          {item.title}
                        </h3>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-white/70 mt-1 leading-relaxed">
                        {item.message}
                      </p>
                      <span className="text-[10px] text-white/40 mt-2 block font-mono">
                        {item.createdAt}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteNotification(item.id)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors"
                    title="Hapus notifikasi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </GlassCard>
              ))
            )}
          </div>
        </div>
      </UserShell>
    </main>
  );
}
