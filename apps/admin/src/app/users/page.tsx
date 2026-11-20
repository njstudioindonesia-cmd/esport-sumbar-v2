"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AdminNavbar } from "@/components/AdminNavbar";
import { Users, Search, Loader2 } from "lucide-react";
import { DataTable, StatusBadge, Button, Input, Select } from "@esport-sumbar/ui";
import { getAdminUsersAction, type AdminUserItem } from "@/app/actions/users";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("all");
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadUsers() {
      try {
        const res = await getAdminUsersAction();
        if (isMounted && res.success) {
          setUsers(res.users);
        }
      } catch (err) {
        console.error("Gagal memuat pengguna:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch =
        u.displayName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.esportId.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);
      const matchBranch = branch === "all" || u.branch === branch;
      return matchSearch && matchBranch;
    });
  }, [users, search, branch]);

  const COLUMNS = [
    {
      key: "id",
      header: "ID Akun / ESPORT ID",
      render: (item: AdminUserItem) => (
        <div className="flex flex-col">
          <span className="font-mono text-xs font-bold text-[#D4AF37]">{item.esportId}</span>
          <span className="font-mono text-[10px] text-white/40">{item.id.slice(0, 8)}...</span>
        </div>
      ),
    },
    {
      key: "displayName",
      header: "Nama Pengguna",
      render: (item: AdminUserItem) => (
        <div className="flex items-center gap-2.5">
          {item.avatarUrl ? (
            <img src={item.avatarUrl} alt="" className="w-8 h-8 rounded-lg object-cover border border-white/10" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs text-white">
              {item.displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-bold text-xs text-white">{item.displayName}</span>
            <span className="text-[11px] text-white/50">{item.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: "branch",
      header: "Bidang",
      render: (item: AdminUserItem) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-white/80 uppercase">
          {item.branch}
        </span>
      ),
    },
    { key: "region", header: "Wilayah" },
    {
      key: "role",
      header: "Peran",
      render: (item: AdminUserItem) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
            item.role === "platform_admin" || item.role === "admin"
              ? "bg-[#FF1752]/20 text-[#FF4D77] border border-[#FF1752]/30"
              : "bg-white/5 text-white/50"
          }`}
        >
          {item.role}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: AdminUserItem) => <StatusBadge status={item.status as any} size="sm" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#05051A] text-white flex">
      <AdminNavbar />

      <main className="flex-1 p-6 md:p-10 flex flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col gap-1 border-b border-white/[0.08] pb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Users className="w-7 h-7 text-[#FF1752]" />
              Manajemen Pengguna & Anggota
            </h1>
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-white/70">
              {users.length} Akun Terdaftar
            </span>
          </div>
          <p className="text-xs text-white/50">
            Direktori akun terdaftar lintas 7 bidang resmi se-Sumatera Barat dari Supabase.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-[#0C0C26] p-4 rounded-xl border border-white/[0.08]">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Cari nama, email, atau ESPORT ID..."
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

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-white/40 text-xs gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Memuat data pengguna dari Supabase...
          </div>
        ) : (
          <DataTable
            columns={COLUMNS}
            data={filteredUsers}
            keyExtractor={(item: AdminUserItem) => item.id}
            emptyMessage="Belum ada data pengguna yang cocok dengan kriteria pencarian."
          />
        )}
      </main>
    </div>
  );
}
