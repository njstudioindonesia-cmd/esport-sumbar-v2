"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Share2,
  Shield,
  Layers,
  ArrowRight,
  Filter,
  CheckCircle2,
  XCircle,
  Sparkles,
  Gamepad2,
  Info,
} from "lucide-react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Footer } from "@/components/layout/Footer";
import { QuietSurface } from "@/components/glass/QuietSurface";
import { OFFICIAL_RELATION_RULES, type DeclaredRule } from "@/data/relationRules";

export default function AdminRelationRulesPage() {
  const [selectedEntity, setSelectedEntity] = useState<string>("all");

  const rules: DeclaredRule[] = OFFICIAL_RELATION_RULES || [
    { sourceEntityType: "player", targetEntityType: "team", relationType: "anggota", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: true },
    { sourceEntityType: "player", targetEntityType: "community", relationType: "anggota", requiresApproval: true, maxActiveLimit: 5, gameMatchRequired: false },
    { sourceEntityType: "player", targetEntityType: "school", relationType: "siswa", requiresApproval: true, maxActiveLimit: 1, gameMatchRequired: false },
    { sourceEntityType: "player", targetEntityType: "campus", relationType: "mahasiswa", requiresApproval: true, maxActiveLimit: 1, gameMatchRequired: false },
    { sourceEntityType: "coach", targetEntityType: "team", relationType: "pelatih", requiresApproval: true, maxActiveLimit: 5, gameMatchRequired: true },
    { sourceEntityType: "coach", targetEntityType: "school", relationType: "pembina", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: false },
    { sourceEntityType: "coach", targetEntityType: "campus", relationType: "pembina", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: false },
    { sourceEntityType: "coach", targetEntityType: "community", relationType: "penasihat", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: false },
    { sourceEntityType: "team", targetEntityType: "community", relationType: "naungan", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: false },
    { sourceEntityType: "team", targetEntityType: "school", relationType: "mewakili", requiresApproval: true, maxActiveLimit: 1, gameMatchRequired: false },
    { sourceEntityType: "team", targetEntityType: "campus", relationType: "mewakili", requiresApproval: true, maxActiveLimit: 1, gameMatchRequired: false },
    { sourceEntityType: "team", targetEntityType: "venue", relationType: "basecamp", requiresApproval: true, maxActiveLimit: 1, gameMatchRequired: false },
    { sourceEntityType: "community", targetEntityType: "venue", relationType: "markas", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: false },
    { sourceEntityType: "community", targetEntityType: "school", relationType: "kerja_sama", requiresApproval: true, maxActiveLimit: 5, gameMatchRequired: false },
    { sourceEntityType: "community", targetEntityType: "campus", relationType: "kerja_sama", requiresApproval: true, maxActiveLimit: 5, gameMatchRequired: false },
    { sourceEntityType: "school", targetEntityType: "venue", relationType: "tempat_latihan", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: false },
    { sourceEntityType: "campus", targetEntityType: "venue", relationType: "tempat_latihan", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: false },
  ];

  const filteredRules = rules.filter((rule) => {
    if (selectedEntity === "all") return true;
    return rule.sourceEntityType === selectedEntity || rule.targetEntityType === selectedEntity;
  });

  return (
    <div className="min-h-screen bg-[#07080C] text-slate-100 flex flex-col font-sans">
      <AdminNavbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <Share2 className="w-6 h-6 text-pink-500" />
              Aturan Relasi Ekosistem V3 (17 Aturan Deklaratif)
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Konfigurasi bilateral penegakan keterhubungan antar 7 entitas ekosistem esport Sumatera Barat.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold">
              17 Aturan Aktif
            </span>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3 text-xs text-blue-200">
          <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-white">Integritas Bilateral Database (ADR-004)</p>
            <p>
              Setiap permohonan relasi kemitraan dievaluasi secara otomatis terhadap matriks ini sebelum dicatat.
              Relasi yang memerlukan keselarasan game (seperti Atlet ke Tim) memvalidasi divisi game asal dan target.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <QuietSurface radius="2xl" elevation="raised" className="mb-6 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-300">Filter Entitas:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["all", "player", "coach", "team", "community", "school", "campus", "venue"].map((e) => (
              <button
                key={e}
                onClick={() => setSelectedEntity(e)}
                className={`px-3 py-1 rounded-lg text-xs capitalize transition-colors ${
                  selectedEntity === e
                    ? "bg-pink-600 text-white font-medium shadow-md shadow-pink-600/20"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {e === "all" ? "Semua Entitas" : e}
              </button>
            ))}
          </div>
        </QuietSurface>

        {/* Tabel Aturan Relasi */}
        <QuietSurface radius="2xl" elevation="raised" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
                <tr>
                  <th className="px-4 py-3.5">#</th>
                  <th className="px-4 py-3.5">Entitas Asal</th>
                  <th className="px-4 py-3.5">Entitas Sasaran</th>
                  <th className="px-4 py-3.5">Tipe Relasi</th>
                  <th className="px-4 py-3.5 text-center">Batas Aktif</th>
                  <th className="px-4 py-3.5 text-center">Wajib Game Sama</th>
                  <th className="px-4 py-3.5 text-center">Persetujuan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {filteredRules.map((rule, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-500">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-white capitalize px-2 py-0.5 rounded bg-slate-800 border border-white/5">
                        {rule.sourceEntityType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-white capitalize px-2 py-0.5 rounded bg-slate-800 border border-white/5">
                        {rule.targetEntityType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-pink-400 font-mono font-medium">
                        {rule.relationType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-slate-200">
                      Maks. {rule.maxActiveLimit}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {rule.gameMatchRequired ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Ya
                        </span>
                      ) : (
                        <span className="text-slate-500">Tidak</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {rule.requiresApproval ? (
                        <span className="inline-flex items-center gap-1 text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                          2 Arah
                        </span>
                      ) : (
                        <span className="text-slate-500">Otomatis</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </QuietSurface>
      </main>

      <Footer />
    </div>
  );
}
