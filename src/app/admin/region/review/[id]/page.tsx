import React, { Suspense } from "react";
import AdminRegionReviewClient from "./AdminRegionReviewClient";
import { MOCK_REGIONAL_QUEUE } from "@/data/mockAdminData";

export function generateStaticParams() {
  return MOCK_REGIONAL_QUEUE.map((item) => ({
    id: item.id,
  }));
}

export default async function AdminRegionReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0D12]" />}>
      <AdminRegionReviewClient reviewId={id} />
    </Suspense>
  );
}
