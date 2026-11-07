import React, { Suspense } from "react";
import { AdminUserDetailClient } from "./AdminUserDetailClient";
import type { Metadata } from "next";

export const instant = false;

export const metadata: Metadata = {
  title: "Inspeksi Pengguna | ESPORT SUMBAR Admin",
};

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07080C] text-slate-400 p-8 text-center">Memuat data pengguna...</div>}>
      <AdminUserDetailClient id={id} />
    </Suspense>
  );
}
