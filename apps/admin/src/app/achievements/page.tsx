"use client";

import React from "react";
import { AdminNavbar } from "@/components/AdminNavbar";
import { Trophy, Plus } from "lucide-react";
import { DataTable, Button } from "@esport-sumbar/ui";

export default function AdminAchievementsPage() {
  const COLUMNS = [
    { key: "id", header: "ID Prestasi" },
    { key: "title", header: "Nama Kejuaraan" },
    { key: "recipient", header: "Penerima" },
    { key: "rank", header: "Peringkat / Medali" },
    { key: "year", header: "Tahun" },
  ];

  return (
    <div className="min-h-screen bg-[#05051A] text-white flex">
      <AdminNavbar />

      <main className="flex-1 p-6 md:p-10 flex flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Trophy className="w-7 h-7 text-[#D4AF37]" />
              Pencatatan Prestasi Resmi
            </h1>
            <p className="text-xs text-white/50">
              Pengesahan medali kejuaraan resmi tingkat daerah, nasional, dan internasional.
            </p>
          </div>

          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Catat Prestasi Baru
          </Button>
        </div>

        <DataTable
          columns={COLUMNS}
          data={[]}
          keyExtractor={(item: any) => item.id}
          emptyMessage="Belum ada riwayat prestasi atlet yang dicatat."
        />
      </main>
    </div>
  );
}
