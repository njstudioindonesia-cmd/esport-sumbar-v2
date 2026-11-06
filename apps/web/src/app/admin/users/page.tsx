"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users2,
  Search,
  Filter,
  ShieldAlert,
  UserCheck,
  UserX,
  AlertTriangle,
  Lock,
  Mail,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Footer } from "@/components/layout/Footer";

interface AccountItem {
  id: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  createdAt: string;
  profile?: {
    id: string;
    displayName: string;
    entityType: string;
    esportId: string;
    verificationStatus: string;
  } | null;
}

export default function AdminUsersPage() {
  const [accounts, setAccounts] = useState<AccountItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const loadAccounts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/accounts");
      if (res.ok) {
        const json = await res.json();
        setAccounts(json.accounts || []);
      }
    } catch (err) {
      console.warn("Failed to load accounts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const filteredAccounts = accounts.filter((acc) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      acc.email.toLowerCase().includes(q) ||
      (acc.profile?.displayName && acc.profile.displayName.toLowerCase().includes(q)) ||
      (acc.profile?.esportId && acc.profile.esportId.toLowerCase().includes(q));

    const matchesRole = roleFilter === "all" || acc.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white flex flex-col font-sans selection:bg-[#FF1752]/30 selection:text-white">
      <AdminNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF1752]/20 border border-[#FF1752]/40 text-[#FF4D77] text-[10px] font-mono uppercase font-bold tracking-wider">
                AKUN & PROFIL V3
              </span>
              <span className="text-white/40 text-xs font-mono">• 1 Akun 1 Profil</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight mt-1">
              Manajemen Pengguna Platform
            </h1>
            <p className="text-xs sm:text-sm text-white/60">
              Daftar akun terdaftar, status aktivasi, dan pengawasan profil entitas terikat.
            </p>
          </div>

          <button
            onClick={() => loadAccounts()}
            className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-white/80 transition-all"
          >
            Segarkan
          </button>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="p-4 rounded-2xl bg-[#0B0E17] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari email atau nama pengguna..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FF1752]/60"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Filter Peran Akun"
              className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white/80 focus:outline-none"
            >
              <option value="all">Semua Peran</option>
              <option value="user">User Biasa</option>
              <option value="platform_admin">Platform Admin</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="rounded-2xl bg-[#0B0E17] border border-white/10 overflow-hidden shadow-xl">
          {isLoading ? (
            <div className="p-12 text-center text-white/50 text-xs font-mono animate-pulse">
              Memuat data pengguna...
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="p-12 text-center text-white/40 text-xs">
              Tidak ada akun yang sesuai dengan kriteria pencarian.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-white/40 font-mono uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4">Pengguna</th>
                    <th className="py-3.5 px-4">Peran (Role)</th>
                    <th className="py-3.5 px-4">Profil Terikat (1 Akun 1 Profil)</th>
                    <th className="py-3.5 px-4">Status Akun</th>
                    <th className="py-3.5 px-4">Tanggal Daftar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filteredAccounts.map((acc) => (
                    <tr key={acc.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-heading font-bold text-white text-sm">
                            {acc.email}
                          </span>
                          <span className="text-[10px] font-mono text-white/40">
                            ID: {acc.id.substring(0, 8)}...
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                            acc.role === "platform_admin"
                              ? "bg-[#FF1752]/20 text-[#FF4D77] border border-[#FF1752]/40"
                              : "bg-white/10 text-white/70"
                          }`}
                        >
                          {acc.role}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {acc.profile ? (
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-white">
                              {acc.profile.displayName}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-white/10 text-white/60">
                              {acc.profile.entityType}
                            </span>
                            <span className="text-[10px] font-mono text-[#D4AF37]">
                              {acc.profile.esportId}
                            </span>
                          </div>
                        ) : acc.role === "platform_admin" ? (
                          <span className="text-white/30 text-xs italic">
                            Admin (Dilarang Memiliki Profil Entitas)
                          </span>
                        ) : (
                          <span className="text-white/40 text-xs">Belum Membuat Profil</span>
                        )}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                            acc.status === "active"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-rose-500/20 text-rose-400"
                          }`}
                        >
                          {acc.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-white/50 font-mono">
                        {acc.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
