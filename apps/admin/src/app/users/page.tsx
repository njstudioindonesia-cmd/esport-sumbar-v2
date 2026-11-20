"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { AdminNavbar } from "@/components/AdminNavbar";
import {
  Users,
  Search,
  Loader2,
  Trash2,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { DataTable, StatusBadge, Button, Input, Select, Dialog } from "@esport-sumbar/ui";
import {
  getAdminUsersAction,
  deleteAdminUserAction,
  purgeStagingAccountsAction,
  type AdminUserItem,
} from "@/app/actions/users";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("all");
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Deletion state
  const [targetToDelete, setTargetToDelete] = useState<AdminUserItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Batch purge state
  const [isPurgeOpen, setIsPurgeOpen] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  // Alert/toast notification
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await getAdminUsersAction();
      if (res.success) {
        setUsers(res.users);
      } else {
        setNotification({
          type: "error",
          message: res.error || "Gagal memuat pengguna dari Supabase",
        });
      }
    } catch (err: unknown) {
      console.error("Gagal memuat pengguna:", err);
      setNotification({
        type: "error",
        message: err instanceof Error ? err.message : "Terjadi kesalahan koneksi",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const stagingAccounts = useMemo(() => {
    return users.filter((u) => u.isStaging && u.email !== "sano@gmail.com");
  }, [users]);

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

  const handleDeleteUser = async () => {
    if (!targetToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteAdminUserAction(targetToDelete.accountId);
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u.accountId !== targetToDelete.accountId));
        setNotification({
          type: "success",
          message: res.message,
        });
        setTargetToDelete(null);
      } else {
        setNotification({
          type: "error",
          message: res.message || res.error || "Gagal menghapus akun",
        });
      }
    } catch (err: unknown) {
      setNotification({
        type: "error",
        message: err instanceof Error ? err.message : "Kesalahan server saat menghapus akun",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePurgeStaging = async () => {
    setIsPurging(true);
    try {
      const res = await purgeStagingAccountsAction();
      if (res.success) {
        setNotification({
          type: "success",
          message: res.message,
        });
        setIsPurgeOpen(false);
        await loadUsers();
      } else {
        setNotification({
          type: "error",
          message: res.message || res.error || "Gagal membersihkan akun staging",
        });
      }
    } catch (err: unknown) {
      setNotification({
        type: "error",
        message: err instanceof Error ? err.message : "Kesalahan saat membersihkan akun staging",
      });
    } finally {
      setIsPurging(false);
    }
  };

  const COLUMNS = [
    {
      key: "id",
      header: "ID Akun / ESPORT ID",
      render: (item: AdminUserItem) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-[#D4AF37]">{item.esportId}</span>
            {item.isStaging && (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
                STAGING
              </span>
            )}
          </div>
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
    {
      key: "action",
      header: "Aksi",
      render: (item: AdminUserItem) => {
        const isSelf = item.email === "sano@gmail.com";
        return (
          <div className="flex items-center gap-1.5">
            <Link
              href={`/users/${item.id}`}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              title="Lihat Detail Profil"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            {!isSelf && (
              <button
                type="button"
                onClick={() => setTargetToDelete(item)}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 transition-colors"
                title="Hapus Akun dari Supabase"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#05051A] text-white flex">
      <AdminNavbar />

      <main className="flex-1 p-6 md:p-10 flex flex-col gap-6 overflow-y-auto">
        {/* Header Bar */}
        <div className="flex flex-col gap-1 border-b border-white/[0.08] pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <Users className="w-7 h-7 text-[#FF1752]" />
                Manajemen Pengguna &amp; Anggota
              </h1>
              <p className="text-xs text-white/50 mt-1">
                Direktori akun terdaftar lintas 7 bidang resmi se-Sumatera Barat langsung dari Supabase Live.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={loadUsers}
                disabled={isLoading}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/70 hover:text-white transition-all disabled:opacity-50"
                title="Segarkan Data"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#D4AF37]" : ""}`} />
              </button>

              {stagingAccounts.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPurgeOpen(true)}
                  className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono"
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  Bersihkan {stagingAccounts.length} Akun Staging
                </Button>
              )}

              <span className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-mono text-white/80">
                {users.length} Akun Terdaftar
              </span>
            </div>
          </div>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
              notification.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {notification.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="text-white/40 hover:text-white text-xs font-mono underline"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Info Box about Accounts */}
        {stagingAccounts.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-amber-300">Terdeteksi {stagingAccounts.length} Akun Pengujian (Staging)</span>
                <p className="text-white/60 text-[11px]">
                  Akun berformat <code>*.staging@esportsumbar.id</code> dibuat saat pengujian skrip otomatis awal. Anda dapat menghapusnya satu per satu melalui tombol sampah merah, atau membersihkan sekaligus menggunakan tombol di atas.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter Controls */}
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

        {/* Users Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-white/40 text-xs gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
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

        {/* Dialog Hapus Akun Tunggal */}
        <Dialog
          isOpen={!!targetToDelete}
          onClose={() => !isDeleting && setTargetToDelete(null)}
          title={
            <div className="flex items-center gap-2 text-red-400">
              <Trash2 className="w-5 h-5" />
              <span>Hapus Akun Permanen</span>
            </div>
          }
          description="Tindakan ini akan menghapus akun langsung dari database dan sistem autentikasi Supabase secara permanen."
          actions={
            <>
              <Button
                variant="ghost"
                size="sm"
                disabled={isDeleting}
                onClick={() => setTargetToDelete(null)}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-500 text-white border-0 text-xs font-bold"
                onClick={handleDeleteUser}
              >
                {isDeleting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Menghapus dari Supabase...
                  </span>
                ) : (
                  "Hapus Permanen Dari Supabase"
                )}
              </Button>
            </>
          }
        >
          {targetToDelete && (
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between items-center border-b border-white/[0.06] pb-2">
                <span className="text-white/50">Nama:</span>
                <span className="font-bold text-white">{targetToDelete.displayName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/[0.06] pb-2">
                <span className="text-white/50">Email:</span>
                <span className="font-mono text-white/90">{targetToDelete.email}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/[0.06] pb-2">
                <span className="text-white/50">ESPORT ID:</span>
                <span className="font-mono text-[#D4AF37]">{targetToDelete.esportId}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/[0.06] pb-2">
                <span className="text-white/50">Peran:</span>
                <span className="uppercase font-mono text-white/80">{targetToDelete.role}</span>
              </div>
              <p className="text-[11px] text-red-300/80 mt-1">
                ⚠️ Seluruh data profil atlet/organisasi, pengajuan verifikasi, prestasi, avatar, dan akun login Supabase Auth akan dihapus dan tidak dapat dipulihkan.
              </p>
            </div>
          )}
        </Dialog>

        {/* Dialog Bersihkan Seluruh Akun Staging */}
        <Dialog
          isOpen={isPurgeOpen}
          onClose={() => !isPurging && setIsPurgeOpen(false)}
          title={
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <span>Bersihkan Seluruh Akun Staging ({stagingAccounts.length} Akun)</span>
            </div>
          }
          description="Anda akan menghapus semua akun fiktif/pengujian yang terdaftar dari pengujian awal sistem di Supabase."
          actions={
            <>
              <Button
                variant="ghost"
                size="sm"
                disabled={isPurging}
                onClick={() => setIsPurgeOpen(false)}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={isPurging}
                className="bg-amber-600 hover:bg-amber-500 text-white border-0 text-xs font-bold"
                onClick={handlePurgeStaging}
              >
                {isPurging ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Membersihkan...
                  </span>
                ) : (
                  "Ya, Bersihkan Semua Akun Staging"
                )}
              </Button>
            </>
          }
        >
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex flex-col gap-2 text-xs">
            <p className="text-white/70">
              Total <strong className="text-white">{stagingAccounts.length} akun pengujian</strong> akan dihapus permanen dari Supabase.
            </p>
            <div className="max-h-36 overflow-y-auto space-y-1 p-2 rounded-xl bg-black/30 border border-white/5 font-mono text-[11px] text-white/60">
              {stagingAccounts.map((a) => (
                <div key={a.id} className="truncate">
                  • {a.email} ({a.displayName})
                </div>
              ))}
            </div>
            <p className="text-[11px] text-amber-300/80 mt-1">
              Akun utama Anda (<code>sano@gmail.com</code>) dan akun pengguna riil lainnya tidak akan terpengaruh.
            </p>
          </div>
        </Dialog>
      </main>
    </div>
  );
}
