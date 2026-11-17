"use client";

import React from "react";
import { AdminNavbar } from "@/components/AdminNavbar";
import { Network } from "lucide-react";
import { DataTable } from "@esport-sumbar/ui";
import { ECOSYSTEM_RELATION_RULES } from "@esport-sumbar/contracts";

export default function AdminRelationRulesPage() {
  const COLUMNS = [
    { key: "relationName", header: "Nama Hubungan" },
    { key: "sourceType", header: "Entitas Asal" },
    { key: "targetType", header: "Entitas Tujuan" },
    {
      key: "maxActivePerSource",
      header: "Batas Maksimal",
      render: (item: any) => item.maxActivePerSource ? `${item.maxActivePerSource} Aktif` : "Tak Terbatas",
    },
    { key: "description", header: "Deskripsi Relasi" },
  ];

  return (
    <div className="min-h-screen bg-[#05051A] text-white flex">
      <AdminNavbar />

      <main className="flex-1 p-6 md:p-10 flex flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col gap-1 border-b border-white/[0.08] pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Network className="w-7 h-7 text-[#FF1752]" />
            Aturan Relasi Ekosistem
          </h1>
          <p className="text-xs text-white/50">
            Regulasi hubungan keanggotaan atlet, klub, venue, kampus, dan sekolah.
          </p>
        </div>

        <DataTable
          columns={COLUMNS}
          data={ECOSYSTEM_RELATION_RULES}
          keyExtractor={(item: any) => `${item.sourceType}-${item.targetType}`}
        />
      </main>
    </div>
  );
}
