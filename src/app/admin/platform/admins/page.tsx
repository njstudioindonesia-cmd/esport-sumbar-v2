"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building,
  Shield,
  Clock,
  X,
  ChevronRight,
  UserCheck,
  UserX,
  MapPin,
  Lock,
} from "lucide-react";
import { AdminPlatformNavbar } from "@/components/admin/AdminPlatformNavbar";
import { Footer } from "@/components/layout/Footer";
import { REGIONS_DETAIL } from "@/data/regions";
import { MOCK_ADMIN_ACCOUNTS, AdminAccount } from "@/data/mockAdminData";

export default function AdminPlatformAdminsPage() {
  const [admins, setAdmins] = useState<AdminAccount[]>(MOCK_ADMIN_ACCOUNTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal create admin
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"admin_region" | "admin_province">("admin_region");
  const [newRegionCode, setNewRegionCode] = useState("PDG");
  const [assignmentReason, setAssignmentReason] = useState("");

  // Modal toggle status
  const [statusModalAdmin, setStatusModalAdmin] = useState<AdminAccount | null>(null);
  const [statusChangeReason, setStatusChangeReason] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !assignmentReason) return;

    const assignedRegion =
      newRole === "admin_province"
        ? { code: "SUMBAR", name: "Seluruh Sumatera Barat (Pengprov)" }
        : REGIONS_DETAIL.find((r) => r.code === newRegionCode) || REGIONS_DETAIL[0];

    const newAdmin: AdminAccount = {
      id: `adm-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      assignedRegionCode: assignedRegion.code,
      assignedRegionName: assignedRegion.name,
      status: "active",
      lastLogin: "Belum pernah login",
      createdAt: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
    };

    setAdmins((prev) => [newAdmin, ...prev]);
    showToast(`Akun admin ESI ${newName} (${assignedRegion.name}) berhasil dibuat dan dicatat di audit log.`);
    setIsCreateModalOpen(false);
    setNewName("");
    setNewEmail("");
    setAssignmentReason("");
  };

  const handleToggleStatus = () => {
    if (!statusModalAdmin || !statusChangeReason) return;

    const newStatus = statusModalAdmin.status === "active" ? "inactive" : "active";

    setAdmins((prev) =>
      prev.map((a) => (a.id === statusModalAdmin.id ? { ...a, status: newStatus } : a))
    );

    showToast(
      `Status akun ${statusModalAdmin.name} diubah menjadi ${newStatus.toUpperCase()}. Alasan tercatat di audit log.`
    );
    setStatusModalAdmin(null);
    setStatusChangeReason("");
  };

  const filteredAdmins = admins.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.assignedRegionName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filterRole === "all" || a.role === filterRole;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col font-sans">
      <AdminPlatformNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* TOAST FEEDBACK */}
        {toastMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1E28] border border-[#22C55E] text-white text-xs font-heading font-medium shadow-2xl animate-in slide-in-from-top-4">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* BREADCRUMB */}
        <div className="flex flex-col gap-2 mb-6">
          <nav className="flex items-center gap-2 text-xs text-[#9AA3B2] font-mono mb-1">
            <Link href="/admin/platform" className="hover:text-white transition-colors">
              Operator Platform
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#3B82F6] font-bold">Kelola Akun Admin ESI</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262B38] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight flex items-center gap-2.5">
                  <Users2 className="w-7 h-7 text-[#3B82F6]" />
                  <span>Manajemen Akun Verifikator ESI (Daerah & Provinsi)</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#3B82F6]/15 border border-[#3B82F6]/30 text-xs font-mono font-bold text-[#3B82F6]">
                  {admins.length} Administrator
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#9AA3B2] mt-1 max-w-2xl leading-relaxed">
                Daftarkan akun pengurus cabang ESI Kota/Kabupaten dan pengurus provinsi. Setiap penambahan hak akses atau penonaktifan akun wajib menyertakan alasan yang dicatat di audit log.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white text-xs font-heading font-extrabold uppercase tracking-wider hover:brightness-110 shadow-lg shadow-blue-950/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Admin ESI Baru</span>
            </button>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="p-4 rounded-2xl bg-[#12151C] border border-[#262B38] mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama pejabat, email, atau wilayah penugasan..."
              className="w-full bg-[#161922] border border-[#262B38] focus:border-[#3B82F6] rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-[#161922] border border-[#262B38] text-xs font-medium text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#3B82F6]"
          >
            <option value="all">Semua Peran ESI</option>
            <option value="admin_region">Admin Daerah (Pengcab)</option>
            <option value="admin_province">Admin Provinsi (Pengprov)</option>
          </select>
        </div>

        {/* ADMINS TABLE (DESKTOP) & CARDS (MOBILE) */}
        {filteredAdmins.length > 0 ? (
          <div className="bg-[#12151C] border border-[#262B38] rounded-2xl overflow-hidden shadow-xl">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#161922] border-b border-[#262B38] text-gray-400 font-heading font-bold uppercase tracking-wider">
                    <th className="p-3.5">Nama Pejabat ESI</th>
                    <th className="p-3.5">Email Kredensial</th>
                    <th className="p-3.5">Tingkat Peran</th>
                    <th className="p-3.5">Wilayah Penugasan (RLS)</th>
                    <th className="p-3.5">Status Akun</th>
                    <th className="p-3.5">Terakhir Aktif</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#262B38]/70">
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-[#161922]/70 transition-colors">
                      {/* NAMA */}
                      <td className="p-3.5">
                        <div className="flex flex-col">
                          <strong className="text-white text-xs font-heading uppercase">
                            {admin.name}
                          </strong>
                          <span className="text-[10px] text-gray-500 font-mono">
                            Dibuat: {admin.createdAt}
                          </span>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td className="p-3.5 font-mono text-gray-300">
                        {admin.email}
                      </td>

                      {/* PERAN */}
                      <td className="p-3.5 whitespace-nowrap">
                        {admin.role === "admin_province" ? (
                          <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono font-bold flex items-center gap-1 w-max">
                            <Shield className="w-3 h-3" />
                            Admin Provinsi
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] text-[10px] font-mono font-bold flex items-center gap-1 w-max">
                            <Building className="w-3 h-3" />
                            Admin Daerah
                          </span>
                        )}
                      </td>

                      {/* WILAYAH PENUGASAN */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span className="text-white font-medium">{admin.assignedRegionName}</span>
                          <span className="text-[10px] font-mono text-gray-400">
                            ({admin.assignedRegionCode})
                          </span>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="p-3.5 whitespace-nowrap">
                        {admin.status === "active" ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#22C55E]/15 text-[#22C55E] text-[10px] font-mono font-bold border border-[#22C55E]/30">
                            Aktif
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-red-950/60 text-red-400 text-[10px] font-mono font-bold border border-red-800">
                            Nonaktif
                          </span>
                        )}
                      </td>

                      {/* TERAKHIR LOGIN */}
                      <td className="p-3.5 text-gray-400 font-mono text-[11px] whitespace-nowrap">
                        {admin.lastLogin}
                      </td>

                      {/* AKSI */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setStatusModalAdmin(admin);
                            setStatusChangeReason("");
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase transition-colors ${
                            admin.status === "active"
                              ? "bg-[#1A1E28] hover:bg-red-950/40 text-gray-300 hover:text-red-400 border border-[#262B38]"
                              : "bg-[#22C55E] hover:brightness-110 text-black font-extrabold"
                          }`}
                        >
                          {admin.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="md:hidden divide-y divide-[#262B38]">
              {filteredAdmins.map((admin) => (
                <div key={admin.id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#D4AF37]">
                        {admin.role === "admin_province" ? "Pengprov Sumbar" : "Pengcab Daerah"}
                      </span>
                      <h4 className="font-heading font-bold text-sm text-white uppercase mt-0.5">
                        {admin.name}
                      </h4>
                      <span className="text-xs text-gray-400 font-mono">{admin.email}</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        admin.status === "active"
                          ? "bg-[#22C55E]/20 text-[#22C55E]"
                          : "bg-red-950 text-red-400"
                      }`}
                    >
                      {admin.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-300 pt-2 border-t border-[#262B38]">
                    <span>Wilayah: {admin.assignedRegionName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setStatusModalAdmin(admin);
                        setStatusChangeReason("");
                      }}
                      className="px-3 py-1 rounded-lg bg-[#1A1E28] text-xs font-heading font-bold text-[#D4AF37]"
                    >
                      Ubah Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-[#12151C] border border-[#262B38] text-xs text-gray-400">
            Tidak ada akun admin yang sesuai dengan pencarian Anda.
          </div>
        )}
      </main>

      {/* MODAL 1: TAMBAH ADMIN BARU */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#12151C] border border-[#262B38] rounded-2xl max-w-lg w-full p-6 flex flex-col gap-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#262B38]">
              <div className="flex items-center gap-2">
                <Users2 className="w-5 h-5 text-[#3B82F6]" />
                <h3 className="font-heading font-bold text-base uppercase text-white">
                  Daftarkan Akun Admin ESI Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-heading text-gray-300 font-bold uppercase">
                  Nama Lengkap Pejabat ESI:
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Rahmat Ilahi, S.Sos (Ketua Bid. Atlet)"
                  className="w-full bg-[#0B0D12] border border-[#262B38] focus:border-[#3B82F6] rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-heading text-gray-300 font-bold uppercase">
                  Alamat Email Resmi:
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="admin.wilayah@esi-sumbar.id"
                  className="w-full bg-[#0B0D12] border border-[#262B38] focus:border-[#3B82F6] rounded-xl p-3 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-heading text-gray-300">Tingkat Peran:</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="bg-[#0B0D12] border border-[#262B38] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="admin_region">Admin Daerah (Pengcab)</option>
                    <option value="admin_province">Admin Provinsi (Pengprov)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-heading text-gray-300">Wilayah Penugasan:</label>
                  <select
                    disabled={newRole === "admin_province"}
                    value={newRegionCode}
                    onChange={(e) => setNewRegionCode(e.target.value)}
                    className="bg-[#0B0D12] border border-[#262B38] rounded-xl p-2.5 text-xs text-white focus:outline-none disabled:opacity-50"
                  >
                    {newRole === "admin_province" ? (
                      <option value="SUMBAR">Seluruh Sumatera Barat</option>
                    ) : (
                      REGIONS_DETAIL.map((r) => (
                        <option key={r.code} value={r.code}>
                          {r.name} ({r.code})
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-heading text-gray-300 font-bold uppercase">
                  Alasan Penugasan & Nomor Surat Keputusan (Wajib Audit):
                </label>
                <textarea
                  rows={3}
                  required
                  value={assignmentReason}
                  onChange={(e) => setAssignmentReason(e.target.value)}
                  placeholder="Contoh: Surat Tugas Pengcab ESI Kota Padang No. 04/SK/ESI-PDG/2026..."
                  className="w-full bg-[#0B0D12] border border-[#262B38] focus:border-[#3B82F6] rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262B38]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-heading text-gray-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white text-xs font-heading font-extrabold uppercase tracking-wider hover:brightness-110 shadow-md"
                >
                  Buat Akun & Catat Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: KONFIRMASI STATUS / ALASAN WAJIB */}
      {statusModalAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#12151C] border border-[#262B38] rounded-2xl max-w-md w-full p-6 flex flex-col gap-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setStatusModalAdmin(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  statusModalAdmin.status === "active"
                    ? "bg-red-950 text-red-400 border border-red-700"
                    : "bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40"
                }`}
              >
                {statusModalAdmin.status === "active" ? (
                  <UserX className="w-5 h-5" />
                ) : (
                  <UserCheck className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="font-heading font-bold text-base uppercase text-white">
                  {statusModalAdmin.status === "active" ? "Nonaktifkan Akun Admin" : "Aktifkan Akun Admin"}
                </h3>
                <p className="text-xs text-gray-400">{statusModalAdmin.name}</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Anda akan mengubah status akun <strong>{statusModalAdmin.name}</strong> ({statusModalAdmin.assignedRegionName}) menjadi{" "}
              <strong className={statusModalAdmin.status === "active" ? "text-red-400" : "text-[#22C55E]"}>
                {statusModalAdmin.status === "active" ? "NONAKTIF" : "AKTIF"}
              </strong>
              . Masukkan alasan perubahan resmi:
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-heading text-gray-300">
                Alasan Perubahan Status (Wajib):
              </label>
              <textarea
                rows={3}
                required
                value={statusChangeReason}
                onChange={(e) => setStatusChangeReason(e.target.value)}
                placeholder="Contoh: Masa bakti kepengurusan berakhir atau mutasi tugas..."
                className="w-full bg-[#0B0D12] border border-[#262B38] focus:border-[#3B82F6] rounded-xl p-3 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#262B38]">
              <button
                type="button"
                onClick={() => setStatusModalAdmin(null)}
                className="px-4 py-2 rounded-xl text-xs font-heading text-gray-400 hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!statusChangeReason.trim()}
                onClick={handleToggleStatus}
                className={`px-5 py-2.5 rounded-xl text-xs font-heading font-extrabold uppercase tracking-wider disabled:opacity-40 transition-colors ${
                  statusModalAdmin.status === "active"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-[#22C55E] text-black hover:brightness-110"
                }`}
              >
                Konfirmasi Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
