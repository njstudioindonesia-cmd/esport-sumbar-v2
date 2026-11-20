"use client";

import React, { useState, useEffect } from "react";
import { AdminNavbar } from "@/components/AdminNavbar";
import { History, Search, Loader2 } from "lucide-react";
import { DataTable, Input } from "@esport-sumbar/ui";
import { getAuditLogsAction, type AuditLogItem } from "@/app/actions/audit";

export default function AdminAuditLogPage() {
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadLogs() {
      try {
        const res = await getAuditLogsAction();
        if (isMounted && res.success) {
          setLogs(res.logs);
        }
      } catch (err) {
        console.error("Gagal memuat log audit:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadLogs();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredLogs = logs.filter((l) => {
    const q = search.toLowerCase();
    return (
      l.action.toLowerCase().includes(q) ||
      l.actor.toLowerCase().includes(q) ||
      l.targetType.toLowerCase().includes(q) ||
      l.reason.toLowerCase().includes(q)
    );
  });

  const COLUMNS = [
    { key: "occurredAt", header: "Waktu (WIB)" },
    { key: "actor", header: "Pelaku Aksi" },
    {
      key: "role",
      header: "Peran",
      render: (item: AuditLogItem) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white/10 text-white/80">
          {item.role}
        </span>
      ),
    },
    {
      key: "action",
      header: "Tindakan",
      render: (item: AuditLogItem) => (
        <span className="font-mono text-xs text-[#D4AF37] font-semibold">{item.action}</span>
      ),
    },
    { key: "targetType", header: "Tipe Sasaran" },
    { key: "reason", header: "Keterangan / Alasan" },
  ];

  return (
    <div className="min-h-screen bg-[#05051A] text-white flex">
      <AdminNavbar />

      <main className="flex-1 p-6 md:p-10 flex flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col gap-1 border-b border-white/[0.08] pb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <History className="w-7 h-7 text-[#D4AF37]" />
              Log Audit Sistem (Append-Only)
            </h1>
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-white/70">
              {logs.length} Rekaman
            </span>
          </div>
          <p className="text-xs text-white/50">
            Jejak rekaman seluruh tindakan administratif yang tersimpan permanen di Supabase.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#0C0C26] p-4 rounded-xl border border-white/[0.08]">
          <div className="flex-1">
            <Input
              placeholder="Cari tindakan, pelaku, atau keterangan log..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-white/40 text-xs gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
            Memuat data log audit dari Supabase...
          </div>
        ) : (
          <DataTable
            columns={COLUMNS}
            data={filteredLogs}
            keyExtractor={(item: AuditLogItem) => item.id}
            emptyMessage="Belum ada catatan log audit administratif."
          />
        )}
      </main>
    </div>
  );
}
