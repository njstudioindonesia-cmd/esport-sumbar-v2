import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminRegionNavbar } from "@/components/admin/AdminRegionNavbar";
import {
  Users,
  Search,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Filter,
} from "lucide-react";
import type { Metadata } from "next";
import type { EntityType } from "@/lib/supabase/database.types";

export const instant = false;

export const metadata: Metadata = {
  title: "Daftar Entitas Terdaftar Wilayah | PBESI Sumatera Barat",
  description: "Manajemen dan direktori entitas esport terdaftar di wilayah pengurus cabang.",
};

export default async function RegionEntitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; q?: string }>;
}) {
  const { type, q } = await searchParams;
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    redirect("/login?redirect=/admin/region/entities");
  }

  // Cek peran akun
  const { data: account } = await supabase
    .from("accounts")
    .select("role, assigned_region_id")
    .eq("id", authData.user.id)
    .single();

  if (!account || (account.role !== "region_admin" && account.role !== "prov_admin" && account.role !== "platform_operator")) {
    redirect("/dashboard");
  }

  // Kueri dari public_profiles view
  let query = supabase
    .from("public_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (account.assigned_region_id) {
    query = query.eq("region_id", account.assigned_region_id);
  }

  if (type && type !== "all") {
    query = query.eq("entity_type", type as EntityType);
  }

  if (q && q.trim()) {
    query = query.or(`display_name.ilike.%${q.trim()}%,ign.ilike.%${q.trim()}%,esport_id.ilike.%${q.trim()}%`);
  }

  const { data: entities } = await query.limit(50);

  const ENTITY_TABS = [
    { id: "all", label: "Semua" },
    { id: "player", label: "Atlet" },
    { id: "coach", label: "Pelatih" },
    { id: "team", label: "Tim" },
    { id: "community", label: "Komunitas" },
    { id: "venue", label: "Venue" },
    { id: "campus", label: "Kampus" },
    { id: "school", label: "Sekolah" },
  ];

  return (
    <div className="min-h-screen bg-[#07080C] text-white flex flex-col font-sans select-none selection:bg-[#FF1752]/20 selection:text-white">
      <AdminRegionNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-white/50 font-mono">
          <Link href="/admin/region" className="hover:text-white transition-colors">
            Panel Wilayah
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#FF1752] font-bold">Entitas Terdaftar</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-wide uppercase">
              Direktori Entitas Wilayah
            </h1>
            <p className="text-xs text-white/60 mt-1">
              Daftar seluruh entitas dan paspor digital esport yang terdaftar di yurisdiksi Anda.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono text-white/70">
              Total: {entities?.length || 0} Entitas
            </span>
          </div>
        </div>

        {/* Filter Tab Jenis Entitas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/[0.06]">
          {ENTITY_TABS.map((tab) => {
            const isActive = (type || "all") === tab.id;
            return (
              <Link
                key={tab.id}
                href={`/admin/region/entities?type=${tab.id}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#FF1752] text-white shadow-md shadow-[#FF1752]/20"
                    : "bg-[#0B0D14] hover:bg-white/[0.06] text-white/60 hover:text-white border border-white/[0.06]"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Tabel Data Entitas */}
        <div className="rounded-2xl bg-[#0B0D14] border border-white/[0.08] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#0E111A] text-white/50 font-mono uppercase text-[10px] tracking-wider border-b border-white/[0.06]">
                <tr>
                  <th className="py-3 px-4">Entitas / Nama</th>
                  <th className="py-3 px-4">ESPORT ID</th>
                  <th className="py-3 px-4">Bidang</th>
                  <th className="py-3 px-4">Game / Role</th>
                  <th className="py-3 px-4">Status Verifikasi</th>
                  <th className="py-3 px-4">Rarity</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {entities && entities.length > 0 ? (
                  entities.map((ent) => (
                    <tr key={ent.id || ent.slug} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-heading font-bold text-white text-sm">
                          {ent.display_name}
                        </div>
                        {ent.ign && <div className="text-[11px] font-mono text-[#FF4D77]">@{ent.ign}</div>}
                      </td>
                      <td className="py-3 px-4 font-mono text-white/70">
                        {ent.esport_id}
                      </td>
                      <td className="py-3 px-4 uppercase font-mono text-[11px] text-white/60">
                        {ent.entity_type}
                      </td>
                      <td className="py-3 px-4 text-white/70">
                        <div>{ent.main_game_name || "-"}</div>
                        {ent.role_name && <div className="text-[10px] text-white/40">{ent.role_name}</div>}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          ent.verification_status === "verified"
                            ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40"
                            : ent.verification_status === "regional_checked"
                            ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40"
                            : "bg-white/[0.06] text-white/50 border border-white/10"
                        }`}>
                          {ent.verification_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 uppercase font-mono text-[10px] font-bold text-white/50">
                        {ent.rarity_tier}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/${ent.entity_type}/${ent.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors text-[11px]"
                        >
                          <span>Lihat Profil</span>
                          <ExternalLink className="w-3 h-3 text-white/40" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-white/40">
                      Tidak ada entitas terdaftar yang cocok dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
