"use client";

import React from "react";
import { AdminNavbar } from "@/components/AdminNavbar";
import { MapPin } from "lucide-react";
import { DataTable } from "@esport-sumbar/ui";
import { REGIONS } from "@esport-sumbar/contracts";

export default function AdminRegionsPage() {
  const COLUMNS = [
    { key: "code", header: "Kode Daerah" },
    { key: "name", header: "Nama Kota / Kabupaten" },
    { key: "type", header: "Jenis Wilayah" },
    {
      key: "status",
      header: "Status Wilayah",
      render: () => (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#2BB673]/20 text-[#2BB673]">
          Terdaftar Resmi
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#05051A] text-white flex">
      <AdminNavbar />

      <main className="flex-1 p-6 md:p-10 flex flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col gap-1 border-b border-white/[0.08] pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <MapPin className="w-7 h-7 text-[#FF1752]" />
            Wilayah Pengurus Daerah (19 Kota & Kabupaten)
          </h1>
          <p className="text-xs text-white/50">
            Peta pembagian cabang pengurus olahraga elektronik se-Sumatera Barat.
          </p>
        </div>

        <DataTable
          columns={COLUMNS}
          data={REGIONS}
          keyExtractor={(item: any) => item.code}
        />
      </main>
    </div>
  );
}
