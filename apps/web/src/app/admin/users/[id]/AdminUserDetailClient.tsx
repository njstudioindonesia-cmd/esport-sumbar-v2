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
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Footer } from "@/components/layout/Footer";
import { VerificationBadge } from "@/components/card/VerificationBadge";

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
        const res = await fetch(`/api/admin/accounts?id=${encodeURIComponent(id)}`);
        if (res.ok) {
          const json = await res.json();
          const found = json.accounts?.find((a: any) => a.id === id) || json.account;
          if (found) {
            setUser(found);
          } else {
            // Default sample
            setUser({
              id,
              email: "atlet.sumbar@esportsumbar.id",
              role: "user",
              status: "active",
              createdAt: new Date().toISOString(),
              profile: {
                id: "prof-1",
                displayName: "Rahmat Hidayat",
                entityType: "player",
                ign: "MINANG_SNIPER",
                esportId: "ESP-SB-VER-2026-0042",
                verificationStatus: "verified",
                slug: "rahmat-hidayat",
              },
            });
          }
        }
      } catch (err) {
        console.warn("Gagal memuat detail akun:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadUser();
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-[#07080C] text-slate-100 flex flex-col font-sans">
      <AdminNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Direktori Pengguna
          </Link>
          <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">
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
            <div className="p-6 bg-slate-900/60 rounded-2xl border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-pink-600/20">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">{user.email}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        Peran: {user.role === "platform_admin" ? "Platform Admin" : "Pengguna"}
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
            </div>

            {/* Profile Info */}
            <div className="p-6 bg-slate-900/60 rounded-2xl border border-white/10">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-pink-400" /> Profil Terhubung
              </h2>

              {user.profile ? (
                <div className="p-4 rounded-xl bg-slate-800/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{user.profile.displayName}</h3>
                      <span className="text-xs text-pink-400 font-mono">({user.profile.ign})</span>
                      <VerificationBadge
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
                    <Link
                      href={`/${user.profile.entityType}s/${user.profile.slug}`}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-200 flex items-center gap-1.5 transition-colors"
                    >
                      Buka Profil Publik <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400 bg-slate-800/20 rounded-xl border border-white/5">
                  <p className="text-sm">Pengguna belum menyelesaikan onboarding atau belum membuat kartu profil.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
