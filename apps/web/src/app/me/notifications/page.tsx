"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Share2,
  ArrowLeft,
  Trash2,
  Check,
} from "lucide-react";
import { DesktopUserShell } from "@/components/dashboard/DesktopUserShell";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "verification" | "ecosystem" | "system";
  read: boolean;
  createdAt: string;
}

export default function MyNotificationsPage() {
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

  return (
    <main className="min-h-screen w-full bg-[#07080C] text-white">
      <DesktopUserShell breadcrumb="Notifikasi">
        <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
                <Bell className="w-6 h-6 text-pink-500" /> Notifikasi
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Pembaruan seputar verifikasi, permohonan kemitraan, dan keamanan akun.
              </p>
            </div>
            <button
              onClick={markAllRead}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Tandai Semua Dibaca
            </button>
          </div>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/50 rounded-2xl border border-white/10 text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                <p className="text-sm font-medium text-white">Belum ada notifikasi.</p>
                <p className="text-xs text-slate-500 mt-1">Anda akan menerima pembaruan di sini.</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                    item.read
                      ? "bg-slate-900/40 border-white/5 text-slate-300"
                      : "bg-slate-900/80 border-pink-500/30 text-white shadow-lg shadow-pink-500/5"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        item.type === "verification"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : item.type === "ecosystem"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-pink-500/10 text-pink-400"
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
                        <h3 className="text-sm font-bold text-white">{item.title}</h3>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {item.message}
                      </p>
                      <span className="text-[10px] text-slate-500 mt-2 block font-mono">
                        {item.createdAt}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteNotification(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </DesktopUserShell>
    </main>
  );
}
