"use client";

import React, { useState } from "react";
import { AdminNavbar } from "@/components/AdminNavbar";
import { Users, Search } from "lucide-react";
import { DataTable, StatusBadge, Button, Input, Select } from "@esport-sumbar/ui";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("all");

  const COLUMNS = [
    { key: "id", header: "ID Akun" },
    { key: "displayName", header: "Nama Lengkap" },
    { key: "branch", header: "Bidang" },
    { key: "region", header: "Wilayah" },
    {
      key: "status",
      header: "Status",
      render: (item: any) => <StatusBadge status={item.status} size="sm" />,
    },
    {
      key: "action",
      header: "Aksi",
      render: () => <Button variant="ghost" size="sm">Rincian</Button>,
    },
  ];

  return (
    <div className="min-h-screen bg-[#05051A] text-white flex">
      <AdminNavbar />

      <main className="flex-1 p-6 md:p-10 flex flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col gap-1 border-b border-white/[0.08] pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-[#FF1752]" />
            Manajemen Pengguna & Anggota
          </h1>
          <p className="text-xs text-white/50">
            Direktori akun terdaftar lintas 7 bidang resmi se-Sumatera Barat.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-[#0C0C26] p-4 rounded-xl border border-white/[0.08]">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Cari nama atau ID akun..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="w-48">
            <Select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              options={[
                { value: "all", label: "Semua Bidang" },
                { value: "player", label: "Pemain" },
                { value: "coach", label: "Pelatih" },
                { value: "team", label: "Tim" },
                { value: "community", label: "Komunitas" },
                { value: "venue", label: "Venue" },
                { value: "campus", label: "Kampus" },
                { value: "school", label: "Sekolah" },
              ]}
            />
          </div>
        </div>

        <DataTable
          columns={COLUMNS}
          data={[]}
          keyExtractor={(item: any) => item.id}
          emptyMessage="Belum ada data pengguna yang terdaftar."
        />
      </main>
    </div>
  );
}
