"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  ArrowLeft,
  Shield,
  Mail,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ExternalLink,
  Clock,
} from "lucide-react";
import { AdminNavbar } from "@/components/AdminNavbar";
import { Footer, QuietSurface, StatusBadge } from "@esport-sumbar/ui";
import { getAdminUserDetailAction } from "@/app/actions/users";

interface UserDetail {
  id: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  createdAt: string;
  profile?: {
    id: string;
    displayName: string;
    entityType: string;
    ign: string;
    esportId: string;
    verificationStatus: string;
    slug: string;
  } | null;
}

export function AdminUserDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      setIsLoading(true);
      try {
        const res = await getAdminUserDetailAction(id);
        if (res.success && res.user) {
          setUser(res.user as any);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.warn("Gagal memuat detail akun:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadUser();
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-[#05051A] text-white flex">
      <AdminNavbar />

      <main className="flex-1 p-6 md:p-10 flex flex-col gap-6 overflow-y-auto">
        <div className="mb-2 flex items-center justify-between border-b border-white/[0.08] pb-4">
          <Link
            href="/users"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Direktori Pengguna
          </Link>
          <span className="text-xs px-2.5 py-1 rounded bg-[#0C0C26] text-white/70 font-mono border border-white/[0.08]">
            ID: {id}
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <Clock className="w-8 h-8 animate-spin mx-auto mb-3 text-pink-500" />
            <p>Memuat profil pengguna...</p>
          </div>
        ) : !user ? (
          <div className="p-8 bg-slate-900/50 rounded-2xl border border-white/10 text-center text-slate-400">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-amber-400" />
            <p>Data akun tidak ditemukan.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Account Info */}
            <QuietSurface radius="2xl" elevation="raised" className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-pink-600/20">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">{user.email}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        Peran: {user.role === "platform_admin" || user.role === "admin" ? "Admin" : "Pengguna"}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium ${
                          user.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {user.status === "active" ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
                <div>
                  <span className="text-slate-500 block mb-1">Tanggal Terdaftar</span>
                  <span className="text-slate-300">
                    {new Date(user.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Satu Akun Satu Bidang</span>
                  <span className="text-emerald-400 font-medium">Terkonfirmasi (V3)</span>
                </div>
              </div>
            </QuietSurface>

            {/* Profile Info */}
            <QuietSurface radius="2xl" elevation="raised" className="p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-pink-400" /> Profil Terhubung
              </h2>

              {user.profile ? (
                <div className="p-4 rounded-xl bg-slate-800/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{user.profile.displayName}</h3>
                      <span className="text-xs text-pink-400 font-mono">({user.profile.ign})</span>
                      <StatusBadge
                        status={
                          user.profile.verificationStatus === "verified"
                            ? "verified"
                            : user.profile.verificationStatus === "suspended"
                            ? "suspended"
                            : "under_review"
                        }
                        size="sm"
                      />
                    </div>
                    <p className="text-xs font-mono text-slate-400">{user.profile.esportId}</p>
                    <p className="text-xs text-slate-400 capitalize">Entitas: {user.profile.entityType}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {(() => {
                      const entity = user.profile.entityType || "player";
                      const path = `/${entity}/${user.profile.slug}`;
                      const webUrl =
                        typeof window !== "undefined" &&
                        (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
                          ? `http://localhost:3000${path}`
                          : `${(process.env.NEXT_PUBLIC_SITE_URL || "https://esport-sumbar-v2.vercel.app").replace(/\/$/, "")}${path}`;

                      return (
                        <a
                          href={webUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-200 flex items-center gap-1.5 transition-colors border border-white/5 hover:border-white/10"
                        >
                          Buka Profil Publik <ExternalLink className="w-3.5 h-3.5 text-pink-400" />
                        </a>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400 bg-slate-800/20 rounded-xl border border-white/5">
                  <p className="text-sm">Pengguna belum menyelesaikan onboarding atau belum membuat kartu profil.</p>
                </div>
              )}
            </QuietSurface>
          </div>
        )}
      </main>
    </div>
  );
}
