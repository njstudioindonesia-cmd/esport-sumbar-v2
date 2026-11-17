"use client";

import React from "react";
import { AdminNavbar } from "@/components/AdminNavbar";
import { Gamepad2, Plus } from "lucide-react";
import { DataTable, Button } from "@esport-sumbar/ui";
import { OFFICIAL_GAMES } from "@esport-sumbar/contracts";

export default function AdminGamesPage() {
  const COLUMNS = [
    { key: "id", header: "Kode" },
    { key: "name", header: "Nama Cabang Game" },
    { key: "genre", header: "Genre" },
    { key: "publisher", header: "Penerbit" },
    {
      key: "status",
      header: "Status",
      render: (item: any) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#2BB673]/20 text-[#2BB673]">
          Aktif
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#05051A] text-white flex">
      <AdminNavbar />

      <main className="flex-1 p-6 md:p-10 flex flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Gamepad2 className="w-7 h-7 text-[#FF1752]" />
              Katalog Game Resmi
            </h1>
            <p className="text-xs text-white/50">
              Daftar cabang olahraga elektronik resmi yang dipertandingkan di Sumatera Barat.
            </p>
          </div>

          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Tambah Cabang Game
          </Button>
        </div>

        <DataTable
          columns={COLUMNS}
          data={OFFICIAL_GAMES}
          keyExtractor={(item: any) => item.id}
        />
      </main>
    </div>
  );
}
