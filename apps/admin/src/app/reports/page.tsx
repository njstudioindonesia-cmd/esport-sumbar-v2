"use client";

import React from "react";
import { AdminNavbar } from "@/components/AdminNavbar";
import { Flag } from "lucide-react";
import { DataTable, Button } from "@esport-sumbar/ui";

export default function AdminReportsPage() {
  const COLUMNS = [
    { key: "id", header: "ID Laporan" },
    { key: "targetType", header: "Tipe Sasaran" },
    { key: "category", header: "Kategori Pelanggaran" },
    { key: "status", header: "Status" },
    {
      key: "action",
      header: "Aksi",
      render: () => <Button variant="ghost" size="sm">Tinjau</Button>,
    },
  ];

  return (
    <div className="min-h-screen bg-[#05051A] text-white flex">
      <AdminNavbar />

      <main className="flex-1 p-6 md:p-10 flex flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col gap-1 border-b border-white/[0.08] pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Flag className="w-7 h-7 text-[#F2A33A]" />
            Laporan Konten Pengguna (UGC Moderation)
          </h1>
          <p className="text-xs text-white/50">
            Penanganan aduan masyarakat terkait data profil, kartu palsu, atau spam.
          </p>
        </div>

        <DataTable
          columns={COLUMNS}
          data={[]}
          keyExtractor={(item: any) => item.id}
          emptyMessage="Tidak ada laporan konten yang belum ditindaklanjuti."
        />
      </main>
    </div>
  );
}
