import React, { Suspense } from "react";
import AdminProvinceReviewClient from "./AdminProvinceReviewClient";
import { MOCK_PROVINCE_QUEUE } from "@/data/mockAdminData";

export function generateStaticParams() {
  return MOCK_PROVINCE_QUEUE.map((item) => ({
    id: item.id,
  }));
}

export default async function AdminProvinceReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0D12]" />}>
      <AdminProvinceReviewClient reviewId={id} />
    </Suspense>
  );
}
