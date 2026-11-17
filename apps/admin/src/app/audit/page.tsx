"use client";

import React, { useState } from "react";
import { AdminNavbar } from "@/components/AdminNavbar";
import { History, Search } from "lucide-react";
import { DataTable, Input, Select } from "@esport-sumbar/ui";

export default function AdminAuditLogPage() {
  const [search, setSearch] = useState("");

  const COLUMNS = [
    { key: "timestamp", header: "Waktu (WIB)" },
    { key: "actor", header: "Pelaku Aksi" },
    { key: "role", header: "Peran" },
    { key: "action", header: "Tindakan" },
    { key: "entity", header: "Entitas Sasaran" },
  ];

  return (
    <div className="min-h-screen bg-[#05051A] text-white flex">
      <AdminNavbar />

      <main className="flex-1 p-6 md:p-10 flex flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col gap-1 border-b border-white/[0.08] pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <History className="w-7 h-7 text-[#D4AF37]" />
            Log Audit Sistem (Append-Only)
          </h1>
          <p className="text-xs text-white/50">
            Jejak rekaman seluruh tindakan administratif yang tidak dapat diubah atau dihapus.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#0C0C26] p-4 rounded-xl border border-white/[0.08]">
          <div className="flex-1">
            <Input
              placeholder="Cari aksi atau ID pelaku..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        <DataTable
          columns={COLUMNS}
          data={[]}
          keyExtractor={(item: any) => item.id || Math.random().toString()}
          emptyMessage="Belum ada catatan log audit administratif."
        />
      </main>
    </div>
  );
}
