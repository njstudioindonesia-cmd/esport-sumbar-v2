import React, { Suspense } from "react";
import { AdminVerificationDetailClient } from "./AdminVerificationDetailClient";
import type { Metadata } from "next";

export const instant = false;

export const metadata: Metadata = {
  title: "Tinjauan Verifikasi | ESPORT SUMBAR Admin",
};

export default async function AdminVerificationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07080C] text-slate-400 p-8 text-center">Memuat berkas verifikasi...</div>}>
      <AdminVerificationDetailClient id={id} />
    </Suspense>
  );
}
